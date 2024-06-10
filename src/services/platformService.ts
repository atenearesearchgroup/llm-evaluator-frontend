import type { RequestError, ResponseError } from "@/model/request"

const API_URL = import.meta.env.BACKEND_API_URL || 'http://localhost:8080'

export const getPlatforms = async (): Promise<string[] | RequestError> => {
    const platforms = await fetch(`${API_URL}/platform`)
    .then(async (response) => {
        if (response.ok) {
            return await response.json() as string[]
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

    return platforms
}