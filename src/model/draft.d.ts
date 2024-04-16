export type DraftGroup = {
    id: string;
    title: string;
    currentPhase: string;
    history?: Message[];
    lastDate: Date;
}

export type DraftMessage = {
    id: string;
    prompt: string;
    response: string;
    score: number;
    date: Date;
}