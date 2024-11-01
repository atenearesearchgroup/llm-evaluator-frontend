import type { Chat } from "@/model/chat"
import type { IntentInstance } from "@/model/model"
import type { CloneInstanceRequest, RequestError, UpdateInstanceRequest } from "@/model/request"
import { fetchWrapper, getApiUrl } from "@/utils/request"

const API_URL = getApiUrl()

export const getInstances = async (title: string|null): Promise<IntentInstance[] | RequestError> => {
    const url = title ? `${API_URL}/instance?title=${title}` : `${API_URL}/instance`
    const instances = await fetchWrapper<IntentInstance[]>(url)

    return instances
}

export const getInstance = async (instanceId: number): Promise<IntentInstance | RequestError> => {
    const instance = await fetchWrapper<IntentInstance>(`${API_URL}/instance/${instanceId}`)

    return instance
}

export const cloneInstance = async (instanceId: number, request: CloneInstanceRequest): Promise<IntentInstance | RequestError> => {
    const instance = await fetchWrapper<IntentInstance>(`${API_URL}/instance/${instanceId}/clone`, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return instance
}

export const updateInstance = async (instanceId: number, update: UpdateInstanceRequest): Promise<IntentInstance | RequestError> => {
    const instance = await fetchWrapper<IntentInstance>(`${API_URL}/instance/${instanceId}`, {
        method: 'PUT',
        body: JSON.stringify(update),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return instance
}

export const deleteInstance = async (instanceId: number): Promise<Response | RequestError> => {
    const instance = await fetchWrapper<Response>(`${API_URL}/instance/${instanceId}`, {
        method: 'DELETE'
    }, 'response')

    return instance
}

export const createChat = async (instanceId: Number): Promise<Chat | RequestError> => {
    const newModel = await fetchWrapper<Chat>(`${API_URL}/instance/${instanceId}/chats`, {
        method: 'POST'
    })

    return newModel
}

export const getInstanceDrafts = async (instanceId: number): Promise<Chat[] | RequestError> => {
    const drafts = await fetchWrapper<Chat[]>(`${API_URL}/instance/${instanceId}/chats`)

    return drafts
}