import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'sky' | 'emerald' | 'amber' | 'red' | 'blue';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend,
  color = 'sky',
}) => {
  const colorMap = {
    sky: 'text-sky-600 bg-sky-50 border-sky-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    red: 'text-red-600 bg-red-50 border-red-100',
    blue: 'text-blue-700 bg-blue-50 border-blue-100',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{title}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {subtext && <span className="text-xs text-gray-500">{subtext}</span>}
          {trend && (
            <span
              className={`text-[11px] font-semibold font-mono ${
                trend.isPositive ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
