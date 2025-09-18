import classNames from "classnames"

type IProp = {className?:string}
export const DotLoader = (prop:IProp) => {

    return <>
        <span className="dots-cont">
            {[1,2,3].map((x, i)=><span key={i} className={classNames("dot dot-"+x, prop?.className)}></span>)} 
        </span>
    </>
}