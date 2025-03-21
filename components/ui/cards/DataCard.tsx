import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DataCardProps {
  title: string;
  value: string;
  unit?: string;
  subtitle?: string;
  status?: string;
  icon?: React.ReactNode;
  chart?: 'line' | 'wave' | 'direction';
  progress?: number;
}

export function DataCard({
  title,
  value,
  unit,
  subtitle,
  status,
  icon,
  chart,
  progress
}: DataCardProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-semibold">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      
      {status && (
        <div className="mt-1">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
            {status}
          </span>
        </div>
      )}

      {subtitle && (
        <div className="mt-1 text-sm text-muted-foreground">
          {subtitle}
        </div>
      )}

      {icon && (
        <div className="mt-2">
          {icon}
        </div>
      )}

      {chart === 'line' && (
        <div className="mt-2 h-8">
          <div className="h-full w-full bg-blue-50">
            {/* Add line chart visualization */}
          </div>
        </div>
      )}

      {chart === 'wave' && (
        <div className="mt-2 h-8">
          <div className="h-full w-full bg-blue-50">
            {/* Add wave chart visualization */}
          </div>
        </div>
      )}

      {chart === 'direction' && (
        <div className="mt-2 h-8">
          <div className="h-full w-full bg-blue-50">
            {/* Add direction arrow visualization */}
          </div>
        </div>
      )}

      {progress !== undefined && (
        <div className="mt-2 h-2 w-full rounded-full bg-blue-100">
          <div 
            className="h-full rounded-full bg-blue-500" 
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </div>
  );
} 