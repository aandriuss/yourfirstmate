import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';

import { SavedTrip } from '@/types';
import { saveTripsToNeon, loadTripsFromNeon } from '../api/savedTripsApi';
import { SaveTripModal } from './SaveTripModal';

interface SavedTripsListProps {
  userId: string;
  trips: SavedTrip[];
  onTripSelect: (trip: SavedTrip) => void;
}

export const SavedTripsList: React.FC<SavedTripsListProps> = ({
  userId,
  trips,
  onTripSelect
}) => {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(trips);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load trips from Neon when component mounts
  useEffect(() => {
    const fetchTrips = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const tripsFromNeon = await loadTripsFromNeon(userId);
        console.log('Loaded trips from Neon:', tripsFromNeon);
        setSavedTrips(tripsFromNeon);
      } catch (error) {
        console.error('Error loading trips:', error);
        // Fallback to local trips if loading from Neon fails
        setSavedTrips(trips);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrips();
  }, [userId, trips]);

  // Don't automatically save trips on every change
  // Instead, only save when a new trip is added or explicitly saved
  const handleSaveTrip = async (name: string) => {
    if (!userId) return;
    
    const newTrip: SavedTrip = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      destinations: [],
      updatedAt: new Date().toISOString()
    };

    try {
      const updatedTrips = [...savedTrips, newTrip];
      await saveTripsToNeon(userId, updatedTrips);
      setSavedTrips(updatedTrips);
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving new trip:', error);
      // Handle error (maybe show a notification)
    }
  };

  // Add a function to delete a trip
  const handleDeleteTrip = async (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    
    if (!userId) return;
    
    try {
      // Filter out the deleted trip
      const updatedTrips = savedTrips.filter(trip => trip.id !== tripId);
      
      // Save the updated list to Neon
      await saveTripsToNeon(userId, updatedTrips);
      
      // Update local state
      setSavedTrips(updatedTrips);
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Trips</h3>
        <Button 
          size="sm" 
          color="primary" 
          onClick={() => setModalOpen(true)}
        >
          New Trip
        </Button>
      </div>
      
      {isLoading ? (
        <p className="text-default-500">Loading trips...</p>
      ) : savedTrips.length === 0 ? (
        <p className="text-default-500">No saved trips yet</p>
      ) : (
        savedTrips.map((trip) => (
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
              <Button
                color="danger"
                size="sm"
                variant="light"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTrip(trip.id, e);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
      <SaveTripModal
        isOpen={isModalOpen}
        isUpdate={false}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTrip}
      />
    </div>
  );
};
