import React, { Children, FormEvent, useState } from "react";
import { uuid } from "../../../core/utility";
import { serializeFormToJson } from './../../../core/formSerializer'
type IProp = {
    className?: string;
    currentStage?: number;
    stageVisibleCls: string;
    stageHiddenCls: string;
    onInit?: (e: any) => void;
    beforeNext?: (stage: number, data: any) => boolean;
    beforeSubmit?: (stage: number, data: any) => boolean;
    onSubmit?: (stage: number, data: any) => void;
    children?: React.ReactNode
};

export type IFormWizardInit = {
    formId: string;
    current: () => number;
    getFormData: () => any;
    goToStep: (n: number) => void;
    next: () => void;
    prev: () => void;
}
export const FormWizard: React.FC<IProp> = (prop) => {
    const [currentStage, setCurrentStage] = useState<number>(prop.currentStage ?? 0);
    const [formData, setFormData] = useState<{}>({});
    const children = Children.toArray(prop.children);

    const formId = "f_" + uuid();
    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        let data = serializeFormToJson((e.target as HTMLFormElement));
        setFormData(data);

        if (((e.nativeEvent as any).submitter as HTMLButtonElement).classList.contains('form-wizard-next')) {
            if (prop?.beforeNext && !prop?.beforeNext(currentStage, data)) return false;
            return onNext();
        }
        if (((e.nativeEvent as any).submitter as HTMLButtonElement).classList.contains('form-wizard-prev')) {
            console.log('prev');
            return onPrev();
        }

        if (currentStage == children.length - 1) {
            if (prop?.beforeNext && !prop?.beforeNext(currentStage, data)) return false;
            if (prop?.beforeSubmit && prop?.beforeSubmit(currentStage, data)) return false;
            if (prop?.onSubmit) return prop?.onSubmit(currentStage, data);
        }

    }

    const onNext = () => {
        if (currentStage >= children.length - 1) return;
        setCurrentStage(currentStage + 1);
    }

    const onPrev = () => {
        if (currentStage <= 0) return;
        setCurrentStage(currentStage - 1);
    }
    const goToStep = (n: number) => {
        setCurrentStage(n);
    }

    const onFormChange = (e: FormEvent) => {
        const data = serializeFormToJson((e.target as any).form);
        setFormData({ ...data }); /* */
    }

    if (prop.onInit) {
        prop.onInit({
            formId,
            goToStep,
            next: onNext,
            prev: onPrev,
            current: () => currentStage,
            getFormData: function () {
                const data = serializeFormToJson((document.getElementById(formId) as HTMLFormElement));
                setFormData({ ...data });
                return { ...formData };
            }
        } as IFormWizardInit);
    }

    return <>
        <form className={prop.className} id={formId} onSubmit={onSubmit} onChange={onFormChange}>
            {children?.map((child, idx) => <div className={idx == currentStage ? prop.stageVisibleCls : prop.stageHiddenCls} key={idx}>{child}</div>)}
        </form>
    </>
}

export const WizardStage: React.FC<{ children?: React.ReactNode }> = (prop?: { children?: React.ReactNode }) => {
    return <>{prop?.children}</>;
}