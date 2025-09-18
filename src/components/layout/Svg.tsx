import React, { useEffect, useState } from "react";
type IProp = {
    Url: string;
    ClassName?: string
}
const Svg: React.FC<IProp> = (prop) => {
    const [svg, setSvg] = useState("");
    useEffect(() => {
        fetch(prop.Url)
            .then(res => res.text())
            .then(text => setSvg(text));
    })

    return (
        <span className={prop.ClassName} dangerouslySetInnerHTML={{ __html: svg }} />
    )
}
export default Svg;