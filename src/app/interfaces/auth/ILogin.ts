export interface ILogin
{
    userName:string;
    password:string;
}
export interface ILoginResponse {
    id: number;
    verificationCodeExpiration: string;
    token: string;
}
