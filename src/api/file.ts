import { IFile } from "../interface/Idea";
import fetchy from "./_main";

type TFileListGetProps  = Readonly<{ lastId?: string, limit?: number, text?: string }>

export type FileListGetApiResult = IFile[];
export const fileListGetApi = async (args: TFileListGetProps): Promise<FileListGetApiResult> => {
    const token = localStorage.getItem('access_token');
    const argsKeys = Object.keys(args) as ReadonlyArray<keyof TFileListGetProps>;
    return fetchy<FileListGetApiResult>(
        `/file/list${argsKeys.length ? '?' + argsKeys.map((key: keyof TFileListGetProps) => `${key}=${args[key]}`).join('&'): ''}`,
        { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
    )
};

export type FileCreateApiResult = IFile;
export const fileCreateApi = async (data: FormData): Promise<FileCreateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<FileCreateApiResult>('/file/add', {
        headers: { "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: data
    });
};

export type FileDeleteApiResult = boolean;
export const fileDeleteApi = async (id: string): Promise<FileDeleteApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<FileDeleteApiResult>('/file/' + id, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, method: 'DELETE' });
};