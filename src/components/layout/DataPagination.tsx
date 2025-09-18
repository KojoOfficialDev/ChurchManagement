import classNames from "classnames";
import { useEffect, useState } from "react";

type IDataChangeEvent = { currentPage?: number; limit: number; offset: number }
export type IDataHandler = {
    setCurrentPage: (pageNo: number) => void;
    resetOffset: () => void;
    isLoading: (state: boolean) => void;
}
type IProp = {
    total: number;
    limit?: number;
    loading?: boolean;
    showPerFetch?: boolean;
    selectedRowCount?: number;
    maxPageLength?: number;
    rows?: any[];
    onDataChange: (evt: IDataChangeEvent) => void;
    onPageLimitChange?: (limit: Number) => void;
    isLoading?: (state: boolean) => void;
    onInit?: (handler: IDataHandler) => void;
};

export const DataPagination = ({ ...prop }: IProp) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<any[]>([]);

    const [eventData, setEventData] = useState<IDataChangeEvent>({ currentPage: 1, offset: 0, limit: prop?.limit! });
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [pages, setPages] = useState<number>(0);
    const [showMax] = useState<number>(prop?.maxPageLength ?? 10);

    useEffect(() => {
        setTotal(prop.total);
        setLimit(prop.limit ?? 5);
        setRows(prop?.rows ?? []);

        const calcPages = Math.ceil((total / limit))
        setPages(calcPages);
        return () => { }
    }, [prop]);


    useEffect(() => {
        if (eventData) {
            prop.onDataChange(eventData);

            const calcPages = Math.ceil((total / eventData?.limit!));
            setPages(calcPages);

        }
        return () => { }
    }, [eventData]);

    useEffect(() => {
        if (prop?.isLoading) prop?.isLoading(isLoading);
        return () => { }
    }, [isLoading]);

    if (prop?.onInit) {
        prop.onInit({
            setCurrentPage: (pageNo) => setEventData({ ...eventData, currentPage: pageNo }),
            resetOffset: () => setEventData({ ...eventData, offset: 0, currentPage: 1 }),
            isLoading: (state) => setIsLoading(state)
        })
    }

    const ShowPaginationNumbers = (pageNumbers: number) => {

        let paginationNumbers = [];

        if (pageNumbers) {
            let endPage;
            let startPage;

            if (pageNumbers <= showMax) {
                startPage = 1;
                endPage = pageNumbers;
            }
            else {
                startPage = eventData?.currentPage;
                if (startPage != pageNumbers && (startPage! + 1) != pageNumbers) {
                    endPage = eventData?.currentPage! + showMax - 1;
                }
                else {
                    endPage = pageNumbers;
                }
            }
            for (let i: any = startPage; i <= endPage; i++) {
                paginationNumbers.push(i);
            }
            return ShowRenderPageNumbers(paginationNumbers);
        }
    }

    const ShowRenderPageNumbers = (paginationNumbers: any[]) => {
        const className = 'page-link text-sm py-1 px-2 relative block border-0  mx-1 outline-none cursor-pointer transition-all duration-300 rounded  hover:text-white hover:bg-blue-600 shadow-md focus:shadow-md'

        if (paginationNumbers) {
            const result = paginationNumbers.map((page, i) => {
                return (
                    <li className={classNames(
                        className,
                        { 'active   bg-blue-600  text-white hover:text-white hover:bg-blue-600 shadow-md focus:shadow-md': eventData.currentPage === page },
                        { 'active   bg-gray-200 text-black': eventData.currentPage != page }
                    )}
                        key={page}
                        onClick={e => {
                            if (eventData.currentPage != page) setEventData({ ...eventData, offset: (page * limit) - limit, currentPage: page })
                        }} >
                        {page}
                    </li>
                );
            });
            return <>
                {showMax < result.length || ((eventData?.currentPage! - 1) * limit) > 0 ? (
                    <li className={className}
                        onClick={e => {
                            if (((eventData?.currentPage! - 1) * limit) > 0) setEventData({ ...eventData, offset: ((eventData?.currentPage! - 1) * limit) - limit, currentPage: eventData?.currentPage! - 1 })
                        }} >
                        Prev
                    </li>
                ) : null}
                {result}
                {(eventData?.offset! + eventData?.limit!) * 2 < total ? (
                    <li className={className}
                        onClick={e => {
                            let offset = (eventData?.currentPage! * limit);
                            if (offset <= 0) offset = limit
                            setEventData({ ...eventData, offset, currentPage: eventData?.currentPage! + 1 })
                        }} >
                        Next
                    </li>
                ) : null}


            </>;
        }
    }


    return <>
        <div className="flex flex-row mt-3 justify-between">
            <div className="mr-3 whitespace-nowrap">Total: {total} record{total > 1 ? "s" : ""}</div>
            {prop?.showPerFetch && <div className="w-max whitespace-nowrap">
                <span className="mr-1">Per Fetch:</span>
                <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setEventData({ ...eventData, limit: Number(e.target.value), offset: 0, currentPage: 1 }) }} className="p-1">
                    <option value={20}>20 record</option>
                    <option value={50}>50 record</option>
                    <option value={100}>100 record</option>
                    <option value={1000}>1000 record</option>
                </select>
            </div>}

            <div className="">
                <div className="flex justify-left px-2">
                    <nav aria-label="Page navigation example">
                        <ul className="flex list-style-none">{ShowPaginationNumbers(pages)}</ul>
                    </nav>
                </div>
            </div>
        </div>
    </>
}




