import type { AIMessage } from "@/model/chat"
import type { EvaluationResultResponse } from "@/model/evaluation"
import type { RequestError, ScoreResponseRequest } from "@/model/request"
import { fetchWrapper, getApiUrl } from "@/utils/request"

const API_URL = getApiUrl()


export const setMessageScore = async (messageId: number,request: ScoreResponseRequest): Promise<AIMessage | RequestError> => {
    const message = await fetchWrapper<AIMessage>(`${API_URL}/message/${messageId}/score`,
        {
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        }
    )

    return message
}

export const evaluateMessage = async (messageId: number): Promise<EvaluationResultResponse | RequestError> => {
    const evaluation = await fetchWrapper<EvaluationResultResponse>(`${API_URL}/message/${messageId}/evaluate`)
    return evaluation
}