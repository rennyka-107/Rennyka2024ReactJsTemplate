export const _API_ = {
    AUTH: {
        LOGIN: "auth/login",
        GET_USER_INFORMATION: "auth/get-user-information"
    }
}

export interface IResponse<T = any> {
    data: T;
    message: string;
    status: 200 | 400 | 401 | 403 | 413 | 404 | 500 | 502
}