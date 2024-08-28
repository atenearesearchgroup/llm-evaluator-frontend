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
    diagram: string|undefined;
    errors: CategoryError[]
}