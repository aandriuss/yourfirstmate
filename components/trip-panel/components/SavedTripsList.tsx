import React from 'react';
import { Button } from '@nextui-org/react';

import { SavedTrip } from '@/types';

interface SavedTripsListProps {
  trips: SavedTrip[];
  onTripSelect: (trip: SavedTrip) => void;
}

export const SavedTripsList: React.FC<SavedTripsListProps> = ({
  trips,
  onTripSelect
}) => {
  return (
    <div className="space-y-4">
      <h3 className="mb-4 text-lg font-semibold">Saved Trips</h3>
      {trips.length === 0 ? (
        <p className="text-default-500">No saved trips yet</p>
      ) : (
        trips.map((trip) => (
          <div
            key={trip.id}
            className="hover:bg-default-100 w-full cursor-pointer rounded-lg border p-4"
            onClick={() => onTripSelect(trip)}
          >
            <div className="flex flex-row items-center justify-between">
              <div>
                <h4 className="font-medium">{trip.name}</h4>
                <p className="text-small text-default-500">
                  {new Date(trip.createdAt).toLocaleDateString()}
                </p>
                <p className="text-small text-default-500">
                  {trip.destinations.length} destinations
                </p>
              </div>
              <Button
                color="primary"
                size="sm"
                variant="light"
                onClick={(e) => {
                  e.stopPropagation();
                  onTripSelect(trip);
                }}
              >
                View
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
