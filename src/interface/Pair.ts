export interface IPair {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
}

export interface ICreatePair {
    title: string;
}