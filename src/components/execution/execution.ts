import type { InstanceInfo } from '@/hooks/useEvaluationData';
import { getAction, getDecision, getFirstPhase, getNode } from '@/lib/phase';
import type { AIMessage, Chat } from '@/model/chat';
import type { Action } from '@/model/diagram';
import type { EvaluationResultResponse, ModelError } from '@/model/evaluation';
import type { IntentInstance } from '@/model/model';
import type { RequestError } from '@/model/request';
import { finalizeDraft, generateMessage, sendMessage, updateDraft } from '@/services/chatService';
import { createChat, getInstance } from '@/services/instanceService';
import { evaluateMessage, setMessageScore } from '@/services/messageService';
import { unzip } from 'unzipit';


export type ModelInfo = {
    id: string,
    graderModel: File,
    modelDescription: string
}

// get from zip file and return an array of models
export const loadZipModels = async (zipFile: Blob): Promise<ModelInfo[]> => {
    // unzip the file
    // read the files (graderModel is `ID.cdm` and modelDescription is `ID.txt`)
    // return the array of models

    const { entries } = await unzip(zipFile);

    const pairs: Record<string, ModelInfo> = {}

    // print all entries and their sizes
    for (const [name, entry] of Object.entries(entries)) {
        const fileName = name.split('/').pop() ?? "";
        console.log(fileName, entry.size);

        if (fileName.endsWith('.domain_model.cdm')) {
            const id = fileName.substring(0, fileName.length - '.domain_model.cdm'.length);
            pairs[id] = {
                id,
                graderModel:
                    new File([await entry.blob()], fileName),
                modelDescription: pairs[id]?.modelDescription ?? undefined
            }
        } else if (fileName.endsWith('.txt')) {
            const id = fileName.substring(0, fileName.length - 4);
            pairs[id] = {
                id,
                graderModel: pairs[id]?.graderModel ?? undefined,
                modelDescription: await entry.text()
            }
        }

    }

    console.log("pairs", pairs);

    for (const [id, pair] of Object.entries(pairs)) {
        if (pair.graderModel === undefined || pair.modelDescription === undefined) {
            delete pairs[id];
        }
    }

    return Object.values(pairs);
}

export enum InstanceStatus {
    PENDING_NEW_CHAT = "PENDING_NEW_CHAT",
    PENDING_MODEL_DESCRIPTION = "PENDING_MODEL_DESCRIPTION",
    PENDING_USER = "PENDING_USER",
    PENDING_AI = "PENDING_AI",
    PENDING_SCORE = "PENDING_SCORE",
    DONE = "DONE"
}

export const getStatus = (instance: IntentInstance) => {
    const lastChatSuccess = instance.chats.length > 0 && instance.chats[instance.chats.length - 1].actualNode === "end"
    const lastChatNotFinalized = instance.chats.length > 0 && !instance.chats[instance.chats.length - 1].finalized

    // console.log(lastChatSuccess, instance.chats.length, instance.maxChats)

    if (instance.chats.length >= instance.maxChats && instance.chats[instance.chats.length - 1].finalized || lastChatSuccess) {
        return InstanceStatus.DONE;
    }

    if (!lastChatNotFinalized || instance.chats.length === 0) {
        return InstanceStatus.PENDING_NEW_CHAT;
    }

    const lastChat: Chat = instance.chats[instance.chats.length - 1];

    if ("arrows" in getNode(lastChat.actualNode)) {
        return InstanceStatus.PENDING_SCORE;
    }

    const messages = lastChat.promptIterations
        .flatMap(iteration => iteration.messages)
    messages.forEach((a) => a.timestamp = new Date(Date.parse(a.timestamp as any as string)))

    const sortedMessages = messages
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (lastChat && sortedMessages.length > 0) {
        const lastMessage = sortedMessages[sortedMessages.length - 1];
        if (lastMessage.type === "user") {
            return InstanceStatus.PENDING_AI;
        } else {

            if ((lastMessage as AIMessage).score === -2) {
                return InstanceStatus.PENDING_SCORE;
            }

            return InstanceStatus.PENDING_USER;
        }
    }

    return InstanceStatus.PENDING_MODEL_DESCRIPTION;
}

