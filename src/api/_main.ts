const baseURL = process.env.REACT_APP_API_URL;


export type FetchyResult = {
    status: 'error' | 'success',
    data?: Record<string, any>,
    error?: unknown
}

const fetchy = async (url: string, configs: RequestInit): Promise<FetchyResult> => {
    try {
        const response = await fetch(`${baseURL}${url}`, configs);

        return {
            status: 'success',
            data: response.json()
        }
    } catch (e) {
        return {
            status: 'error',
            error: e,
        };
    }
}

export default fetchy;