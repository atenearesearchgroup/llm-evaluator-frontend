import type { RequestError } from "@/model/request"
import { fetchWrapper } from "@/utils/request"

const API_URL = import.meta.env.BACKEND_API_URL || import.meta.env.PUBLIC_BACKEND_API_URL

export const uploadFile = async (file: File, name: string): Promise<string | RequestError> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetchWrapper<string>(`${API_URL}/file/upload/${name}`, {
        method: 'POST',
        body: formData
    }, 'text')

    // const response = await fetch(`${API_URL}/file/upload/${name}`, {
    //     method: 'POST',
    //     body: formData
    // })
    //     .then(async (response) => {
    //         if (response.ok) {
    //             return await response.text()
    //         }

    //         const responseError = await response.json() as ResponseError

    //         return {
    //             requestError: true,
    //             message: responseError.message,
    //             status: responseError.status,
    //             statusText: responseError.error,
    //             url: responseError.path
    //         } as RequestError
    //     })
    //     .catch((error) => {
    //         // console.log(error)

    //         return {
    //             requestError: true,
    //             message: error.message,
    //             status: 0,
    //             statusText: 'Unknown error',
    //             url: ''
    //         } as RequestError
    //     })

    return response
}

export const downloadFile = async (name: string, fileName: string): Promise<Blob | RequestError> => {
    const response = await fetchWrapper<Blob>(`${API_URL}/file/download/${name}`, {
        method: 'GET',
        body: JSON.stringify({ fileName }),
    }, 'blob')
    // const response = await fetch(`${API_URL}/file/download/${name}`, {
    //     method: 'GET',
    //     body: JSON.stringify({ fileName }),
    // })
    //     .then(async (response) => {
    //         if (response.ok) {
    //             return await response.blob()
    //         }

    //         const responseError = await response.json() as ResponseError

    //         return {
    //             requestError: true,
    //             message: responseError.message,
    //             status: responseError.status,
    //             statusText: responseError.error,
    //             url: responseError.path
    //         } as RequestError
    //     })
    //     .catch((error) => {
    //         // console.log(error)

    //         return {
    //             requestError: true,
    //             message: error.message,
    //             status: 0,
    //             statusText: 'Unknown error',
    //             url: ''
    //         } as RequestError
    //     })

    return response
}
