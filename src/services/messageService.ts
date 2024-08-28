import type { AIMessage } from "@/model/chat"
import type { EvaluationResultResponse } from "@/model/evaluation"
import type { RequestError, ResponseError, ScoreResponseRequest } from "@/model/request"
import { fetchWrapper } from "@/utils/request"

const API_URL = import.meta.env.BACKEND_API_URL || 'http://localhost:8080'


export const setMessageScore = async (messageId: number,request: ScoreResponseRequest): Promise<AIMessage | RequestError> => {
    const message = await fetchWrapper<AIMessage>(`${API_URL}/message/${messageId}/score`,
        {
            body: JSON.stringify(request),
            method: "POST"
        }
    )

    return message
}

export const evaluateMessage = async (messageId: number): Promise<EvaluationResultResponse | RequestError> => {
    const evaluation = await fetchWrapper<EvaluationResultResponse>(`${API_URL}/message/${messageId}/evaluate`)
    return evaluation
}