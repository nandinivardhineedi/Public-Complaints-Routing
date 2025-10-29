import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  data: { name: string; count: number }[];
}

export const BarChartComponent: React.FC<BarChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
        <BarChart
            data={data}
            margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} angle={-20} textAnchor="end" height={60} interval={0} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip
                cursor={{fill: 'rgba(79, 70, 229, 0.1)'}}
                contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#1f2937'
                }}
            />
            <Legend wrapperStyle={{fontSize: '14px', color: '#4b5563'}} />
            <Bar dataKey="count" fill="#4f46e5" name="Complaints" barSize={30} />
        </BarChart>
        </ResponsiveContainer>
    </div>
  );
};