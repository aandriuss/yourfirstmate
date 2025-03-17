import React from 'react';
import { useSession } from 'next-auth/react';
import {
  Input,
  Listbox,
  ListboxItem,
  Button,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@nextui-org/react';
import { List, LayoutGrid, Trash2 } from 'lucide-react';

import { useTripPanel } from '../hooks/useTripPanel';
import { SavedTrip } from '@/types';

import { InitialPlacesList } from './InitialPlacesList';
import { DestinationCard } from './DestinationCard';
import DraggableListView from './DraggableListView';
import { SaveTripModal } from './SaveTripModal';

import { Port } from '@/types';
import { saveTripsToNeon } from '../api/savedTripsApi';

interface TripPanelContentProps {
  isAuthenticated: boolean;
  tripPanelHook: ReturnType<typeof useTripPanel>;
  portsData: Port[];
}

export const TripPanelContent: React.FC<TripPanelContentProps> = ({
  isAuthenticated,
  tripPanelHook,
  portsData
}) => {
  const { data: session } = useSession();

  const topRatedPorts = portsData
    .filter((port) => port.top !== '')
    .sort((a, b) => Number(a.top) - Number(b.top));

  if (tripPanelHook.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading your sailing plan...</div>
      </div>
    );
  }

  const handleTripUpdate = async (updatedTrip: SavedTrip) => {
    if (!session?.user?.id) return;
    
    // Find the trip in the list and update it
    const updatedTrips = tripPanelHook.savedTrips.map(trip => 
      trip.id === updatedTrip.id ? updatedTrip : trip
    );
    
    // Save to local storage using the available method
    tripPanelHook.handleSaveTrip(updatedTrip.name);
    
    // Save to Neon
    try {
      await saveTripsToNeon(session.user.id, updatedTrips);
      console.log('Trips saved successfully after update');
    } catch (error) {
      console.error('Failed to save updated trips:', error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none items-center justify-between border-b px-4">
        {tripPanelHook.apiError && (
          <div className="text-danger bg-danger-50 mb-4 rounded-lg p-2">
            {tripPanelHook.apiError}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Tabs
            aria-label="Trip Planning Options"
            classNames={{
              tabList: 'gap-6',
              cursor: 'w-full bg-primary',
              tab: 'max-w-fit px-2 h-12 data-[disabled=true]:opacity-40 data-[disabled=true]:cursor-not-allowed',
              tabContent: 'text-default-500 data-[selected=true]:text-primary',
              base: "w-full",
              wrapper: "border-b-2 data-[selected=true]:border-primary"
            }}
            selectedKey={tripPanelHook.activeTab}
            variant="underlined"
            onSelectionChange={(key) =>
              tripPanelHook.setActiveTab(key.toString())
            }
          >
            <Tab 
              key="start" 
              title="Start"
              className="px-4 py-2 text-sm"
            />
            <Tab
              key="trip"
              isDisabled={tripPanelHook.selectedDestinations.length === 0}
              title="Trip"
              className="px-4 py-2 text-sm"
            />
            <Tab 
              key="saved" 
              title="Saved Trips"
              className="px-4 py-2 text-sm"
            />
          </Tabs>

          {tripPanelHook.selectedDestinations.length > 0 && (
            <Button
              color="primary"
              size="sm"
              onPress={() => tripPanelHook.setIsSaveModalOpen(true)}
              className="whitespace-nowrap"
            >
              Save Trip
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {tripPanelHook.activeTab === 'start' && (
          <InitialPlacesList
            ports={
              tripPanelHook.initialSearchQuery
                ? portsData.filter((port) =>
                    port.port
                      .toLowerCase()
                      .includes(tripPanelHook.initialSearchQuery.toLowerCase())
                  )
                : topRatedPorts
            }
            searchQuery={tripPanelHook.initialSearchQuery}
            onSearchChange={tripPanelHook.setInitialSearchQuery}
            onSelect={tripPanelHook.handleInitialSelect}
          />
        )}

        {tripPanelHook.activeTab === 'trip' && (
          <div className="space-y-4">
            <div className="relative flex items-center space-x-4">
              <Input
                placeholder="Add more destinations..."
                value={tripPanelHook.tripSearchQuery}
                onChange={(e) => {
                  tripPanelHook.setTripSearchQuery(e.target.value);
                  tripPanelHook.setShowDestinationSuggestions(true);
                }}
                onFocus={() =>
                  tripPanelHook.setShowDestinationSuggestions(true)
                }
              />
              {tripPanelHook.showDestinationSuggestions &&
                tripPanelHook.tripSearchQuery && (
                  <div className="absolute inset-x-0 top-full z-50 mt-1">
                    <div className="bg-content1 rounded-lg shadow-lg">
                      <Listbox
                        aria-label="Available destinations"
                        items={tripPanelHook.getAvailableDestinations(
                          tripPanelHook.tripSearchQuery
                        )}
                        variant="flat"
                        onAction={(key) => {
                          const destination = tripPanelHook
                            .getAvailableDestinations(
                              tripPanelHook.tripSearchQuery
                            )
                            .find((d) => d.destination === key);

                          if (destination) {
                            tripPanelHook.handleAddDestination(destination);
                          }
                        }}
                      >
                        {(destination) => (
                          <ListboxItem key={destination.destination}>
                            {destination.destination}
                          </ListboxItem>
                        )}
                      </Listbox>
                    </div>
                  </div>
                )}
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() =>
                  tripPanelHook.setIsListView(!tripPanelHook.isListView)
                }
              >
                {tripPanelHook.isListView ? <LayoutGrid /> : <List />}
              </Button>
            </div>

            {tripPanelHook.isListView ? (
              <DraggableListView
                destinations={tripPanelHook.selectedDestinations}
                onRemove={tripPanelHook.handleRemoveDestination}
                onReorder={tripPanelHook.handleReorderDestinations}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tripPanelHook.selectedDestinations.map(
                  (destination, index) => (
                    <DestinationCard
                      key={destination.day}
                      destination={destination}
                      getComfortColor={(comfort: string) => {
                        const level = comfort.toLowerCase();

                        if (level.includes('comfortable')) return 'success';
                        if (level.includes('moderate')) return 'warning';
                        if (level.includes('challenging')) return 'danger';

                        return 'default';
                      }}
                      index={index}
                      onRemove={tripPanelHook.handleRemoveDestination}
                    />
                  )
                )}
              </div>
            )}
          </div>
        )}

        {tripPanelHook.activeTab === 'saved' && (
          <div className="space-y-4">
            {tripPanelHook.savedTrips.length === 0 ? (
              <p className="text-default-500">No saved trips yet</p>
            ) : (
              tripPanelHook.savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="hover:bg-default-100 w-full cursor-pointer rounded-lg border p-4"
                  onClick={() => tripPanelHook.handleLoadSavedTrip(trip)}
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
                    <div className="flex gap-2">
                      <Button
                        color="primary"
                        size="sm"
                        variant="light"
                        onPress={() => {
                          tripPanelHook.handleLoadSavedTrip(trip);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="light"
                        onPress={() => {
                          tripPanelHook.handleDeleteTrip(trip.id);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
