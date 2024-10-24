export type ModelError = {
    name: string;
    error: string;
    values: string[];
}

export type CategoryError = {
    type: string;
    errors: ModelError[];
}

export type EvaluationResultResponse = {
    score: number;
    maxScore: number;
    diagram: string|undefined;
    errors: CategoryError[];
    syntaxErrors: string[]|undefined;
}