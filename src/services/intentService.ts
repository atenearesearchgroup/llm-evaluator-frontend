import type { IntentInstance, IntentModel } from "@/model/model"
import type { CreateInstanceRequest, CreateModelRequest, RequestError } from "@/model/request"

const API_URL = import.meta.env.BACKEND_API_URL

export const createModel = async (request: CreateModelRequest): Promise<IntentModel | RequestError> => {
    const newModel = await fetch(`${API_URL}/intent`, {
        method: 'POST',
        body: JSON.stringify(request),
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as IntentModel
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

export const getModels = async (): Promise<IntentModel[] | RequestError> => {
    const models = await fetch(`${API_URL}/intent`)
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as IntentModel[]
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

    return models
}

export const getInstancesFromModel = async (model: string): Promise<IntentInstance[] | RequestError> => {
    const instances = await fetch(`${API_URL}/intent/${model}/instance`)

        .then(async (response) => {
            if (response.ok) {
                return await response.json() as IntentInstance[]
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

    return instances
}

export const createInstance = async (model: string, settings: CreateInstanceRequest): Promise<IntentInstance | RequestError> => {
    const instance = await fetch(`${API_URL}/intent/${model}/instance`, {
        method: 'POST',
        body: JSON.stringify(settings),
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as IntentInstance
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

    return instance
}