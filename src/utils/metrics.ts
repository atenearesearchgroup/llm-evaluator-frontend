import type { Chat, Message, PromptIteration } from "@/model/chat";
import type { IntentInstance } from "@/model/model";

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

export const exportJson = (instance: IntentInstance) => {
    const output = {
        id: instance.id,
        displayName: instance.displayName,
        platform: instance.platform,
        modelSettings: instance.modelSettings,
        evaluationSettings: {
            maxErrors: instance.maxErrors,
            maxSessions: instance.maxChats,
            maxRepeatingPrompt: instance.maxRepeatingPrompt
        },
        chats: [] as any[],
        lastDate: ""
    }

    let lastDate = new Date(0)

    instance.chats.forEach((draft: Chat, idx) => {
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
            maxScore: iterations.reduce((acc, iteration) => acc + iteration.score, 0),
            iterations: iterations
        }

        lastDate = new Date(Math.max(lastDate.getTime(), ...messages.map(message => Date.parse(message.timestamp as any as string))))

        output.chats.push(serializedDraft)

    })

    const formattedDate = dateFormat.format(lastDate)
    output.lastDate = formattedDate

    return output
}