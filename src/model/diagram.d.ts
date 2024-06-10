import type { Message } from "./chat";


export type Arrow = {
    to: string;
    label: string;
    nextDecision?: boolean;
}

export type Phase = {
    id: string;
    title: string;
    description?: string;
}

export interface Decision extends Phase {
    arrows: Arrow[];
};

export interface Action extends Phase {
    fewShot?: string;
    prePrompt?: string;
    prompts: string[];
    postPrompt?: string;

    evaluate: boolean;
    to?: string;
};

