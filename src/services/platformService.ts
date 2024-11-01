import type { RequestError } from "@/model/request"
import { fetchWrapper, getApiUrl } from "@/utils/request"

const API_URL = getApiUrl()

export const getPlatforms = async (): Promise<string[] | RequestError> => {
    const platforms = await fetchWrapper<string[]>(`${API_URL}/platform`)

    return platforms
}