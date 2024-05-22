import type { IntentInstance } from "./model";

export type DraftGroup = {
    id: number;
    title: string;
    llm: string;
    currentPhase: string;
    currentDecision: string | null;
    lastDate: Date;
}

export type DraftMessage = {
    response: string;
    id: number;
    date: Date;
    phaseId: string;
    draftId: number;
    prompt: string;
    score: number | null;
}

export type Draft = {
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
    draft?: Draft;
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
