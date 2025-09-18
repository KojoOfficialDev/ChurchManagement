import { ReactNode } from "react";


export type ITimerHandler = {
    start: (minute: number) => void;
    pulse: () => void;
    clear: () => void;
};

type IProp = {
    onInit?: (prop: ITimerHandler) => void
    callback?: () => void;
    children?: ReactNode;
    visible: boolean;
    id: string;
}
export const Timer = ({ ...prop }: IProp) => {
    let sessionTimer: number = 0;

    const startCounter = (sessionTimeout: number) => {
        const el = document.querySelector("." + prop.id);
        if (el) el.classList.remove('hidden')
        clearInterval(sessionTimer);
        console.log(sessionTimeout)
        sessionTimer = startTimer(60 * sessionTimeout, () => {
            if (prop?.callback) prop?.callback();
            clearInterval(sessionTimer);
        });
    }


    if (prop.onInit) {
        prop.onInit({
            start: (minutes: number) => { startCounter(minutes) },
            pulse: () => { clearInterval(sessionTimer); },
            clear: () => { throw new Error("Not implemented") },
        } as ITimerHandler);
    }

    const startTimer = (duration: number, callback: () => void) => {
        let timer: number = duration;
        let minutes: any;
        let seconds: any;
        return setInterval(function () {
            minutes = parseInt((timer / 60).toString(), 10);
            seconds = parseInt((timer % 60).toString(), 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            const min = document.querySelector("#" + prop.id + " .min");
            if (min) min.innerHTML = minutes;

            const sec = document.querySelector("#" + prop.id + " .sec");
            if (sec) sec.innerHTML = seconds;

            if (--timer < 0) {
                timer = duration;
                if (callback) callback();
                const el = document.querySelector("." + prop.id);
                if (el) el.classList.add('hidden');
                clearInterval(sessionTimer);
            }
        }, 1000);
    }
    return <>{prop.visible ? <span id={prop.id}>{prop?.children}</span> : null}</>
}