export const executeAction = async (execution: InstanceInfo, instance: IntentInstance, status: InstanceStatus) => {
    let lastChat: Chat, createdMessage: any, lastMessage: AIMessage
    let content: string

    switch (status) {
        case InstanceStatus.PENDING_NEW_CHAT:
            // create a new chat
            const newChat = await createChat(instance.id)

            if (`requestError` in newChat) {
                throw newChat
            }

            execution.status = "running"

            await updateDraft(newChat.id, { actualNode: getFirstPhase() })

            break
        case InstanceStatus.PENDING_MODEL_DESCRIPTION:
            lastChat = instance.chats[instance.chats.length - 1]

            console.log("description", execution.description)

            createdMessage = await sendMessage(lastChat.id, {
                content: execution.description,
                promptType: getFirstPhase(),
                manual: false
            })

            if (`requestError` in createdMessage) {
                throw createdMessage
            }

            await updateDraft(lastChat.id, { actualNode: getFirstPhase() })
            break
        case InstanceStatus.PENDING_USER:
            lastChat = instance.chats[instance.chats.length - 1]
            let action = getAction(lastChat.actualNode)

            content = generateContent(execution.evaluation as EvaluationResultResponse, action)

            if (content === "") {
                throw new Error("Content generation failed")
            }

            content = generateFullPrompt(content, action, false)

            if (content === "") {
                throw new Error("Prompt generation failed")
            }

            console.log("content", content)

            createdMessage = await sendMessage(lastChat.id, {
                content: content,
                promptType: lastChat.actualNode,
                manual: false
            })

            if (`requestError` in createdMessage) {
                createdMessage = createdMessage as RequestError

                if (createdMessage.status !== 400) {
                    throw createdMessage
                }

                console.log("response", createdMessage)
                execution.status = "failed"
                await finalizeDraft(lastChat.id)
            }

            break
        case InstanceStatus.PENDING_AI:
            lastChat = instance.chats[instance.chats.length - 1]

            let resultMessage = await generateMessage(lastChat.id)

            if (typeof resultMessage !== "string") {
                throw resultMessage
            }

            // todo: add evaluation and save it somewhere?
            createdMessage = await sendMessage(lastChat.id, {
                content: resultMessage,
                promptType: lastChat.actualNode,
                manual: false,
                score: -2
            })

            if (`requestError` in createdMessage) {
                throw createdMessage
            }

            break
        case InstanceStatus.PENDING_SCORE:

            // throw new Error("Not implemented")
            lastChat = instance.chats[instance.chats.length - 1]
            lastMessage = lastChat.promptIterations.flatMap(iteration => iteration.messages)
                .filter(message => message.type === "ai")
                .map(message => message as AIMessage)
                .map(message => {
                    message.timestamp = new Date(Date.parse(message.timestamp as any as string))
                    return message
                })
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]

            console.log("lastMessageS", lastMessage)

            let evaluation = await evaluateMessage(lastMessage.id)

            if (`requestError` in evaluation) {
                throw evaluation
            }

            console.log("evaluation", evaluation)

            execution.evaluation = evaluation as EvaluationResultResponse

            const nextPhase = getNextPhase(getAction(lastChat.actualNode), execution.evaluation ?? {} as EvaluationResultResponse)

            await updateDraft(lastChat.id, { actualNode: nextPhase.id })
            await setMessageScore(lastMessage.id, { score: execution.evaluation.score })

            if (nextPhase.id === "end") {
                execution.status = "completed"
                await finalizeDraft(lastChat.id)
            }

            console.log("nextPhase", nextPhase)
            break
        // throw new Error("Not implemented")
        case InstanceStatus.DONE:
            break
    }

    return await getInstance(instance.id) as IntentInstance
}

const generateFullPrompt = (currentText: string, { prePrompt = '', postPrompt = '', fewShot }: Action, useFewShot: boolean) => {
    let result = prePrompt

    result = result.concat(currentText)

    if (currentText.length == 0 || postPrompt.length > 0) result = result.concat('\n')

    result = result.concat(postPrompt)

    if (useFewShot && fewShot) {
        result = fewShot?.concat('\n').concat(result)
    }

    return result
}

const generateContent = (evaluation: EvaluationResultResponse, action: Action) => {
    if (evaluation.errors.length == 0) {
        throw new Error("No errors found while evaluating and tried to generate new content")
    }

    let type = action.id.replace("_prompt", "")

    let typeErrors = evaluation.errors.find(error => error.type === type) ?? null

    if (typeErrors == null) {
        throw new Error("Errors not found with type of " + type + " while evaluating")
    }

    let promptContent = ""

    const groupedErrors = typeErrors.errors.reduce((acc, error) => {
        if (!acc.has(error.error)) {
            acc.set(error.error, [])
        }

        acc.get(error.error)?.push(error)
        return acc
    }, new Map<string, ModelError[]>())

    console.log("groupedErrors", groupedErrors)
    groupedErrors.forEach((errors, error) => {
        let content = ""
        let template = action.prompts[error]

        if (template == null) {
            throw new Error("Prompt not found with error of " + error)
        }

        if (template.group) {
            content = template.template.replace("{0}", errors
                .flatMap(error => error.values).join(", "))
        } else {
            errors.forEach(error => {
                let lineContent = template.template

                error.values.forEach((value, index) => {
                    lineContent = lineContent.replace(`{${index}}`, value)
                })

                content = content.concat(lineContent).concat("\n")
            })
        }

        promptContent = promptContent.concat("\n").concat(content)
    })

    console.log("promptContent", promptContent)


    return promptContent
}

const getNextPhase = (action: Action, evaluation: EvaluationResultResponse) => {
    let phase = getDecision(action.to?.split(":")[1] ?? "")
    let end = false

    if (phase == null) {
        throw new Error("Phase not found while evaluating")
    }

    console.log("evaluation", evaluation)
    console.log("firstPhase", phase.id)

    while (!evaluation.errors.find(error => error.type === phase.id)) {
        let nextDecision = phase.arrows.find(arrow => arrow.nextDecision)?.to ?? ""

        if (nextDecision == "") {
            end = true
            break;
        }

        phase = getDecision(nextDecision)

        if (phase == null) {
            throw new Error("Phase not found while evaluating, from " + (action.to?.split(":")[1] ?? "") + " to " + nextDecision)
        }

        console.log("nextPhase", phase.id)
    }

    console.log("endPhase", phase.id)

    if (end) {
        return getAction("end")
    }

    return getAction(phase.arrows.find(arrow => !arrow.nextDecision)?.to ?? "")
}