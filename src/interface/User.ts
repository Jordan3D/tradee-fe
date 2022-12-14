
export type LoginForm = {
    identityString: string;
    password: string;
}

export type SignupForm = {
    email: string;
    password: string;
    username: string;
}


export type TUserConfig = { 
    utc: number
  }

export interface IUser {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    config: TUserConfig
}