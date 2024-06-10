import type { Chat, Message } from "@/model/chat";
import type { IntentInstance } from "@/model/model";

const dateFormat = new Intl.DateTimeFormat("es", {
    dateStyle: "short",
    timeStyle: "short"
});

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
        if(!draft.finalized) return
        
        const messages : (Message & { promptType: string })[] = [] 

        draft.promptIterations.forEach((iteration) => {
            iteration.messages.forEach((message) => {
                const messageCopy = { ...message, promptType: iteration.type }
                messages.push(messageCopy)
            })
        })

        const serializedDraft = {
            draftNumber: draft.draftNumber,
            messages: messages
        }

        lastDate = new Date(Math.max(lastDate.getTime(), ...serializedDraft.messages.map(message => Date.parse(message.timestamp as any as string))))

        output.chats.push(serializedDraft)

    })

    const formattedDate = dateFormat.format(lastDate)
    output.lastDate = formattedDate

    return output
}