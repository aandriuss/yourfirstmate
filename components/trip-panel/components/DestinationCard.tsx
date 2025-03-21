import React from 'react';
import { Navigation, Clock, Wind, AlertTriangle, LucideIcon, X, Compass, ArrowUpRight } from 'lucide-react';
import { Tabs, Tab } from '@nextui-org/react';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';

import { SailingDestination } from '@/types';
import { useSession } from "next-auth/react";
import { NotificationCard } from "@/components/ui/cards/NotificationCard";
import { NotificationsList } from "@/components/ui/cards/NotificationsList";
import { WeatherDataGrid } from "@/components/ui/data-tiles/WeatherDataGrid";
import { cn } from "@/lib/utils";

// Hardcoded token - this ensures it works even if environment variables aren't loaded properly on the client
const MAPBOX_TOKEN = "pk.eyJ1IjoidG9tYXNkcnIiLCJhIjoiY202OWNjNDRyMDZ4ejJ2cXQxNnc5ZTJ5biJ9.gZVHMIpx8dsRNFsbfuoUHw";

type NotificationVariant = NonNullable<React.ComponentProps<typeof NotificationCard>['variant']>;

interface DestinationCardProps {
  destination: SailingDestination;
  index: number;
  onRemove: (day: string) => void;
  getComfortColor: (
    comfort: string
  ) => 'success' | 'warning' | 'danger' | 'default';
  isLastDestination?: boolean;
}

interface NotificationItem {
  icon: LucideIcon;
  title: string;
  message: string;
  variant: NotificationVariant;
}

const ComfortChip: React.FC<{ comfort: string; getComfortColor: (comfort: string) => 'success' | 'warning' | 'danger' | 'default' }> = ({ comfort, getComfortColor }) => {
  const colorVariants = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const colorClass = colorVariants[getComfortColor(comfort)];

  return (
    <div className={cn(
      'px-2 py-1 rounded-full text-xs font-medium border',
      colorClass
    )}>
      {comfort}
    </div>
  );
};

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  index,
  onRemove,
  getComfortColor,
  isLastDestination = false
}) => {
  const { data: session, status } = useSession();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'photo' | 'map'>('photo');
  const [imageError, setImageError] = React.useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(destination.day);
  };

  const handleTabChange = (key: string | number) => {
    setImageError(false);
    setActiveTab(key.toString() as 'photo' | 'map');
  };

  const getStaticMapUrl = () => {
    const { coordinates } = destination;
    return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${coordinates.lon},${coordinates.lat},12,0/400x300?access_token=${MAPBOX_TOKEN}`;
  };

  const notificationItems: NotificationItem[] = [
    {
      icon: Compass,
      title: "AI Assessment",
      message: "AI assessments are available with Premium. Upgrade to unlock this feature",
      variant: "blue"
    },
    {
      icon: Wind,
      title: "Weather Update",
      message: "Wind shift expected in 3 hours. Prepare for 15 knots from NW.",
      variant: "amber"
    },
    {
      icon: AlertTriangle,
      title: "Vessel Alert",
      message: "Prepare for wind. Wind increasing to 20 knots within next 30 minutes.",
      variant: "red"
    }
  ];

  if (destination.comfortLevel.toLowerCase() === 'challenging') {
    notificationItems.push({
      icon: Navigation,
      title: "Pilot Information",
      message: "Approach Fairway, COLREGs Rules 9 & 13 apply. Maintain radio watch on VHF Ch. 12.",
      variant: "purple"
    });
  }

  // Mock weather data - in a real app, this would come from your backend
  const getMockWeatherData = () => ({
    windSpeed: 6.8,
    windDirection: 45,
    temperature: 22,
    waveHeight: 1.2,
    distance: destination.distanceNM,
    course: 140,
    duration: destination.duration
  });

  return (
    <div className="relative">
      <div 
        className={cn(
          "relative bg-white rounded-lg shadow-sm mb-4 cursor-pointer hover:shadow-md transition-all",
          isExpanded && "border-2 border-transparent bg-gradient-to-r from-[#6366f1] to-[#a855f7] p-[2px]"
        )}
        onClick={handleCardClick}
      >
        <div className={cn(
          "h-full w-full bg-white rounded-lg overflow-hidden",
          isExpanded && "relative"
        )}>
          {/* Header with Tabs */}
          <div className="flex items-center justify-between px-4 pt-2">
            <Tabs 
              selectedKey={activeTab}
              onSelectionChange={handleTabChange}
              classNames={{
                tabList: "gap-4",
                cursor: "w-full bg-primary",
                tab: "px-0 h-8",
                tabContent: "group-data-[selected=true]:text-primary"
              }}
              variant="underlined"
              size="sm"
            >
              <Tab key="photo" title="Photo" />
              <Tab key="map" title="Map" />
            </Tabs>
            <button 
              onClick={handleRemove}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Photo/Map Content */}
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            {activeTab === 'photo' ? (
              <Image
                src="/images/mock/klaipeda.jpg"
                alt={destination.destination}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              !imageError && (
                <Image
                  src={getStaticMapUrl()}
                  alt={`Map of ${destination.destination}`}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  priority
                />
              )
            )}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <p className="text-sm">Image not available</p>
              </div>
            )}
          </div>

          <div className="p-4">
            {/* Main Content */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="rounded-full bg-gray-900 p-3 flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <span className="text-white text-sm">{index + 1}</span>
              </div>
              <div>
                <h3 className="font-medium">{destination.destination}</h3>
                <p className="text-sm text-muted-foreground">Day {index + 1}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Distance</p>
                <div className="flex items-center space-x-1">
                  <Navigation className="h-3 w-3 text-muted-foreground" />
                  <p className="text-sm">{destination.distanceNM} nm</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <p className="text-sm">{destination.duration}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Comfort</p>
                <ComfortChip 
                  comfort={destination.comfortLevel}
                  getComfortColor={getComfortColor}
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4">
              {destination.safety}
            </p>

            {/* Expanded content - Weather Data and Notifications */}
            {isExpanded && (
              <div className="space-y-4 border-t border-gray-100 pt-4">
                {/* Weather Data Grid */}
                <WeatherDataGrid data={getMockWeatherData()} />
                
                {/* Notifications */}
                <NotificationsList 
                  notifications={notificationItems}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
