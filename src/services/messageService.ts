import type { AIMessage } from "@/model/draft"
import type { RequestError, ResponseError, ScoreResponseRequest } from "@/model/request"

const API_URL = import.meta.env.BACKEND_API_URL || 'http://localhost:8080'


export const setResponseScore = async (messageId: number,request: ScoreResponseRequest): Promise<AIMessage | RequestError> => {
    const platforms = await fetch(`${API_URL}/message/${messageId}`,
        {
            body: JSON.stringify(request),
            method: "POST"
        }
    )
    .then(async (response) => {
        if (response.ok) {
            return await response.json() as AIMessage
        }

        const responseError = await response.json() as ResponseError

        return {
            requestError: true,
            message: responseError.message,
            status: responseError.status,
            statusText: responseError.error,
            url: responseError.path
        } as RequestError
    })
    .catch((error) => {
        console.log(error)

        return {
            requestError: true,
            message: error.message,
            status: 0,
            statusText: 'Unknown error',
            url: ''
        } as RequestError
    })

    return platforms
}