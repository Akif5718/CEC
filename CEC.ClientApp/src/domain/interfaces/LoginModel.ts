export interface ILoginResponse{
    userId: number,
    userName: string,
    token:  string
}

export interface ILoginRequest{
    userName: string,
    password: string
}