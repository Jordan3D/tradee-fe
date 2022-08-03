import { LoginForm, SignupForm, IUser } from "../interface/User";
import fetchy from "./_main";

export type LoginPostApiResult = Readonly<{
    user: IUser,
    access_token: string,
    refresh_token: string,
    expiresIn: number,
}>;
export const loginPost = async (lf:LoginForm): Promise<LoginPostApiResult> => 
fetchy<LoginPostApiResult>('/auth/signin', {body: JSON.stringify(lf), method: 'POST'});

export type RefreshTokenApiResult = Readonly<{
    access_token: string,
    refresh_token: string,
}>;
export const refreshTokenApi = async (): Promise<RefreshTokenApiResult> => {
    const refresh_token = localStorage.getItem('refresh_token');
    return fetchy<RefreshTokenApiResult>('/auth/refresh', {body: JSON.stringify({refresh_token}), method: 'POST'});
}

export type SignupPostApiResult = Readonly<{
    user: IUser
}>;
export const signupPost = async (sf:SignupForm): Promise<SignupPostApiResult> => 
fetchy<SignupPostApiResult>('/user/create', {body: JSON.stringify(sf), method: 'POST'});


export type SelfGetApiResult = IUser;
export const selfGetApi = async ():Promise<SelfGetApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<SelfGetApiResult>('/user/self', { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }});
};