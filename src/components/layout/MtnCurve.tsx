type IProp = {
    className?: string;
}
export const MtnCurve = ({ ...prop }: IProp) => {
    prop.className ??= 'fill-gray-300';
    return <>
        {/* Mobile */}

        <svg version="1.1"
            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="25px" viewBox="0 0 500 25" preserveAspectRatio="none"
            className="mtn-curve__concave mtn-curve_mobile w-full sm:collapse">
            <g className={prop.className}>
                <path d="M0,25h250C166.7,25,83.3,16.7,0,0V25z"></path>
                <path d="M250,25h250V0C416.7,16.7,333.3,25,250,25z"></path>
            </g>
        </svg>

        {/* Desktop */}
        <svg version="1.1"
            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="25px" viewBox="0 0 1366 25" preserveAspectRatio="none"
            className=" w-full hidden sm:hidden md:block">
            <path d="M683.1,23.9C386.6,23.9,129.2,14.1,0,0v25h1366V0C1236.7,14.1,979.4,23.9,683.1,23.9z" className={prop.className}></path>
        </svg>

    </>
}