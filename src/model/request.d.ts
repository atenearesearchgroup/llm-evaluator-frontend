import type { Message, MessageType } from "./chat";
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

export type CloneInstanceRequest = {
    modelSettings: ModelSettings;
    evaluationSettings: EvaluationSettings;
}

type ModelName = IntentModel['modelName']

export type CreateModelRequest = {
    model: ModelName,
    displayName: string
}


export type CreateMessageRequest = {
    promptType: string;
    content: string;
    manual?: boolean;
    score?: number;
    manual?: boolean;
}

export type ScoreResponseRequest = {
    score: number
}

export interface ResponseError {
    error: string;
    message: string;
    path: string;
    status: number;
    timestamp: Date;
}

export interface RequestError {
    requestError: boolean;
    message: string;
    status: number;
    statusText: string;
    url: string;
}