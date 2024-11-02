import type { AIMessage, AllMessage, Chat, PromptIteration } from "@/model/chat"
import type { IntentInstance } from "@/model/model"

export const getLastMessage = (instance: IntentInstance): [Chat | null, PromptIteration | null, AllMessage | null] => {
    let lastChat = null

    if (instance.chats.length > 0) {
        lastChat = instance.chats[instance.chats.length - 1]
    }
    let lastIteration = null

    if (lastChat) {
        lastIteration = lastChat.promptIterations[lastChat.promptIterations.length - 1]
    }

    let lastMessage = null

    if (lastIteration) {
        lastMessage = lastIteration.messages[lastIteration.messages.length - 1]
    }

    return [lastChat, lastIteration, lastMessage]
}

export const getLastAiMessage = (messages: (AllMessage)[]): AIMessage | null => {
    let lastMessage = messages[messages.length - 1]

    if (`score` in lastMessage)
        return lastMessage

    if (messages.length < 2)
        return null

    return messages[messages.length - 2] as AIMessage
}
