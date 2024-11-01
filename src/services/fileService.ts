import type { RequestError } from "@/model/request"
import { fetchWrapper, getApiUrl } from "@/utils/request"

const API_URL = getApiUrl()

export const uploadFile = async (file: File, name: string): Promise<string | RequestError> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetchWrapper<string>(`${API_URL}/file/upload/${name}`, {
        method: 'POST',
        body: formData
    }, 'text')


    return response
}

export const downloadFile = async (name: string, fileName: string): Promise<Blob | RequestError> => {
    const response = await fetchWrapper<Blob>(`${API_URL}/file/download/${name}`, {
        method: 'GET',
        body: JSON.stringify({ fileName }),
    }, 'blob')

    return response
}
