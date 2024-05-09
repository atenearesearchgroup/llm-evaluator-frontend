import type { IntentModel } from "./model"

export type UpdateInstanceRequest = {
    displayName?: string;
    evaluationSettings?: EvaluationSettings;
}

export type UpdateDraftRequest = {
    actualNode?: string;
}

export type CreateInstanceRequest = {
    platform: string;
    displayName: string;
    modelSettings: ModelSettings;
    evaluationSettings: EvaluationSettings;
}

export type CreateModelRequest = {
    model: Pick<IntentModel, 'modelName'>
}

export type CreateMessageRequest = {
    promptType: string;
    content: string;
    score?: number;
}

export interface RequestError {
    message: string;
    status: number;
    statusText: string;
    url: string;
}