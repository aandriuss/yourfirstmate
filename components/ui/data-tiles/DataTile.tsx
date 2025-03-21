import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface DataTileProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
}

export const DataTile: React.FC<DataTileProps> = ({
  label,
  value,
  unit,
  icon,
  className,
  trend,
  trendLabel,
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    const commonClasses = "h-3 w-3";
    switch (trend) {
      case 'up':
        return <ArrowUp className={cn(commonClasses, "text-green-500")} />;
      case 'down':
        return <ArrowDown className={cn(commonClasses, "text-red-500")} />;
      case 'stable':
        return <Minus className={cn(commonClasses, "text-gray-400")} />;
    }
  };

  return (
    <div className={cn(
      "p-3 rounded-lg border border-gray-100 bg-white hover:shadow-sm transition-shadow",
      className
    )}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-500">{label}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-medium">{value}</span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      {(trend || trendLabel) && (
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          {getTrendIcon()}
          {trendLabel && <span>{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}; 