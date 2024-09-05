import type { DataInfo, InstanceInfo } from "@/hooks/useEvaluationData";
import type { Chat, Message } from "@/model/chat";
import type { EvaluationSettings, IntentInstance, ModelSettings } from "@/model/model";
import { getInstance } from "@/services/instanceService";

const dateFormat = new Intl.DateTimeFormat("es", {
    dateStyle: "short",
    timeStyle: "short"
});

type SerializedIteration = {
    promptType: string,
    prompts: number,
    score: number,
    messages: Message[],

}

export const exportJson = async (dataInfo: DataInfo) => {
    const output = {
        instances: [] as any[],
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
        output.instances.push(json)

        if (!output.modelSettings) {
            const modelSettings = instance.modelSettings

            // remove id from modelSettings

            delete modelSettings.id

            output.modelSettings = instance.modelSettings
        }
        if (!output.evaluationSettings)
            output.evaluationSettings = {
                maxErrors: instance.maxErrors,
                maxChats: instance.maxChats,
                maxRepeatingPrompt: instance.maxRepeatingPrompt
            }

        console.log("output", output)
    }

    console.log("final output", output)

    return output
}

const calculateMetrics = (instance: IntentInstance, instanceData: InstanceInfo) => {
    return null
}

const generateJson = (instance: IntentInstance, instanceData: InstanceInfo) => {
    const output = {
        id: instance.id,
        score: instanceData.evaluation?.score,
        maxScore: instanceData.evaluation?.maxScore,
        modelName: instance.intentModel?.displayName,
        chats: [] as any[],
        lastDate: ""
    }

    let lastDate = new Date(0)

    instance.chats.forEach((draft: Chat) => {
        if (!draft.finalized) return

        const messages: (Message & { promptType: string })[] = []

        const iterations: (SerializedIteration)[] = []

        draft.promptIterations.forEach((iteration) => {
            const maxScore = iteration.messages.reduce((acc, message) => Math.max(acc, 'score' in message ? message.score : 0), 0)
            iterations.push({
                promptType: iteration.type,
                score: maxScore,
                prompts: iteration.messages.filter((message) => message.type === "user").length,
                messages: iteration.messages,
            })
        })


        draft.promptIterations.forEach((iteration) => {
            iteration.messages.forEach((message) => {
                const messageCopy = { ...message, promptType: iteration.type }
                messages.push(messageCopy)
            })
        })

        const serializedDraft = {
            draftNumber: draft.draftNumber,
            maxScore: iterations.reduce((acc, iteration) => Math.max(acc, iteration.score), 0),
            iterations: iterations
        }

        lastDate = new Date(Math.max(lastDate.getTime(), ...messages.map(message => Date.parse(message.timestamp as any as string))))

        output.chats.push(serializedDraft)

    })

    const formattedDate = dateFormat.format(lastDate)
    output.lastDate = formattedDate

    return output
}