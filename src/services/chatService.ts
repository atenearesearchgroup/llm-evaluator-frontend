import type { AIMessage, Chat, UserMessage } from "@/model/chat"
import type { CreateMessageRequest, RequestError, ResponseError, UpdateDraftRequest } from "@/model/request"

const API_URL = import.meta.env.BACKEND_API_URL || import.meta.env.PUBLIC_BACKEND_API_URL



export const getChat = async (draftId: Number): Promise<Chat | RequestError> => {
    const newModel = await fetch(`${API_URL}/chat/${draftId}`, {
        method: 'GET',
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as Chat
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
                status: 500,
                statusText: 'Unknown error',
                url: ''
            } as RequestError
        })

    return newModel
}

export const updateDraft = async (draftId: Number, update: UpdateDraftRequest) : Promise<Chat | RequestError> => {
    const newModel = await fetch(`${API_URL}/chat/${draftId}`, {
        method: 'PUT',
        body: JSON.stringify(update),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as Chat
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
                status: 500,
                statusText: 'Unknown error',
                url: ''
            } as RequestError
        })

    return newModel
}

export const finalizeDraft = async (draftId: Number, finalize?: boolean): Promise<{result: boolean} | RequestError> => {
    const newModel = await fetch(`${API_URL}/chat/${draftId}/finish`, {
        method: 'POST',
        body: JSON.stringify(finalize),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async (response) => {
            if (response.ok) {
                return { result: true}
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
                status: 500,
                statusText: 'Unknown error',
                url: ''
            } as RequestError
        })

    return newModel
}

export const sendMessage = async (draftId: Number, message: CreateMessageRequest): Promise<UserMessage | AIMessage | RequestError> => {
    const newModel = await fetch(`${API_URL}/chat/${draftId}/message`, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            'Content-Type': 'application/json'
        }
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
                status: 500,
                statusText: 'Unknown error',
                url: ''
            } as RequestError
        })

    return newModel
}

export const generateMessage = async (draftId: Number): Promise<AIMessage | RequestError> => {
    const newModel = await fetch(`${API_URL}/chat/${draftId}/message/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
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
                status: 500,
                statusText: 'Unknown error',
                url: ''
            } as RequestError
        })

    return newModel
}
