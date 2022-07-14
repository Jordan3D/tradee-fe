import { LoginForm, SignupForm, TUser } from "../interface/User";
import fetchy, { FetchyResult } from "./_main";

export type LoginResult = FetchyResult & Readonly<{data?: {
    user: TUser,
    access_token: string,
    refresh_token: string,
    expiresIn: number,
}}>;

export type SignupResult = FetchyResult & Readonly<{data?: {
    user: TUser
}}>;

export const loginPOST = async (lf:LoginForm): Promise<LoginResult> => {
    const result = await fetchy('/auth/signin', {body: JSON.stringify(lf), method: 'POST'})
    return result as LoginResult;
};


export const signupPOST = async (sf:SignupForm): Promise<SignupResult> => {
    const result = await fetchy('/auth/signup', {body: JSON.stringify(sf), method: 'POST'})
    return result as SignupResult;
};
