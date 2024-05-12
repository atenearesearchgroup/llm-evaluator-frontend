import type { AIMessage, Draft, UserMessage } from "@/model/draft"
import type { CreateMessageRequest, RequestError, ResponseError, UpdateDraftRequest } from "@/model/request"

const API_URL = import.meta.env.BACKEND_API_URL || 'http://localhost:8080'



export const getDraft = async (draftId: Number): Promise<Draft | RequestError> => {
    const newModel = await fetch(`${API_URL}/draft/${draftId}`, {
        method: 'POST',
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as Draft
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

    return newModel
}

export const updateDraft = async (draftId: Number, update: UpdateDraftRequest) : Promise<Draft | RequestError> => {
    const newModel = await fetch(`${API_URL}/draft/${draftId}`, {
        method: 'PUT',
        body: JSON.stringify(update),
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as Draft
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

    return newModel
}

export const finalizeDraft = async (draftId: Number, finalize?: boolean): Promise<boolean | RequestError> => {
    const newModel = await fetch(`${API_URL}/draft/${draftId}/finish`, {
        method: 'POST',
        body: JSON.stringify({ finalize }),
    })
        .then(async (response) => {
            if (response.ok) {
                return true
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

    return newModel
}

export const sendMessage = async (draftId: Number, message: CreateMessageRequest): Promise<UserMessage | AIMessage | RequestError> => {
    const newModel = await fetch(`${API_URL}/draft/${draftId}/message`, {
        method: 'POST',
        body: JSON.stringify(message),
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as UserMessage | AIMessage
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

    return newModel
}

export const generateMessage = async (draftId: Number): Promise<AIMessage | RequestError> => {
    const newModel = await fetch(`${API_URL}/draft/${draftId}/message/generate`, {
        method: 'POST',
    })
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

    return newModel
}
