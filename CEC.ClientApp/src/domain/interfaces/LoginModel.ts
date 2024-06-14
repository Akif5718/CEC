export interface ILoginResponse{
    userId: number,
    userName: string,
    token:  string,
    isSuccess: boolean,
    message: string,
    errorMessages: string
}

export interface ILoginRequest{
    userName: string,
    password: string
}