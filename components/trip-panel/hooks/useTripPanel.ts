import { useState, useEffect, RefObject } from 'react';

import { recalculateDistances } from '../utils/distanceUtils';
import {
  clearMapLayers,
  visualizeRoute,
  updateRouteVisualization
} from '../utils/mapVisualization';
import { RouteEditor } from '../utils/routeEditor';

import { useSailingPlan } from './useSailingPlan';

import {
  saveTrip,
  getTrips,
  deleteTrip,
  generateTripId,
  areDestinationsEqual
} from '@/utils/storageUtils';
import { Port, SailingDestination, SavedTrip } from '@/types';

export interface UseTripPanelProps {
  mapRef: RefObject<mapboxgl.Map>;
  isEditMode: boolean;
  onTripStart: (coordinates: { lat: number; lon: number }) => void;
  portsData: Port[];
  onClose: () => void;
  onDestinationSelect?: (port: Port) => void;
}

export const useTripPanel = ({
  mapRef,
  onTripStart,
  portsData,
  onDestinationSelect,
  onClose
}: UseTripPanelProps) => {
  // Panel state
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('start');
  const [isListView, setIsListView] = useState(false);

  // Search and suggestions state
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  const [tripSearchQuery, setTripSearchQuery] = useState('');
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  // Trip management state
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [lastSavedDestinations, setLastSavedDestinations] = useState<
    SailingDestination[]
  >([]);

  // Modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

  // Initialize sailing plan hook
  const sailingPlanHook = useSailingPlan(mapRef, onTripStart);

  const [routeEditor, setRouteEditor] = useState<RouteEditor | null>(null);

  useEffect(() => {
    if (mapRef.current && !routeEditor) {
      const editor = new RouteEditor({
        map: mapRef.current,
        onRouteUpdate: (updatedDestinations) => {
          sailingPlanHook.setSelectedDestinations(updatedDestinations);
          updateRouteVisualization(mapRef.current!, updatedDestinations);
        }
      });

      setRouteEditor(editor);
    }

    return () => {
      if (routeEditor) {
        routeEditor.cleanup();
      }
    };
  }, [mapRef.current]);

  // Keep RouteEditor in sync with current destinations
  useEffect(() => {
    if (routeEditor) {
      routeEditor.setDestinations(sailingPlanHook.selectedDestinations);
    }
  }, [sailingPlanHook.selectedDestinations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (routeEditor) {
        routeEditor.cleanup();
      }
    };
  }, []);

  // Load saved trips on mount
  useEffect(() => {
    setSavedTrips(getTrips());
  }, []);

  // Auto-switch to trip tab when destinations are added
  useEffect(() => {
    if (sailingPlanHook.selectedDestinations.length > 0) {
      setActiveTab('trip');
    }
  }, [sailingPlanHook.selectedDestinations]);

  const clearMap = () => {
    if (!mapRef.current) return;
    clearMapLayers(mapRef.current);
  };

  const handleInitialSelect = async (selectedPort: Port) => {
    if (isPanelMinimized) {
      setIsPanelMinimized(false);
    }

    // Reset trip state
    setCurrentTripId(null);
    setLastSavedDestinations([]);
    setIsListView(false);

    onDestinationSelect?.(selectedPort);

    // Clear map and fetch new plan
    clearMap();
    await sailingPlanHook.fetchSailingPlan(selectedPort);
  };

  const handleAddDestination = (destination: SailingDestination) => {
    const newDestinations = [
      ...sailingPlanHook.selectedDestinations,
      {
        ...destination,
        day: new Date(
          Date.now() +
            sailingPlanHook.selectedDestinations.length * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split('T')[0]
      }
    ];

    const recalculatedDestinations = recalculateDistances(newDestinations);

    sailingPlanHook.setSelectedDestinations(recalculatedDestinations);

    // Update map visualization
    if (mapRef.current) {
      updateRouteVisualization(mapRef.current, recalculatedDestinations);
    }

    setTripSearchQuery('');
    setShowDestinationSuggestions(false);
  };

  const handleRemoveDestination = (day: string) => {
    const newDestinations = sailingPlanHook.selectedDestinations.filter(
      (dest) => dest.day !== day
    );
    const recalculatedDestinations = recalculateDistances(newDestinations);

    sailingPlanHook.setSelectedDestinations(recalculatedDestinations);

    // Update map visualization
    if (mapRef.current) {
      if (recalculatedDestinations.length === 0) {
        clearMap();
      } else {
        updateRouteVisualization(mapRef.current, recalculatedDestinations);
      }
    }
  };

  const handleReorderDestinations = (newDestinations: SailingDestination[]) => {
    const recalculatedDestinations = recalculateDistances(newDestinations);

    sailingPlanHook.setSelectedDestinations(recalculatedDestinations);

    // Update map visualization
    if (mapRef.current) {
      updateRouteVisualization(mapRef.current, recalculatedDestinations);
    }
  };

  const handleLoadSavedTrip = async (trip: SavedTrip) => {
    setCurrentTripId(trip.id);
    setLastSavedDestinations(trip.destinations);
    sailingPlanHook.setSelectedDestinations(trip.destinations);
    sailingPlanHook.setShowPlacesList(false);

    // Set the current destination from the first destination in the trip
    if (trip.destinations[0]) {
      const startPort: Port = {
        port: trip.destinations[0].destination,
        coordinates: trip.destinations[0].coordinates,
        top: '',
        comfortScore: trip.destinations[0].comfortLevel
      };

      onDestinationSelect?.(startPort);
      onTripStart(trip.destinations[0].coordinates);
    }

    // Wait for map and trip start to settle
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Try to visualize route multiple times if needed
    if (mapRef.current) {
      let attempt = 0;
      const maxAttempts = 3;

      while (attempt < maxAttempts) {
        if (mapRef.current.isStyleLoaded()) {
          try {
            await visualizeRoute(mapRef.current, trip.destinations);
            break;
          } catch (visualError) {
            console.log(
              `Route visualization attempt ${attempt + 1} failed:`,
              visualError
            );
          }
        }
        attempt++;
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    const updatedTrips = deleteTrip(tripId);

    setSavedTrips(updatedTrips);

    if (tripId === currentTripId) {
      setCurrentTripId(null);
      setLastSavedDestinations([]);
      sailingPlanHook.setSelectedDestinations([]);
      clearMap();
    }
  };

  const hasUnsavedChanges = () => {
    if (sailingPlanHook.selectedDestinations.length === 0) return false;
    if (lastSavedDestinations.length === 0) return true;

    return !areDestinationsEqual(
      sailingPlanHook.selectedDestinations,
      lastSavedDestinations
    );
  };

  const handleSaveTrip = (tripName: string) => {
    const tripData: SavedTrip = {
      id: currentTripId || generateTripId(),
      name: tripName,
      destinations: sailingPlanHook.selectedDestinations,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTrips = saveTrip(tripData);

    setSavedTrips(updatedTrips);
    setCurrentTripId(tripData.id);
    setLastSavedDestinations([...sailingPlanHook.selectedDestinations]);
    setShowUnsavedChangesModal(false);
  };

  const handleClose = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedChangesModal(true);
    } else {
      closePanel();
    }
  };

  const closePanel = () => {
    sailingPlanHook.setShowPlacesList(true);
    sailingPlanHook.setSelectedDestinations([]);
    setLastSavedDestinations([]);
    setCurrentTripId(null);
    setInitialSearchQuery('');
    setTripSearchQuery('');
    setIsPanelMinimized(false);
    setActiveTab('start');
    clearMap();
    onClose();
  };

  return {
    ...sailingPlanHook,
    isPanelMinimized,
    setIsPanelMinimized,
    isSaveModalOpen,
    setIsSaveModalOpen,
    showUnsavedChangesModal,
    setShowUnsavedChangesModal,
    savedTrips,
    initialSearchQuery,
    setInitialSearchQuery,
    tripSearchQuery,
    setTripSearchQuery,
    showDestinationSuggestions,
    setShowDestinationSuggestions,
    isListView,
    setIsListView,
    currentTripId,
    activeTab,
    setActiveTab,
    handleSaveTrip,
    handleLoadSavedTrip,
    handleDeleteTrip,
    handleClose,
    closePanel,
    handleInitialSelect,
    handleAddDestination,
    handleRemoveDestination,
    handleReorderDestinations
  };
};
