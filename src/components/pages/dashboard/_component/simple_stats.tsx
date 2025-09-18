import { useState } from "react";
import { Icons } from "../../../Assets"
import { DotLoader } from "../../../layout/Loader/_dot_loader"

type IProp = {
    loading: boolean;
    onClick?:(name:string, index:number)=>void;
    data: {
        pendingRequests: number,
        fulfilledRequests: number,
        rejectedRequests: number
    }
}

export const SimpleStats = (prop: IProp) => {
    const [data, setData] = useState(prop.data);
    const stats = [
        { title: "Regions", icon: <Icons.InfoCircle className="w-8" />, handler: "regionCount",  },
        { title: "Districts", icon: <Icons.InfoCircle className="w-8" />, handler: "districtCount" },
        { title: "Towns", icon: <Icons.InfoCircle className="w-8" />, handler: "townCount" },
    ]

    return <>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-3 mt-8">
            {stats.map(({ title, icon, handler}, i) =>
                <div key={i} className="bg-white rounded p-6 shadow-sm animation fade-in">
                    <div className="flex mb-4">
                        <div className="w-full">{title}</div>
                        <div className="mr-2 text-gray-400">{icon}</div>
                    </div>
                    {prop.loading && <DotLoader className="text-gray-400" />}
                    {!prop.loading && prop.data && <h3 className="text-3xl font-bold">{(prop?.data as any)[handler] ?? 0}</h3>}
                </div>
            )}
        </div>
    </>
}