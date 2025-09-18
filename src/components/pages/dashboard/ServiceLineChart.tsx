import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ServiceLineChartProps {
    data: { month: string, count: number }[];
}

const ServiceLineChart = ({ data }: ServiceLineChartProps) => {
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = allMonths.map(month => {
        const found = data.find(item => item.month === month);
        return { month, count: found ? found.count : 0 };
    });

    return (
        <div className="flex justify-center items-center p-4">
            <div className="w-full max-w-3xl bg-slate-50 bg-opacity-70 shadow-lg rounded-lg p-4">
                <ResponsiveContainer width="100%" height={100} className="w-full">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="month" tick={{ fill: '#555' }} />
                        <YAxis tick={{ fill: '#555' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', borderColor: '#ccc' }} />
                        <Line type="monotone" dataKey="count" stroke="#4A90E2" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ServiceLineChart;