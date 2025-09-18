import { useState } from "react";
import Flatpickr from "react-flatpickr";

export type ICustomDatePicker = {
	startDate?: Date;
	endDate?: Date;
	onChange: (dates: { start: Date, end: Date }) => void;
}

export const CustomDatePicker = (prop: ICustomDatePicker) => {
	const [dateRange, onDateRangeChange] = useState<Date[]>([prop?.startDate!, prop?.endDate!]);

	return <div className='w-min h-auto transition flex items-center justify-between overflow-hidden'>
		<div className='flex items-center gap-3'>
			<h1>From</h1>
			<Flatpickr
				//data-enable-time
				id="endDate"
				className="w-32 text-center"
				options={{ defaultDate: dateRange[0] }}
				onChange={([date]) => {
					if (prop.onChange) prop.onChange({ start: date, end: dateRange[1] });
					onDateRangeChange([dateRange[0], date])
				}}
			/>
		</div>
		<div className='flex items-center ml-2 gap-3'>
			<h1>To</h1>
			<Flatpickr
				//data-enable-time 
				id="endDate"
				className="w-32 text-center"
				options={{ defaultDate: dateRange[1] }}
				onChange={([date]) => {
					if (prop.onChange) prop.onChange({ start: dateRange[0], end: date });
					onDateRangeChange([date, dateRange[1]])
				}}
			/>
		</div>

	</div>
}
