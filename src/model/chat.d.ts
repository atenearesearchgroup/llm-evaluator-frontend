import type { IntentInstance } from "./model";

export type Chat = {
    id: number;
    intentInstance?: IntentInstance;
    draftNumber: number;
    actualNode: string;
    finalized: boolean;
    promptIterations: PromptIteration[];
}

export type PromptIteration = {
    id: number;
    type: string;
    iteration: number;
    chat?: Chat;
    messages: (AIMessage | UserMessage)[];
}

export type MessageType = 'user' | 'ai'

interface Message {
    id: number;
    type: MessageType;
    timestamp: Date;
    content: string;
    promptIteration?: PromptIteration;
}

export type UserMessage = {

} & Message

export type AIMessage = {
    score: number
} & Message
