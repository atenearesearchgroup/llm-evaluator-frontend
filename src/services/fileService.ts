import type { IntentInstance, IntentModel } from "@/model/model"
import type { CreateInstanceRequest, CreateModelRequest, RequestError, ResponseError } from "@/model/request"

const API_URL = import.meta.env.BACKEND_API_URL || 'http://localhost:8080'

export const uploadFile = async (file: File, name: string): Promise<string | RequestError> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_URL}/file/upload/${name}`, {
        method: 'POST',
        body: formData
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.text()
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
            // console.log(error)

            return {
                requestError: true,
                message: error.message,
                status: 0,
                statusText: 'Unknown error',
                url: ''
            } as RequestError
        })

    return response
}

export const downloadFile = async (name: string, fileName: string): Promise<Blob | RequestError> => {
    const response = await fetch(`${API_URL}/file/download/${name}`, {
        method: 'GET',
        body: JSON.stringify({ fileName }),
    })
        .then(async (response) => {
            if (response.ok) {
                return await response.blob()
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
            // console.log(error)

            return {
                requestError: true,
                message: error.message,
                status: 0,
                statusText: 'Unknown error',
                url: ''
            } as RequestError
        })

    return response
}
