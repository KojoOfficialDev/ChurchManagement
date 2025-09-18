import { useEffect, useState } from "react";

type IProp = {
    id?: string;
    length?: number;
    disabled?: boolean;
    onChange?: (otp: string) => void;
};
export const Otp = ({ ...prop }: IProp) => {
    const [disabled, setDisabled] = useState<boolean>(false);
    const [otp, setOtp] = useState<string[]>([]);

    const otpLength = prop.length ?? 6;

    const focusInOut = (e: any) => {
        let inp = e.target as HTMLInputElement;
        if ((inp.attributes.getNamedItem("type"))?.value == "text") {
            inp.setAttribute("type", "password");
        } else {
            inp.setAttribute("type", "text");
        }
    }

    useEffect(() => {
        setDisabled(prop?.disabled ?? false);
        if (prop?.disabled) setOtp([])

        return () => { }
    }, [prop?.disabled])


    const onOtpInputKeyUp = (e: any) => {
        if (e.code == "Backspace" || e.keyCode == 37) {
            e.target.value = "";
            let prev = (e.target as HTMLDivElement)?.parentElement?.previousElementSibling?.querySelector('input');
            if (prev) prev.focus()
        } else if (e.target.value.trim() == '' || !/^\d+$/.test(e.target.value.trim())) {
            e.preventDefault();
            e.target.value = "";
        }
        else {
            let next = (e.target as HTMLDivElement)?.parentElement?.nextElementSibling?.querySelector('input')
            if (next) next.focus();

            if (next == null) (document.querySelector("#input-05") as HTMLInputElement).blur();
        }
    }

    const onPasteFromClipboard = (e: any) => {
        let data = e.clipboardData.getData('Text') as string;

        if (data?.length == 0) return false;
        data = data.replace(/ /g, '');
        const regex = new RegExp("^\\d{" + otpLength + "," + otpLength + "}$");

        if (!regex.test(data)) return false;

        document.querySelectorAll(".otp-input input")?.forEach((e, i) => {
            (e as HTMLInputElement).value = data.charAt(i)
        })
    }

    const onOtpInputChange = (e: any) => {
        const { dataset, value } = e.target;
        if (value.trim() != '' && value.trim() != null && !/^\d+$/.test(value.trim())) return false;

        let currOtp = [...otp];
        currOtp[dataset.index] = value;
        setOtp(currOtp);
        if (prop?.onChange) prop?.onChange(currOtp.join(''));
    }

    return <>
        <div id={prop?.id} className={"otp-input flex flex-auto "}>
            {Array.from(Array(otpLength).keys()).map(x => (
                <div className="p-2" key={x}>
                    <input type="password"
                        id={"input-0" + x} autoFocus={x == 0} value={otp[x]} data-index={x}
                        {...(disabled?.toString() == 'true' && { disabled: true })}
                        onFocus={focusInOut} onBlur={focusInOut} onPaste={onPasteFromClipboard} onKeyUp={onOtpInputKeyUp} onChange={onOtpInputChange} maxLength={1} minLength={1}
                        className="form-control disabled:bg-gray-100 block w-full text-center px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                </div>
            ))}
        </div>
    </>;
};