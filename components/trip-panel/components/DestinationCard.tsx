import React from 'react';
import { Button, Chip, Card, Image, Tabs, Tab } from '@nextui-org/react';
import mapboxgl from 'mapbox-gl';

import { SailingDestination } from '@/types';
import { useSession } from "next-auth/react";

interface DestinationCardProps {
  destination: SailingDestination;
  index: number;
  onRemove: (day: string) => void;
  getComfortColor: (
    comfort: string
  ) => 'success' | 'warning' | 'danger' | 'default';
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onRemove,
  getComfortColor
}) => {
  const validComfortLevels = ['comfortable', 'moderate', 'challenging'];
  const comfortLevel = destination.comfortLevel.toLowerCase();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  const mapboxImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+555555(${destination.coordinates.lon},${destination.coordinates.lat})/${destination.coordinates.lon},${destination.coordinates.lat},10/300x200?access_token=${mapboxgl.accessToken}`;

  const unsplashAccessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  const [placeImage, setPlaceImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPlaceImage = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${destination.destination}&client_id=${unsplashAccessKey}&per_page=1`
        );
        const data = await response.json();

        if (data.results?.[0]) {
          setPlaceImage(data.results[0].urls.regular);
        }
      } catch (error) {
        console.error('Error fetching place image:', error);
      }
    };

    fetchPlaceImage();
  }, [destination.destination, isAuthenticated]);

  return (
    <Card className="p-4">
      <Button
        isIconOnly
        className="absolute right-2 top-2 z-10"
        size="sm"
        variant="light"
        onClick={() => onRemove(destination.day)}
      >
        ✕
      </Button>

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-medium">{destination.destination}</h3>
        <div className="text-default-500 flex-1 text-center">
          {destination.day}
        </div>
        <div className="w-[28px]" />
      </div>
      {isAuthenticated && (
        <div className="mb-2 w-full">
          <Tabs aria-label="Destination views">
            <Tab key="photo" title="Photo">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
                <Image
                  alt={`Photo of ${destination.destination}`}
                  className="object-cover"
                  height="100%"
                  src={placeImage || 'images/mock/klaipeda.jpg'}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                  width="100%"
                />
              </div>
            </Tab>
            <Tab key="map" title="Map">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
                <Image
                  alt={`Map of ${destination.destination}`}
                  className="object-cover"
                  height="100%"
                  src={mapboxImageUrl}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                  width="100%"
                />
              </div>
            </Tab>
          </Tabs>
        </div>
      )}

      <p className="text-default-500 mb-2">{destination.safety}</p>

      <div className="flex items-center justify-between">
        {validComfortLevels.includes(comfortLevel) && (
          <Chip color={getComfortColor(comfortLevel)} variant="flat">
            {destination.comfortLevel}
          </Chip>
        )}
        {destination.distanceNM > 0 && (
          <span>
            {destination.distanceNM} nm ({destination.duration})
          </span>
        )}
      </div>
    </Card>
  );
};

export default DestinationCard;
