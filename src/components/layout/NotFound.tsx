import { ReactNode } from "react";
import { Images } from "../Assets";

type IProp = {
    children?: ReactNode;
}
export const NotFound = ({ ...prop }: IProp) => {

    return <>
        <div className="  text-center  h-max">
            <img className="mx-auto mt-5" src={Images.NothingFound} />
            <div className="pt-5">{prop?.children}</div>
        </div>
    </>
}