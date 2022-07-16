
export type LoginForm = {
    identityString: string;
    password: string;
}

export type SignupForm = {
    email: string;
    password: string;
    username: string;
}

export type TUser = {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}