import type { IntentInstance, IntentModel } from "@/model/model"
import type { CreateInstanceRequest, CreateModelRequest, RequestError, ResponseError } from "@/model/request"
import { createRequestError, fetchWrapper, getApiUrl } from "@/utils/request"

const API_URL = getApiUrl()

export const createModel = async (request: CreateModelRequest): Promise<IntentModel | RequestError> => {
    const url = `${API_URL}/intent`
    const newModel = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as IntentModel
            }

            const responseError = await response.json() as ResponseError

            return createRequestError({
                message: responseError.message,
                status: responseError.status,
                statusText: responseError.error,
                url: responseError.path
            })
        })
        .catch((error) => {
            return createRequestError({
                message: (error as any).message,
                status: 500,
                statusText: 'Internal Server Error',
                url
            })
        })

    return newModel
}

export const getModels = async (): Promise<IntentModel[] | RequestError> => {
    const models = await fetchWrapper<IntentModel[]>(`${API_URL}/intent`)

    return models
}

export const getInstancesFromModel = async (model: string): Promise<IntentInstance[] | RequestError> => {
    const url = `${API_URL}/intent/${model}/instance`
    const instances = await fetch(url)
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as IntentInstance[]
            }

            const responseError = await response.json() as ResponseError

            return createRequestError({
                message: responseError.message,
                status: responseError.status,
                statusText: responseError.error,
                url: responseError.path
            })
        })
        .catch((error) => {
            console.error(error)

            return createRequestError({
                message: (error as any).message,
                status: 500,
                statusText: 'Internal Server Error',
                url
            })
        })

    return instances
}

export const createInstance = async (model: string, settings: CreateInstanceRequest): Promise<IntentInstance | RequestError> => {
    const url = `${API_URL}/intent/${model}/instance`
    const instance = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(settings),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.json() as IntentInstance
            }

            const responseError = await response.json() as ResponseError

            return createRequestError({
                message: responseError.message,
                status: responseError.status,
                statusText: responseError.error,
                url: responseError.path
            })
        })
        .catch((error) => {
            console.log(error)

            return createRequestError({
                message: (error as any).message,
                status: 500,
                statusText: 'Internal Server Error',
                url
            })
        })

    return instance
}