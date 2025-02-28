import { SailingDestination, SavedTrip } from '@/types';

const STORAGE_KEY = 'savedTrips';
const EXTENDED_PORTS_KEY = 'extendedPorts';

interface ExtendedPort {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export const saveTrip = (trip: SavedTrip): SavedTrip[] => {
  try {
    const existingTrips = getTrips();
    const tripIndex = existingTrips.findIndex((t) => t.id === trip.id);
    let updatedTrips: SavedTrip[];

    if (tripIndex >= 0) {
      updatedTrips = existingTrips.map((t, index) =>
        index === tripIndex
          ? { ...trip, updatedAt: new Date().toISOString() }
          : t
      );
    } else {
      updatedTrips = [
        ...existingTrips,
        {
          ...trip,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));

    return updatedTrips;
  } catch (error) {
    console.error('Error saving trips:', error);

    return getTrips();
  }
};

// Save extended ports to local storage
export const saveExtendedPorts = (ports: ExtendedPort[]): void => {
  try {
    localStorage.setItem(EXTENDED_PORTS_KEY, JSON.stringify(ports));
  } catch (error) {
    console.error('Error saving extended ports:', error);
  }
};

// Get extended ports from local storage
export const getExtendedPorts = (): ExtendedPort[] => {
  try {
    const portsJson = localStorage.getItem(EXTENDED_PORTS_KEY);

    if (!portsJson) {
      return [];
    }

    const ports = JSON.parse(portsJson);

    if (!Array.isArray(ports)) {
      console.warn('Invalid extended ports data structure in storage');

      return [];
    }

    return ports.filter(
      (port) =>
        port &&
        typeof port === 'object' &&
        'name' in port &&
        'coordinates' in port &&
        typeof port.coordinates === 'object' &&
        'lat' in port.coordinates &&
        'lon' in port.coordinates
    );
  } catch (error) {
    console.error('Error reading extended ports from storage:', error);

    return [];
  }
};

export const getTrips = (): SavedTrip[] => {
  try {
    const tripsJson = localStorage.getItem(STORAGE_KEY);

    if (!tripsJson) {
      return [];
    }

    const trips = JSON.parse(tripsJson);

    // Validate the structure of the parsed data
    if (!Array.isArray(trips)) {
      console.warn('Invalid trips data structure in storage');

      return [];
    }

    // Validate each trip has required properties
    return trips.filter(
      (trip) =>
        trip &&
        typeof trip === 'object' &&
        'id' in trip &&
        'name' in trip &&
        'destinations' in trip &&
        Array.isArray(trip.destinations)
    );
  } catch (error) {
    console.error('Error reading trips from storage:', error);

    return [];
  }
};

export const deleteTrip = (tripId: string): SavedTrip[] => {
  try {
    const currentTrips = getTrips();
    const updatedTrips = currentTrips.filter((trip) => trip.id !== tripId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));

    return updatedTrips;
  } catch (error) {
    console.error('Error deleting trip:', error);

    return getTrips();
  }
};

export const generateTripId = (): string => {
  return `trip_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const areDestinationsEqual = (
  destinations1: SailingDestination[],
  destinations2: SailingDestination[]
): boolean => {
  if (destinations1.length !== destinations2.length) return false;

  return destinations1.every((dest1, index) => {
    const dest2 = destinations2[index];

    return (
      dest1.destination === dest2.destination &&
      dest1.coordinates.lat === dest2.coordinates.lat &&
      dest1.coordinates.lon === dest2.coordinates.lon
    );
  });
};