// import React, { useState, useEffect } from 'react';

// export interface IDataHandler {
//   isLoading: (state: boolean) => void;
// }

// interface Props {
//   onInit: (handler: IDataHandler) => void;
//   maxPageLength?: number;
//   rows: any[];
//   limit: number;
//   showPerFetch?: boolean;
//   loading: boolean;
//   isLoading: (state: boolean) => void;
//   onDataChange: (data: { limit: number; offset: number }) => void;
//   total: number;
// }

// export const DataPagination: React.FC<Props> = ({
//   onInit,
//   maxPageLength = 10,
//   rows,
//   limit,
//   showPerFetch = true,
//   loading,
//   isLoading,
//   onDataChange,
//   total,
// }) => {
//   const [page, setPage] = useState(0);

//   useEffect(() => {
//     onInit({ isLoading });
//   }, []);

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//     onDataChange({ limit, offset: newPage * limit });
//   };

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <div className="pagination-container flex justify-between items-center">
//       <div className="pagination-info">
//         Page {page + 1} of {totalPages}
//       </div>
//       <div className="pagination-controls flex items-center gap-2">
//         <button
//           className={`pagination-button ${page === 0 ? 'disabled' : ''}`}
//           onClick={() => handlePageChange(0)}
//           disabled={page === 0}
//         >
//           First
//         </button>
//         <button
//           className={`pagination-button ${page === 0 ? 'disabled' : ''}`}
//           onClick={() => handlePageChange(page - 1)}
//           disabled={page === 0}
//         >
//           Previous
//         </button>
//         <button
//           className={`pagination-button ${page === totalPages - 1 ? 'disabled' : ''}`}
//           onClick={() => handlePageChange(page + 1)}
//           disabled={page === totalPages - 1}
//         >
//           Next
//         </button>
//         <button
//           className={`pagination-button ${page === totalPages - 1 ? 'disabled' : ''}`}
//           onClick={() => handlePageChange(totalPages - 1)}
//           disabled={page === totalPages - 1}
//         >
//           Last
//         </button>
//       </div>
//       {showPerFetch && (
//         <div className="pagination-limit">
//           <label htmlFor="limit">Rows per page: </label>
//           <select
//             id="limit"
//             value={limit}
//             onChange={(e) => {
//               const newLimit = parseInt(e.target.value, 10);
//               onDataChange({ limit: newLimit, offset: 0 });
//               setPage(0);
//             }}
//           >
//             {[10, 20, 50, 100].map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// };
