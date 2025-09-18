import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts';
import { Icons } from '../../Assets';
import { DotLoader } from '../../layout/Loader/_dot_loader';
import moment from 'moment';



type ITimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type IInitChart = {
    setLoadingState: (state: boolean) => void;
    updateSeries: (data: any) => void;
    updateOptions: (data: any) => void;
    loadDefault: () => void;
}
interface IChartCard {
    onInit?: (id: string, methods: IInitChart) => void,
    onTimeFrameChange?: (id: string, timeFrame: ITimeFrame, timeFrameDate?: { start: Date, end: Date }) => void,
    id?: string,
    title?: string,
    options?: any,
    series?: any,
    isLoading?: boolean,
    chartType?: "area" | "line" | "bar" | "histogram" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "treemap" | "boxPlot" | "candlestick" | "radar" | "polarArea" | "rangeBar"
}

const ChartCard = ({ id, title, options, series, onTimeFrameChange, onInit, isLoading }: IChartCard) => {
    const now = moment();
    let yearsCountBack = 2020;
    const startDate = now.add(-7, 'days').toDate();
    const endDate = now.toDate();

    const [chartType, setChatType] = useState<IChartCard['chartType']>("bar");
    const [isDataLoading, setIsDataLoading] = useState(isLoading);
    const [chartNull, setChartNull] = useState(false);
    const [chartSeries, setChartSeries] = useState(series);
    const [chartOptions, setChartOptions] = useState(options);
    const [customDate, setCustomDate] = useState<{ start: Date, end: Date }>({ start: startDate, end: endDate });
    const [timeFrameType, setTimeFrameType] = useState<ITimeFrame>('daily');

    const years = Array.from({ length: (Number(now.format('yyyy')) + 1) - yearsCountBack }, (x: number, i) => yearsCountBack++).reverse();

    // add date picker for a particular time frame 
    const handleChartTypeChange = (_chatType: IChartCard['chartType']) => {
        setChartNull(true)
        setTimeout(() => {
            setChartNull(false)
            setChatType(_chatType)
        }, 300);
    }

    const onTimeFrameChanged = (type: ITimeFrame, timeFrame?: { start: Date, end: Date }) => {
        setTimeFrameType(type);
        if (onTimeFrameChange) onTimeFrameChange(id!, type, timeFrame)
    }

    if (onInit) onInit(id!, {
        setLoadingState: (state: boolean) => setIsDataLoading(state),
        loadDefault: ()=> onTimeFrameChanged('daily'),
        updateSeries: (data:any)=> setChartSeries(data),
        updateOptions: (data:any)=> setChartOptions(data)
    });

    


    return (
        <div className="w-full flex flex-col bg-white rounded-[20px] p-5 gap-5">
            <h4 className="font-semibold text-2xl">{title}</h4>

            <div className="w-full rounded-lg p-5">
                <div className='flex w-full gap-5 justify-between'>
                    <div className="w-fit1 flex flex-wrap gap-3 rounded-lg border p-2 mb-5" >
                        <div onClick={() => onTimeFrameChanged('daily')} className={`flex ${timeFrameType === 'daily' ? 'bg-gray-800' : ''} h-9 items-center gap-2 p-2 rounded-lg hover:bg-slate-200 hover:cursor-pointer`}>
                            <div className={`w-3 h-3 rounded-full ${timeFrameType === 'daily' ? 'bg-white' : 'bg-gray-600'}`}></div>
                            <h4 className={`${timeFrameType === 'daily' ? 'text-white' : 'text-gray-600'}`}>Daily</h4>
                        </div>

                        {/*  <div onClick={() => setTimeFrameType('weekly')} className={`flex ${timeFrameType === 'weekly' ? 'bg-gray-800' : ''} h-9 items-center gap-2 p-2 rounded-lg hover:bg-slate-200 hover:cursor-pointer`}>
                            <div className={`w-3 h-3 rounded-full ${timeFrameType === 'weekly' ? 'bg-white' : 'bg-gray-600'}`}></div>
                            <h4 className={`${timeFrameType === 'weekly' ? 'text-white' : 'text-gray-600'}`}>WTD</h4>
                        </div> */}

                        <div onClick={() => setTimeFrameType('monthly')} className={`flex ${timeFrameType === 'monthly' ? 'bg-gray-800' : ''} h-9 items-center gap-2 p-2 rounded-lg hover:bg-slate-200 hover:cursor-pointer`}>
                            <div className={`w-3 h-3 rounded-full ${timeFrameType === 'monthly' ? 'bg-white' : 'bg-gray-600'}`}></div>
                            <h4 className={`${timeFrameType === 'monthly' ? 'text-white' : 'text-gray-600'}`}>MTD</h4>
                        </div>

                        <div onClick={() => setTimeFrameType('yearly')} className={`flex ${timeFrameType === 'yearly' ? 'bg-gray-800' : ''} h-9 items-center gap-2 p-2 rounded-lg hover:bg-slate-200 hover:cursor-pointer`}>
                            <div className={`w-3 h-3 rounded-full ${timeFrameType === 'yearly' ? 'bg-white' : 'bg-gray-600'}`}></div>
                            <h4 className={`${timeFrameType === 'yearly' ? 'text-white' : 'text-gray-600'}`}>YTD</h4>
                        </div>

                        <div
                            title='Custom Time Frame'
                            onClick={() => setTimeFrameType('custom')}
                            className={`flex ${timeFrameType == 'custom' ? 'bg-gray-800' : ''} h-9 items-center gap-2 p-2 rounded-lg hover:bg-slate-200 hover:cursor-pointer`}>
                            <h4 className={`${timeFrameType == 'custom' ? 'text-white' : 'text-gray-600'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </h4>
                        </div>

                        <div className={`w-min  ${timeFrameType == 'monthly' ? 'h-auto' : 'h-0 hidden'} transition  flex items-center justify-between overflow-hidden`}>
                            <div className='flex items-center gap-3'>
                                <h1 className='whitespace-nowrap'>Year</h1>
                                <select onChange={e => {
                                    var startDate = moment(e.target.value + '01-01').toDate();
                                    setCustomDate({ ...customDate, start: startDate! })
                                }} className='px-3 py-[5px] border rounded-lg outline-none'>
                                    {years.map((year, key) => <option key={key} value={year}>{year}</option>)}
                                </select>
                            </div>
                            <div onClick={() => {
                                if (onTimeFrameChange) onTimeFrameChange(id ?? '', 'monthly', customDate);
                            }} className='flex bg-gray-200 ml-1 h-9 items-center gap-2 p-2 rounded-lg hover:bg-slate-300 hover:cursor-pointer'>
                                <h4 className='text-gray-800 text-sm px-2 whitespace-nowrap'>Get Report</h4>
                            </div>
                        </div>

                        <div className={`w-min ${timeFrameType == 'yearly' ? 'h-auto' : 'h-0 hidden'} transition  flex items-center justify-between overflow-hidden`}>
                            <div className='flex items-center gap-3'>
                                <h1 className='whitespace-nowrap'>Start Year</h1>
                                <select onChange={e => {
                                    var startDate = moment(e.target.value + '01-01').toDate();
                                    setCustomDate({ ...customDate, start: startDate! })
                                }} className='px-3 py-[5px] border rounded-lg outline-none'>
                                    {years.map((year, key) => <option key={key} value={year}>{year}</option>)}
                                </select>
                            </div>
                            <div className='flex items-center gap-3'>
                                <h1 className='whitespace-nowrap ml-2'>End Year</h1>
                                <select onChange={e => {
                                    var endDate = moment(e.target.value + '01-01').toDate();
                                    setCustomDate({ ...customDate, start: endDate! })
                                }} className='px-3 py-[5px] border rounded-lg outline-none'>
                                    {years.map((year, key) => <option key={key} value={year}>{year}</option>)}
                                </select>
                            </div>
                            <div onClick={() => {
                                if (onTimeFrameChange) onTimeFrameChange(id ?? '', 'yearly', customDate);
                            }} className='flex bg-gray-200 ml-1 h-9 items-center gap-2 p-2 rounded-lg hover:bg-slate-300 hover:cursor-pointer'>
                                <h4 className='text-gray-800 text-sm px-2 whitespace-nowrap'>Get Report</h4>
                            </div>
                        </div>

                        <div className={`w-min ${timeFrameType == 'custom' ? 'h-auto' : 'h-0'} transition  flex items-center justify-between overflow-hidden`}>
                            <div className='flex items-center gap-3'>
                                <h1>From</h1>
                                <input onChange={e => {
                                    var startDate = moment(e.target.value).toDate();
                                    setCustomDate({ ...customDate, start: startDate! })
                                }} className='px-3 py-1 border rounded-lg outline-none' type="date" />
                            </div>
                            <div className='flex items-center ml-2 gap-3'>
                                <h1>To</h1>
                                <input className='px-3 py-1  border rounded-lg outline-none' type="date" />
                            </div>
                            <div onClick={() => {
                                if (onTimeFrameChange) onTimeFrameChange(id ?? '', 'custom', customDate);
                            }} className='flex bg-gray-200 ml-1 h-9 items-center gap-2 p-2 rounded-lg hover:bg-slate-300 hover:cursor-pointer'>
                                <h4 className='text-gray-800 whitespace-nowrap px-2'>Get Report</h4>
                            </div>
                        </div>
                    </div>

                    <div className="w-fit1 flex gap-3 rounded-lg border p-2 mb-5" >

                        <div onClick={() => { }} title='Download Raw Data' className='flex px-2 bg-gray-200  text-gray-700 items-center gap-2 p-2 rounded-lg hover:bg-slate-300 hover:cursor-pointer'>
                            <Icons.Download className='w-6' /> Export
                        </div>
                    </div>


                </div>
                {isDataLoading ?
                    <div className='w-full h-full grid'>
                        <DotLoader className="text-gray-300" />
                    </div>
                    :
                    <Chart height={300}
                        options={chartOptions}
                        series={chartSeries}
                        type={chartType} 
                        width="100%"
                    />
                }
            </div>
        </div>
    )
}

export default ChartCard