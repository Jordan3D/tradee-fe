import { invokeFeedback } from "../utils/feedbacks/feedbacks";

const baseURL = process.env.REACT_APP_API_URL;

export async function processFetch<T>({onRequest, onData, onError, tries = 3}: Readonly<{onRequest: () => Promise<T>, onData: (data: T)=>void, onError: (r: Response) => Promise<void>, tries?: number}>): Promise<boolean> {
  let failed = false;
  while(tries > 0){
    try {
      const data = await onRequest();
      if (data) {
        onData(data);
        break;
      } else {
        invokeFeedback({ msg: 'Server gave no data', type: 'warning' });
      }
    } catch (e) {
      const response = e as Response;
      invokeFeedback({ msg: response.statusText, type: 'error' });
      await onError(response);

    } finally {
      tries-=1;
      if(tries === 0){
        failed = true
      }
    }
  }
  return !failed;
}

function fetchy<T>(url: string, argConfigs?: RequestInit): Promise<T> {
    const configs = {
        ...argConfigs,
        headers: {
          'Content-Type': 'application/json',
          ...argConfigs?.headers,
        },
      };
    
      return fetch(`${baseURL}${url}`, configs)
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json().then((data) => data as T);
        })
        .catch((error: Error) => {
          throw error; /* <-- rethrow the error so consumer can still catch it */
        });
}

export default fetchy;