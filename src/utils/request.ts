import type { RequestError, ResponseError} from "@/model/request";


export const getApiUrl = (): string => {
    let result : string|undefined = import.meta.env.BACKEND_API_URL;

    if(result == null) {
        if(import.meta.env.PROD) {
            result = process?.env.BACKEND_API_URL ?? import.meta.env.PUBLIC_BACKEND_API_URL ?? process?.env.PUBLIC_BACKEND_API_URL;   
        } else {
            result = import.meta.env.PUBLIC_BACKEND_API_URL
        }
    }

    if(result === undefined) {
        throw new Error(`API URL is not defined, check the environment variables`);
    }

    return result
}

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
        return createRequestError({
            message: responseError.message,
            status: responseError.status,
            statusText: responseError.error,
            url: responseError.path
        });
    } catch (error) {
        return createRequestError({
            message: (error as any).message,
            status: 500,
            statusText: "Internal Server Error",
            url
        });
    }
};


export const RequestErrorKey = Symbol('requestError')

export const createRequestError = (props: Omit<RequestError, typeof RequestErrorKey>): RequestError => {
    return {
        [RequestErrorKey]: true,
        ...props
    }
}

export const isRequestError = (error: any): error is RequestError => {
    return error[RequestErrorKey] === true
}