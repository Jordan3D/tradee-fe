import { IFile, IIdea } from "../interface/Idea";
import { CreateTag, UpdateTag } from "../interface/Tag";
import fetchy from "./_main";

export type IdeaListGetApiResult = IIdea[];
export const ideaListGetApi = async (
    { lastId, limit, text }: Readonly<{ lastId?: string, limit?: number, text?: string }>
): Promise<IdeaListGetApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<IdeaListGetApiResult>(
        `/idea/list?lastId=${lastId ?? ''}&limit=${limit ?? ''}&text=${text ?? ''}`,
        { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } }
    )
};

export type IdeaCreateApiResult = IIdea;
export const ideaCreateApi = async (data: CreateTag): Promise<IdeaCreateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<IdeaCreateApiResult>('/idea/create', {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export type IdeaUpdateApiResult = IIdea;
export const ideaUpdateApi = async (id: string, data: UpdateTag): Promise<IdeaUpdateApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<IdeaUpdateApiResult>('/idea/' + id, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export type IdeaDeleteApiResult = boolean;
export const ideaDeleteApi = async (id: string): Promise<IdeaDeleteApiResult> => {
    const token = localStorage.getItem('access_token');
    return await fetchy<IdeaDeleteApiResult>('/idea/' + id, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, method: 'DELETE' });
};

export type IdeaUloadPhotoApiResult = IFile;
export const ideaUploadPhotoApi = async (data: FormData): Promise<IdeaUloadPhotoApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<IdeaUloadPhotoApiResult>('/idea/upload-photo', {
        headers: {"Authorization": `Bearer ${token}` },
        method: 'POST',
        body: data
    });
};

export type IdeaDeletePhotoApiResult = boolean;
export const ideaDeletePhotoApi = async (id: string): Promise<IdeaDeletePhotoApiResult> => {
    const token = localStorage.getItem('access_token');
    return fetchy<IdeaDeletePhotoApiResult>('/idea/photo/'+id, {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        method: 'DELETE'
    });
};