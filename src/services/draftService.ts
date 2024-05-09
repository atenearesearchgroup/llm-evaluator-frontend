import type { AIMessage, Draft, UserMessage } from "@/model/draft"
import type { CreateMessageRequest, RequestError, UpdateDraftRequest } from "@/model/request"

const API_URL = import.meta.env.BACKEND_API_URL



export const getDraft = async (draftId: Number): Promise<Draft | RequestError> => {
    const newModel = await fetch(`${API_URL}/draft/${draftId}`, {
        method: 'POST',
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as Draft
            }

            return {
                message: response.statusText,
                status: response.status,
                statusText: response.statusText,
                url: response.url
            } as RequestError
        })
        .catch((error) => {
            console.log(error)

            return {
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

            return {
                message: response.statusText,
                status: response.status,
                statusText: response.statusText,
                url: response.url
            } as RequestError
        })
        .catch((error) => {
            console.log(error)

            return {
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

            return {
                message: response.statusText,
                status: response.status,
                statusText: response.statusText,
                url: response.url
            } as RequestError
        })
        .catch((error) => {
            console.log(error)

            return {
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

            return {
                message: response.statusText,
                status: response.status,
                statusText: response.statusText,
                url: response.url
            } as RequestError
        })
        .catch((error) => {
            console.log(error)

            return {
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

            return {
                message: response.statusText,
                status: response.status,
                statusText: response.statusText,
                url: response.url
            } as RequestError
        })
        .catch((error) => {
            console.log(error)

            return {
                message: error.message,
                status: 0,
                statusText: 'Unknown error',
                url: ''
            } as RequestError
        })

    return newModel
}
