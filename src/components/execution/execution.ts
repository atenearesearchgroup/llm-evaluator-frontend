import type { DataInfo, InstanceInfo } from '@/hooks/useEvaluationData';
import { getAction, getDecision, getFirstPhase, getNode } from '@/lib/phase';
import type { AIMessage, Chat } from '@/model/chat';
import type { Action } from '@/model/diagram';
import type { EvaluationResultResponse } from '@/model/evaluation';
import type { IntentInstance } from '@/model/model';
import type { CreateMessageRequest } from '@/model/request';
import { finalizeDraft, generateMessage, getChat, sendMessage, updateDraft } from '@/services/chatService';
import { createChat, getInstance } from '@/services/instanceService';
import { evaluateMessage, setMessageScore } from '@/services/messageService';
import { unzip } from 'unzipit';
import { EMPTY_PATH } from 'zod';


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

    console.log(lastChatSuccess, instance.chats.length, instance.maxChats)

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

            console.log(lastMessage)

            if ((lastMessage as AIMessage).score === -1) {
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

            content = generateContent(execution.evaluation as EvaluationResultResponse)

            if(content === "") {
                throw new Error("Content generation failed")
            }

            createdMessage = await sendMessage(lastChat.id, {
                content: content,
                promptType: lastChat.actualNode,
                manual: false
            })

            if (`requestError` in createdMessage) {
                throw createdMessage
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
                score: -1
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
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())[0]

            console.log("lastMessageS", lastMessage)

            let evaluation = await evaluateMessage(lastMessage.id)

            if (`requestError` in evaluation) {
                throw evaluation
            }

            console.log("evaluation", evaluation)

            execution.evaluation = evaluation as EvaluationResultResponse

            const nextPhase = getNextPhase(getAction(lastChat.actualNode), execution.evaluation ?? {} as EvaluationResultResponse)
            
            await updateDraft(lastChat.id, { actualNode: nextPhase.id })
            await setMessageScore(lastMessage.id, { score: execution.evaluation.score})

            console.log("nextPhase", nextPhase)

        throw new Error("Not implemented")
    }

    return await getInstance(instance.id) as IntentInstance
}

const generateContent = (evaluation: EvaluationResultResponse) => {

    if (evaluation.errors.length > 0) {


    }

    return ""
}

const getNextPhase = (action: Action, evaluation: EvaluationResultResponse) => {
    let phase = getDecision(action.to?.split(":")[1] ?? "")
    let end = false

    if (phase == null) {
        throw new Error("Phase not found while evaluating")
    }

    console.log("firstPhase", phase.id)

    while(!evaluation.errors.find(error => error.type === phase.id)) {
        let nextDecision = phase.arrows.find(arrow => arrow.nextDecision)?.to ?? ""

        if(nextDecision == "") {
            end = true
            break;
        }

        phase = getDecision(nextDecision)
    
        if (phase == null) {
            throw new Error("Phase not found while evaluating, from "+(action.to?.split(":")[1] ?? "") + " to " + nextDecision)
        }
    }

    console.log("endPhase", phase.id)

    if(end) {
        return getAction("end")
    }

    return getAction(phase.arrows.find(arrow => !arrow.nextDecision)?.to ?? "")
}

const executeDecision = async (data: any, toast: any) => {
    const arrow = decision.arrows.find(arrow => arrow.to === data.decision)

    if (!arrow) {
        console.error("Arrow not found")
        return
    }

    if (!arrow.nextDecision) {
        const chat = await getChat(draftId)

        if ('requestError' in chat) {
            toast({
                title: "Error",
                description: chat.message,
                variant: "destructive"
            })
            return
        }

        if (checkExceededMaxRepeatingPrompt(chat, instance, arrow.to)) {
            toast({
                title: "Error",
                description: "Chat has been finalized, due to maximum repeating prompts reached",
                variant: "destructive"
            })

            setTimeout(() => {
                window.location.reload()
            }, 2500)
            return
        }

    }

    const phaseId = (arrow.nextDecision ? "decision:" : "") + arrow.to

    const response = await updateDraft(draftId, { actualNode: phaseId })

    if ('requestError' in response) {
        toast(
            {
                title: "Error",
                description: response.message,
                variant: "destructive"
            }
        )
    } else {
        toast(
            {
                title: "Success",
                description: "Successfully updated chat",
                className: "bg-lime-600"
            }
        )

        if (!arrow.nextDecision && getAction(arrow.to).to == null) {
            const finalizeResponse = await finalizeDraft(draftId, true)

            if ('requestError' in finalizeResponse) {
                toast(
                    {
                        title: "Error",
                        description: finalizeResponse.message,
                        variant: "destructive"
                    }
                )
            }

        }

        setTimeout(() => {
            window.location.reload()
        }, 800)
    }
}

const sendRequest = async (phase: Action, draft: Chat, validSyntax: boolean, input: string, response?: string, score?: number) => {
    const inputRequest: CreateMessageRequest = {
        content: input,
        promptType: phase.id
    }

    if (!validSyntax)
        score = -1

    // Added just in case response generation is added
    const responseRequest: CreateMessageRequest | undefined = response ? {
        content: response,
        manual: true,
        promptType: phase.id,
        score: score ?? 0
    } : undefined


    let invalid = await createMessage(draft, inputRequest)

    if (invalid) {
        return [false, invalid.message]
    }

    if (responseRequest == null) {
        return [false, "No response provided"]
    } else {
        invalid = await createMessage(draft, responseRequest)

        if (invalid) {
            return [false, invalid.message]
        }
    }

    const updatedChat = await getChat(draft.id)

    if (!('requestError' in updatedChat) && updatedChat.finalized) {
        return [true, "Chat has been finalized, due to maximum errors reached"]
    }

    if (!validSyntax) {
        return [true, "Message has been sent, but the phase has not been updated"]
    }

    const updateRequest = await updateDraft(draft.id, { actualNode: phase.to })

    if ('requestError' in updateRequest) {
        return [false, updateRequest.message]
    }

    const toAction = phase.to == null ? null : getAction(phase.to)

    if (phase.to == null || toAction != null && toAction.to == null) {
        const invalidDraft = await finalizeDraft(draft.id, true)

        if ('requestError' in invalidDraft) {
            return [false, invalidDraft.message]
        }

        return [true, "Chat has been finalized"]
    }

    return [true, "Message has been sent"]

}