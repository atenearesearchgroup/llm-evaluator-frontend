import type { DataInfo, InstanceInfo } from "@/hooks/useEvaluationData";
import type { Chat } from "@/model/chat";
import type { CategoryError } from "@/model/evaluation";
import type { EvaluationSettings, IntentInstance, ModelSettings } from "@/model/model";
import { getInstance } from "@/services/instanceService";

const dateFormat = new Intl.DateTimeFormat("es", {
    dateStyle: "short",
    timeStyle: "short"
});

type SerializedMessage = {
    type: string,
    text: string,
    timestamp: string,
    score?: number
}

type SerializedIteration = {
    promptType: string,
    prompts: number,
    score: number,
    messages: SerializedMessage[],

}

export const exportJson = async (dataInfo: DataInfo) => {
    let output = {
        instances: {} as Record<string, any>,
        modelSettings: undefined as ModelSettings | undefined,
        evaluationSettings: undefined as EvaluationSettings | undefined
    }

    for (const instanceData of dataInfo.instances) {
        const instance = await getInstance(instanceData.id)
        if (`requestError` in instance) {
            console.error(instance)
            return
        }

        const json = generateJson(instance, instanceData)
        output.instances[instance.intentModel?.displayName || instanceData.id] = json;

        if (!output.modelSettings) {
            const modelSettings = instance.modelSettings

            // remove id from modelSettings
            delete modelSettings.id

            output.modelSettings = modelSettings
        }
        if (!output.evaluationSettings)
            output.evaluationSettings = {
                maxErrors: instance.maxErrors,
                maxChats: instance.maxChats,
                maxRepeatingPrompt: instance.maxRepeatingPrompt
            }

    }

    const derivedOutput = {
        options: {
            model: output.modelSettings,
            evaluation: output.evaluationSettings
        },
        instances: output.instances
    }
    console.log("final output", derivedOutput)
    
    return derivedOutput
}

const generateJson = (instance: IntentInstance, instanceData: InstanceInfo) => {
    const output = {
        //id: instance.id,
        //modelName: instance.intentModel?.displayName,
        lastDate: "",
        score: {
            highest: -1,
            last: instanceData.evaluation?.score,
            max: instanceData.evaluation?.maxScore,
            reason: undefined as string | undefined,
            errors: undefined as CategoryError[] | undefined,
            syntaxErrors: undefined as string[] | undefined,
        },
        chats: [] as any[]
    }

    let lastDate = new Date(0)
    let highestScore = -2;

    instance.chats.forEach((draft: Chat) => {
        if (!draft.finalized) return

        // const messages: (SerializedMessage)[] = []

        const iterations: (SerializedIteration)[] = []

        draft.promptIterations.forEach((iteration) => {
            const maxScore = iteration.messages.reduce((acc, message) => Math.max(acc, 'score' in message ? message.score : -2), -2)
            iterations.push({
                promptType: iteration.type,
                score: maxScore,
                prompts: iteration.messages.filter((message) => message.type === "user").length,
                messages: iteration.messages.map((message) => {
                    return {
                        type: message.type,
                        text: message.content,
                        timestamp: dateFormat.format(new Date(Date.parse(message.timestamp as any as string))),
                        score: message.type === "ai" ? message.score : undefined
                    }
                }),
            })
        })


        // draft.promptIterations.forEach((iteration) => {
        //     iteration.messages.forEach((message) => {
        //         // const messageCopy = { ...message, promptType: iteration.type }
        //         messages.push(message)
        //     })
        // })

        const serializedDraft = {
            chatNumber: draft.draftNumber,
            highestScore: iterations.reduce((acc, iteration) => Math.max(acc, iteration.score), 0),
            iterations: iterations
        }

        lastDate = new Date(Math.max(lastDate.getTime(),
            ...draft.promptIterations
                .flatMap(it=>it.messages)
                .map(message => Date.parse(message.timestamp as any as string))))
        highestScore = Math.max(highestScore, serializedDraft.highestScore)

        output.chats.push(serializedDraft)

    })

    const formattedDate = dateFormat.format(lastDate)
    output.lastDate = formattedDate
    output.score.highest = highestScore

    if(output.score.last === -1) {
        output.score.reason = "No valid syntax"
    } else {
        delete output.score["reason"]
    }

    if(output.score.highest !== output.score.max) {
        output.score.errors = instanceData.evaluation?.errors
    } 

    if(instanceData.evaluation?.syntaxErrors) {
        output.score.syntaxErrors = instanceData.evaluation?.syntaxErrors;
    } else delete output.score["syntaxErrors"]

    if(!output.score.errors) {   
        delete output.score["errors"]
    }


    // output.status = output.

    return output
}