const baseURL = process.env.REACT_APP_API_URL;


export type FetchyResult = {
    status: 'error' | 'success',
    data?: Record<string, any>,
    error?: Error
}

const fetchy = async (url: string, argConfigs: RequestInit): Promise<FetchyResult> => {
    const configs = {
        headers: {
            "Content-Type": "application/json"
        },
        ...argConfigs
    };

    const data = await fetch(`${baseURL}${url}`, configs).then((response) => {
        if(!response.ok){
            throw new Error(response.statusText)
        } else if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        }
        return response.json();
    }).catch((error: Error) => {
        return {
            status: 'error',
            error
        }
    });

    return {
        status: 'success',
        data
    }
}

export default fetchy;