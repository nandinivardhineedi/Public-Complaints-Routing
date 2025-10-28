import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, value, icon, trend, trendDirection, children }) => {
  const trendColor = trendDirection === 'up' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trendColor}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
          {icon}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};