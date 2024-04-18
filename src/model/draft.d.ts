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
