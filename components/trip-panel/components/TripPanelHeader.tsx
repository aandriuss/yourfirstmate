import React from 'react';
import { Button } from '@nextui-org/react';

import { SailingDestination } from '@/types';

interface TripPanelHeaderProps {
  showPlacesList: boolean;
  selectedDestinations: SailingDestination[];
  onSaveClick: () => void;
  onClose: () => void;
}

export const TripPanelHeader: React.FC<TripPanelHeaderProps> = ({
  showPlacesList,
  selectedDestinations,
  onSaveClick,
  onClose
}) => {
  const totalDistance = selectedDestinations.reduce(
    (acc, dest) => acc + (dest.distanceNM || 0),
    0
  );

  return (
    <div className="border-divider flex items-center justify-between border-b p-4">
      <h2 className="text-xl font-semibold">
        {showPlacesList ? 'Choose Destination' : 'Your Trip'}
      </h2>
      <div className="flex items-center gap-2">
        {!showPlacesList && selectedDestinations.length > 0 && (
          <>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                Direct Distance: {totalDistance.toFixed(0)} NM
              </span>
              <span className="text-sm font-medium">
                Approx. Sailing Distance: {(totalDistance * 1.3).toFixed(0)} NM
              </span>
            </div>
          </>
        )}
        <Button
          isIconOnly
          aria-label="Close panel"
          size="sm"
          variant="light"
          onClick={onClose}
        >
          ✕
        </Button>
      </div>
    </div>
  );
};
