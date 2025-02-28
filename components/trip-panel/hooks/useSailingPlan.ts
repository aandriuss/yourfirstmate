import { useState, useEffect } from 'react';

import { clearMapLayers, visualizeRoute } from '../utils/mapVisualization';

import { saveExtendedPorts, getExtendedPorts } from '@/utils/storageUtils';
import { SailingDestination, Port } from '@/types';

interface ExtendedPort {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface ApiResponse {
  weekPlan: SailingDestination[];
  extendedPorts: ExtendedPort[];
}

export const useSailingPlan = (
  mapRef: React.RefObject<mapboxgl.Map>,
  onTripStart: (coordinates: { lat: number; lon: number }) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedDestinations, setSelectedDestinations] = useState<
    SailingDestination[]
  >([]);
  const [extendedPorts, setExtendedPorts] = useState<ExtendedPort[]>([]);
  const [showPlacesList, setShowPlacesList] = useState(true);

  // Load extended ports from localStorage on mount
  useEffect(() => {
    const savedExtendedPorts = getExtendedPorts();

    if (savedExtendedPorts.length > 0) {
      setExtendedPorts(savedExtendedPorts);
    }
  }, []);

  const fetchSailingPlan = async (selectedPort: Port) => {
    try {
      setIsLoading(true);
      setApiError(null);
      setShowPlacesList(false);

      // Clear existing data and map
      if (mapRef.current) {
        await clearMapLayers(mapRef.current);
      }
      setSelectedDestinations([]);

      // Get custom prompt if available
      const customPrompt =
        localStorage.getItem('myBoatPrompt') ||
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('myBoatPrompt='))
          ?.split('=')[1];

      // Fetch sailing plan from API
      const response = await fetch('/api/generateSailingPlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: selectedPort,
          localtime: new Date().toISOString(),
          customPrompt: customPrompt || undefined
        })
      });

      const data = await response.json();
      const parsedResponse = parseTripPlan(data.content);

      if (parsedResponse) {
        const { weekPlan, extendedPorts: additionalPorts } = parsedResponse;

        // Process destinations
        const newDestinations = weekPlan.map((dest, index) => ({
          ...dest,
          isActive: index === 0
        }));

        // Update state and save to localStorage
        setSelectedDestinations(newDestinations);
        setExtendedPorts(additionalPorts || []);
        saveExtendedPorts(additionalPorts || []);

        // Update map and trigger trip start
        onTripStart({
          lat: selectedPort.coordinates.lat,
          lon: selectedPort.coordinates.lon
        });

        // Wait for map and trip start to settle
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Try to visualize route multiple times if needed
        if (mapRef.current) {
          let attempt = 0;
          const maxAttempts = 3;

          while (attempt < maxAttempts) {
            if (mapRef.current.isStyleLoaded()) {
              try {
                await visualizeRoute(mapRef.current, newDestinations);
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
      } else {
        throw new Error('Failed to parse trip plan');
      }
    } catch (error) {
      setApiError(`Error fetching sailing plan: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableDestinations = (
    searchQuery: string
  ): SailingDestination[] => {
    const currentDestinations = new Set(
      selectedDestinations.map((dest) => dest.destination)
    );

    // Combine both API-provided extended ports and localStorage extended ports
    const allExtendedPorts = [...extendedPorts, ...getExtendedPorts()];

    // Create extended destinations from ports
    const extendedDestinations = allExtendedPorts.map((port) => ({
      destination: port.name,
      coordinates: port.coordinates,
      day: '',
      distanceNM: 0,
      duration: '',
      comfortLevel: 'moderate',
      safety: 'Additional destination from extended ports list'
    }));

    // Filter out already selected destinations
    const unselectedWeekPlanDestinations = selectedDestinations.filter(
      (dest) => !currentDestinations.has(dest.destination)
    );

    // Combine all available destinations
    // Combine and deduplicate all available destinations
    const allDestinations = Array.from(
      new Map(
        [...unselectedWeekPlanDestinations, ...extendedDestinations].map(
          (dest) => [dest.destination, dest]
        )
      ).values()
    );

    // Filter by search query
    return allDestinations.filter(
      (dest) =>
        !currentDestinations.has(dest.destination) &&
        dest.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return {
    isLoading,
    apiError,
    selectedDestinations,
    setSelectedDestinations,
    fetchSailingPlan,
    showPlacesList,
    setShowPlacesList,
    getAvailableDestinations
  };
};

// Helper function to parse API response
function parseTripPlan(tripPlanText: string): ApiResponse | null {
  const cleanedText = tripPlanText.replace(/```json|```/g, '').trim();

  try {
    const parsedData = JSON.parse(cleanedText);

    return {
      weekPlan: parsedData.weekPlan,
      extendedPorts: parsedData.extendedPorts || []
    };
  } catch (error) {
    console.error('Error parsing JSON:', error);

    return null;
  }
}
