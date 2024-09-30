import type { RequestError, ResponseError } from "@/model/request"
import { fetchWrapper } from "@/utils/request"

const API_URL = import.meta.env.BACKEND_API_URL || import.meta.env.PUBLIC_BACKEND_API_URL

export const getPlatforms = async (): Promise<string[] | RequestError> => {
    const platforms = await fetchWrapper<string[]>(`${API_URL}/platform`)

    return platforms
}