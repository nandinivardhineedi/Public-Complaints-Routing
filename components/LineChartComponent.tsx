import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: { name: string; [key: string]: number | string }[];
}

export const LineChartComponent: React.FC<LineChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
        <LineChart
            data={data}
            margin={{
            top: 5,
            right: 20,
            left: -20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip 
                 cursor={{stroke: '#d1d5db', strokeWidth: 1}}
                contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#1f2937'
                }} 
            />
            <Legend wrapperStyle={{fontSize: '14px', color: '#4b5563'}}/>
            <Line type="monotone" dataKey="Negative" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Neutral" stroke="#f97316" strokeWidth={2} />
            <Line type="monotone" dataKey="Positive" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
        </ResponsiveContainer>
    </div>
  );
};