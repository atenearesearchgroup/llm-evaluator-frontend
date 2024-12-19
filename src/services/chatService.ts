import type { AllMessage, Chat } from "@/model/chat"
import type { CreateMessageRequest, RequestError, UpdateChatRequest } from "@/model/request"
import { fetchWrapper, getApiUrl } from "@/utils/request"

const API_URL = getApiUrl()



export const getChat = async (draftId: Number): Promise<Chat | RequestError> => {
    const newModel = await fetchWrapper<Chat>(`${API_URL}/chat/${draftId}`)

    return newModel
}

export const updateDraft = async (draftId: Number, update: UpdateChatRequest): Promise<Chat | RequestError> => {
    const newModel = await fetchWrapper<Chat>(`${API_URL}/chat/${draftId}`,
        {
            body: JSON.stringify(update),
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT"
        }
    )

    return newModel
}

export const deleteDraft = async (draftId: Number) : Promise<{ result: boolean } | RequestError> => {
    const newModel = await fetchWrapper<Response>(`${API_URL}/chat/${draftId}`, {
        method: 'DELETE'
    }, "response")

    if ('ok' in newModel) {
        return { result: true }
    }

    return newModel
}

export const finalizeDraft = async (draftId: Number, finalize?: boolean): Promise<{ result: boolean } | RequestError> => {
    const newModel = await fetchWrapper<Response>(`${API_URL}/chat/${draftId}/finish`, {
        method: 'POST',
        body: JSON.stringify(finalize),
        headers: {
            'Content-Type': 'application/json'
        }
    }, "response")

    if ('ok' in newModel) {
        return { result: true }
    }

    return newModel
}

export const sendMessage = async (draftId: Number, message: CreateMessageRequest): Promise<AllMessage | RequestError> => {
    const newModel = await fetchWrapper<AllMessage>(`${API_URL}/chat/${draftId}/message`,
        {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
    return newModel
}

export const generateMessage = async (draftId: Number): Promise<string | RequestError> => {
    const newModel = await fetchWrapper<string>(`${API_URL}/chat/${draftId}/message/generate`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        },
       "text" 
    )

    return newModel
}
