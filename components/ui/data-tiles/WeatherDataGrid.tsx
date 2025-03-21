import React from 'react';
import { Wind, Compass, Navigation, Sun, Waves, Clock } from 'lucide-react';
import { DataTile } from './DataTile';
import { cn } from '@/lib/utils';

interface WeatherDataGridProps {
  data: {
    windSpeed: number;
    windDirection: number;
    temperature: number;
    waveHeight: number;
    distance: number;
    course: number;
    duration: string;
  };
  className?: string;
}

export const WeatherDataGrid: React.FC<WeatherDataGridProps> = ({ 
  data,
  className
}) => {
  const weatherTiles = [
    {
      label: "Wind",
      value: data.windSpeed,
      unit: "knots",
      icon: <Wind className="h-4 w-4" />,
      trend: "up" as const,
      trendLabel: "Increasing"
    },
    {
      label: "Direction",
      value: data.windDirection,
      unit: "°",
      icon: <Compass className="h-4 w-4" />,
      trend: "stable" as const
    },
    {
      label: "Temperature",
      value: data.temperature,
      unit: "°C",
      icon: <Sun className="h-4 w-4" />,
      trend: "down" as const,
      trendLabel: "Cooling"
    }
  ];

  const navigationTiles = [
    {
      label: "Distance",
      value: data.distance,
      unit: "nm",
      icon: <Navigation className="h-4 w-4" />
    },
    {
      label: "Course",
      value: data.course,
      unit: "°",
      icon: <Compass className="h-4 w-4" />
    },
    {
      label: "Duration",
      value: data.duration,
      icon: <Clock className="h-4 w-4" />
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Weather Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Weather Conditions</h3>
        <div className="grid grid-cols-3 gap-3">
          {weatherTiles.map((tile) => (
            <DataTile
              key={tile.label}
              {...tile}
            />
          ))}
        </div>
      </div>

      {/* Navigation Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Navigation</h3>
        <div className="grid grid-cols-3 gap-3">
          {navigationTiles.map((tile) => (
            <DataTile
              key={tile.label}
              {...tile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 