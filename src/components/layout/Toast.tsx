import classNames from "classnames";
import { useState } from "react";
import { uuid } from "../../core/utility";
import { Alert } from "./Alert";

export type IToastProp = {
    position?: IToastPosition,
    onInit: (e: IToastHandler) => void;
};
export type IToastHandler = {
    Info: (title: string, content: any, timeout?: number) => void;
    Success: (title: string, content: any, timeout?: number) => void;
    Error: (title: string, content: any, timeout?: number) => void;
    Warning: (title: string, content: any, timeout?: number) => void;
};

type IToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type IToastType = 'error' | 'success' | 'warning' | 'info';
type IToastInfo = {
    id: string;
    title: string;
    type?: IToastType;
    content: any;
    timeout?: number;
    timer?: number;
    className?: string;
};
export const Toast = (prop: IToastProp) => {
    const [toasts, setToasts] = useState<IToastInfo[]>([]);


    if (prop.onInit) {
        prop.onInit({
            Info: (title: string, content: any, timeout: 5000) => { createAlert('info', title, content, timeout) },
            Success: (title: string, content: any, timeout: 5000) => { createAlert('success', title, content, timeout) },
            Error: (title: string, content: any, timeout: 5000) => { createAlert('error', title, content, timeout) },
            Warning: (title: string, content: any, timeout: 5000) => { createAlert('warning', title, content, timeout) },
        } as IToastHandler);
    }

    const createAlert = (type: IToastType, title: string, content: any, timeout: number) => {
        if (timeout == null) timeout = 5000;
        const id = "toaster_" + uuid();;
        const className = getClass(type);

        const toastInfo: IToastInfo = { type, title, content, id, timeout, className };

        if (timeout > 0) {
            toastInfo.timer = setTimeout(() => {
                document.getElementById(id)?.remove();
            }, timeout);
        }
        setToasts([...toasts, toastInfo]);

    }

    const getClass = (type: IToastType) => {
        if (type == 'success') return 'bg-green-100 border border-green-200 text-green-500'
        if (type == 'warning') return 'bg-yellow-100 border border-yellow-200 text-sm text-gray-100'
        if (type == 'error') return 'bg-red-100 border border-red-200 text-sm text-red-500'
        return 'bg-white border border-white-200 text-white-500';
    }

    return <>
        <div className={classNames(
            { 'top-0 left-0': prop.position == 'top-left' },
            { 'top-0 right-0': prop.position == 'top-right' },
            { 'bottom-0 left-0': prop.position == 'bottom-left' },
            { 'bottom-0 left-1/2 -translate-x-1/2': prop.position == 'bottom-center' },
            { 'bottom-0 right-0': prop.position == 'bottom-right' },
            "absolute z-40 "
        )}>
            {toasts.length > 0 ? toasts.map((obj, i) => (
                <div key={i} id={obj.id} className={classNames('max-w-xs min-w-xs animate-in fade-in  m-2 rounded-md shadow-lg', obj.className)} role="alert">
                    <Alert title={obj?.title} closable={obj?.timeout != 0} type={(obj?.type as any)}>{obj?.content}</Alert>
                </div>
            )) : null}

        </div>
    </>

};
