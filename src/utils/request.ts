import type { RequestError, ResponseError } from "@/model/request";

export const fetchWrapper = async <T>(
    url: string,
    requestInit?: RequestInit,
    responseType: "json" | "blob" | "text" | "response" = "json",
): Promise<T | RequestError> => {
    try {
        const response = await fetch(url, requestInit);
        if (response.ok) {
            if (responseType === "blob") {
                return await response.blob() as T;
            }
            if (responseType === "text") {
                return await response.text() as T;
            }
            if (responseType === "response") {
                return response as unknown as T;
            }
            return await response.json() as T;
        }

        const responseError = await response.json() as ResponseError;
        return {
            requestError: true,
            message: responseError.message,
            status: responseError.status,
            statusText: responseError.error,
            url: responseError.path
        } as RequestError;
    } catch (error) {
        console.log(error);
        return {
            requestError: true,
            message: (error as any).message,
            status: 500,
            statusText: "Internal Server Error",
            url
        } as RequestError;
    }
};