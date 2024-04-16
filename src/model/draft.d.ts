export type DraftGroup = {
    id: number;
    title: string;
    llm: string;
    currentPhase: string;
    currentDecision: string | null;
    lastDate: Date;
}

export type DraftMessage = {
    id: string;
    prompt: string;
    response: string;
    score: number;
    date: Date;
}
