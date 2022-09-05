import { invokeFeedback } from "../utils/feedbacks/feedbacks";

export const baseURL = process.env.REACT_APP_API_URL;

export async function processFetch<T>(
  { onRequest, onData, onError, tries = 2, delay = 500, afterAllTries, feedbacks = false }:
    Readonly<{
      onRequest: () => Promise<T>,
      onData: (data: T) => void,
      onError: (r: Response) => Promise<void>,
      tries?: number,
      delay?: number,
      afterAllTries: () => void,
      feedbacks?: boolean
    }>): Promise<void> {

  function wait() {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  try {
    while (tries >= 0) {
      try {
        const data = await onRequest();
        if (data) {
          onData(data);
          return Promise.resolve();
        } else {
          if(feedbacks)
          invokeFeedback({ msg: 'Server gave no data', type: 'warning' });
        }
      } catch (e) {
        tries -= 1;
        const response = e as Response;

        if(feedbacks)
        invokeFeedback({ msg: response.statusText, type: 'error' });

        await onError(response);
      } finally {
        await wait();
        if (tries === 0) {
          afterAllTries();
        }
      }
    }
  } catch (error) {
    const response = error as Response;

    if(feedbacks)
    invokeFeedback({ msg: response.statusText, type: 'error' });

    afterAllTries();
  }

  return Promise.reject();
}

function fetchy<T>(url: string, argConfigs?: RequestInit): Promise<T> {
  const configs = {
    ...argConfigs,
    headers: {
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