import { toast, ToastOptions } from 'react-toastify';
import './style.scss';

type FeedbackType = 'error' | 'success' | 'warning';

const toastConfigs = (type: FeedbackType, overrides?: ToastOptions): ToastOptions => {

    const map = {
        error: {
            position: "top-left",
            autoClose: 30000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'feedback feedback--error',
            type: 'error',
            ...overrides
        },
        success: {
            position: "top-left",
            autoClose: 30000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'feedback feedback--success',
            type: 'success',
            ...overrides
        },
        warning: {
            position: "top-left",
            autoClose: 30000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'feedback feedback--warning',
            type: 'warning',
            ...overrides
        }
    } as Record<string, ToastOptions>;

    return map[type];
}

export type InvokeFeedbackProps = {
    msg: string, type: FeedbackType, override?: ToastOptions
}
export function invokeFeedback ({msg, type, override}:InvokeFeedbackProps){
    toast(msg, toastConfigs(type, override));
};