export type IntentModel = {
    modelName: string;
    displayName: string;
}

export interface IntentInstance extends EvaluationSettings {
    id: number;
    platform: string;
    displayName: string;
    intentModel?: IntentModel;
    chats: Draft[];
    modelSettings: ModelSettings;
} 

export type ModelSettings = {
    modelName?: string;
    modelOwner?: string;
    version?: string;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}

export type EvaluationSettings = {
    maxErrors: number;
    maxChats: number;
    maxRepeatingPrompt: number;
}