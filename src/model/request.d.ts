import type { RequestErrorKey } from "@/utils/request";
import type { Message, MessageType } from "./chat";
import type { IntentModel } from "./model"

export type UpdateInstanceRequest = {
    displayName?: string;
    evaluationSettings?: EvaluationSettings;
}

export type UpdateChatRequest = {
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



// export const createRequestError = (error: ResponseError): RequestError => {
//     return {
//         [RequestErrorKey]: true,
//         message: error.message,
//         status: error.status,
//         statusText: error.error,
//         url: error.path
//     }
// }

export interface RequestError {
    [RequestErrorKey]: true;
    message: string;
    status: number;
    statusText: string;
    url: string;
}