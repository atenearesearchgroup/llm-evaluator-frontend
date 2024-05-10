import type { RequestError } from "@/model/request"

const API_URL = import.meta.env.BACKEND_API_URL || 'http://localhost:8080'

export const getPlatforms = async (): Promise<string[] | RequestError> => {
    // console.log(API_URL, " API")
    const platforms = await fetch(`${API_URL}/platform`)
    .then(async (response) => {
        if (response.ok) {
            return await response.json() as string[]
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

    return platforms
}