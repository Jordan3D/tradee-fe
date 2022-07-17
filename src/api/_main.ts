const baseURL = process.env.REACT_APP_API_URL;


export type FetchyResult = {
    data?: Record<string, any>,
    error?: Error
}

const fetchy = (url: string, argConfigs?: RequestInit): Promise<FetchyResult> => {
    const configs = {
        headers: {
            "Content-Type": "application/json"
        },
        ...argConfigs
    };

    return fetch(`${baseURL}${url}`, configs).then( async (response) => {
        if(!response.ok){
            throw new Error(response.statusText)
        } else if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        }
        return {data: await response.json()};
    }).catch((error: Error) => {
        return {
            error
        }
    });
}

export default fetchy;