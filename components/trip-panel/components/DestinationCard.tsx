import React from 'react';
import { Button, Chip, Card, Tabs, Tab } from '@nextui-org/react';
import { Navigation, Anchor, Clock, Wind, AlertTriangle, BookOpen } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

import { SailingDestination } from '@/types';
import { useSession } from "next-auth/react";
import { ComfortChip } from './ComfortChip';
import { DataCard } from "@/components/ui/cards/DataCard";
import { NotificationCard } from "@/components/ui/cards/NotificationCard";
import { SectionCard } from "@/components/ui/cards/SectionCard";
import { NotificationsList } from "@/components/ui/cards/NotificationsList";

// Hardcoded token - this ensures it works even if environment variables aren't loaded properly on the client
const MAPBOX_TOKEN = "pk.eyJ1IjoidG9tYXNkcnIiLCJhIjoiY202OWNjNDRyMDZ4ejJ2cXQxNnc5ZTJ5biJ9.gZVHMIpx8dsRNFsbfuoUHw";

interface DestinationCardProps {
  destination: SailingDestination;
  index: number;
  onRemove: (day: string) => void;
  getComfortColor: (
    comfort: string
  ) => 'success' | 'warning' | 'danger' | 'default';
  isLastDestination?: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  index,
  onRemove,
  getComfortColor,
  isLastDestination = false
}) => {
  const validComfortLevels = ['comfortable', 'moderate', 'challenging'];
  const comfortLevel = destination.comfortLevel.toLowerCase();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [placeImage, setPlaceImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [imageError, setImageError] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<'photo' | 'map'>('photo');
  const [mapError, setMapError] = React.useState<boolean>(false);
  
  // State for expanded card
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Simple debugging to see what's coming in
  React.useEffect(() => {
    console.log(`Destination ${destination.destination} coordinates:`, destination.coordinates);
  }, [destination]);

  // Ensure coordinates are valid numbers with fallbacks to default values
  const validLon = typeof destination.coordinates?.lon === 'number' 
    ? destination.coordinates.lon
    : typeof destination.coordinates?.lon === 'string'
      ? parseFloat(destination.coordinates.lon)
      : 21.1231; // Default to Athens if missing
  
  const validLat = typeof destination.coordinates?.lat === 'number'
    ? destination.coordinates.lat
    : typeof destination.coordinates?.lat === 'string'
      ? parseFloat(destination.coordinates.lat)
      : 55.7033; // Default value if missing

  // Format to 6 decimal places which is the standard for geo coordinates
  const sanitizedLon = isNaN(validLon) ? 21.1231 : validLon;
  const sanitizedLat = isNaN(validLat) ? 55.7033 : validLat;
  
  // Create a simple, direct static map URL - stripped down for maximum compatibility
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${sanitizedLon},${sanitizedLat},10,0/400x300?access_token=${MAPBOX_TOKEN}`;

  // Debug info
  React.useEffect(() => {
    if (activeTab === 'map') {
      console.log(`Generated map URL for ${destination.destination}:`, staticMapUrl);
      console.log('Using coordinates:', { lon: sanitizedLon, lat: sanitizedLat });
    }
  }, [activeTab, destination.destination, staticMapUrl, sanitizedLon, sanitizedLat]);

  // Determine the fallback image based on destination name if possible
  const getFallbackImage = React.useMemo(() => {
    // Map common destinations to their fallback images
    const fallbackMap: Record<string, string> = {
      'Athens': '/images/mock/klaipeda.jpg',
      'Klaipeda': '/images/mock/klaipeda.jpg',
      'Aegina': '/images/mock/klaipeda.jpg',
      'Hydra': '/images/mock/klaipeda.jpg',
      'Poros': '/images/mock/klaipeda.jpg',
      'Spetses': '/images/mock/klaipeda.jpg',
      'Nafplio': '/images/mock/klaipeda.jpg'
    };
    
    // First try exact match, then try to find a partial match
    const destName = destination.destination || '';
    return fallbackMap[destName] || 
           Object.keys(fallbackMap).find(key => destName.includes(key)) ? 
           fallbackMap[Object.keys(fallbackMap).find(key => destName.includes(key)) || ''] : 
           '/images/mock/klaipeda.jpg';
  }, [destination.destination]);

  // Image loading effect - simplified to handle API limitations
  React.useEffect(() => {
    if (!isAuthenticated) return;
    
    // Set default state to use fallback images right away, since API credits are out
    setIsLoading(false);
    setImageError(true);
  }, [destination.destination, isAuthenticated]);

  // Add this helper function
  const formatDayNumber = (idx: number) => {
    return (idx + 1).toString();
  };

  // Simplified toggle function
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleTabClick = (tab: 'photo' | 'map') => (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion when clicking tabs
    setActiveTab(tab);
  };

  // Create map URL using the destination coordinates
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${
    destination.coordinates?.lon || 21.1231
  },${
    destination.coordinates?.lat || 55.7033
  },10,0/400x300?access_token=${MAPBOX_TOKEN}`;

  const notifications = [
    {
      icon: Wind,
      title: "Weather Conditions",
      message: "Expected conditions: Calm seas with light winds",
      variant: "blue"
    },
    {
      icon: Navigation,
      title: "Navigation Update",
      message: `Distance: ${destination.distanceNM} nm, Duration: ${destination.duration}`,
      variant: "green"
    }
  ];

  // Add warning notification if conditions are challenging
  if (destination.comfortLevel.toLowerCase().includes('challenging')) {
    notifications.push({
      icon: AlertTriangle,
      title: "Safety Warning",
      message: "Challenging conditions expected. Exercise caution.",
      variant: "red"
    });
  }

  return (
    <div className="relative">
      <div 
        className="relative bg-white rounded-lg shadow-sm mb-4 cursor-pointer hover:shadow-md transition-all"
        onClick={handleCardClick}
      >
        <SectionCard
          icon={Navigation}
          iconColor="blue"
          title={destination.destination}
          description={`Day ${index + 1}`}
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <DataCard
              title="Distance"
              value={destination.distanceNM}
              unit="nm"
              icon={Navigation}
            />
            <DataCard
              title="Duration"
              value={destination.duration}
              icon={Clock}
            />
            <DataCard
              title="Comfort"
              value={destination.comfortLevel}
              tag={{
                text: destination.comfortLevel,
                color: getComfortColor(destination.comfortLevel)
              }}
            />
          </div>

          {/* Weather Alert */}
          <div className="mt-4 space-y-3">
            <NotificationCard
              icon={Wind}
              title="Weather Conditions"
              message="Expected conditions: Calm seas with light winds"
              variant="blue"
            />
            
            {destination.comfortLevel === 'challenging' && (
              <NotificationCard
                icon={AlertTriangle}
                title="Safety Warning"
                message="Challenging conditions expected. Exercise caution."
                variant="red"
              />
            )}
          </div>
        </SectionCard>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <NotificationsList notifications={notifications} />
        </div>
      )}
    </div>
  );
};

export default DestinationCard;
