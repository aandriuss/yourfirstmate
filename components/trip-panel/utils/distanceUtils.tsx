import { SailingDestination } from '@/types';

// Calculate distance between two points using the Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3440.065; // Earth's radius in nautical miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

// Calculate sailing duration based on distance
export const calculateDuration = (distanceNM: number): string => {
  const averageSpeed = 5; // Average sailing speed in knots
  const hours = distanceNM / averageSpeed;

  if (hours < 1) {
    return `${Math.round(hours * 60)}min`;
  } else {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    return minutes > 0 ? `${wholeHours}h ${minutes}min` : `${wholeHours}h`;
  }
};

// Recalculate distances and durations for all destinations
export const recalculateDistances = (
  destinations: SailingDestination[]
): SailingDestination[] => {
  if (destinations.length === 0) return [];

  return destinations.map((dest, index) => {
    if (index === 0) {
      // First destination keeps original values
      return dest;
    }

    const prevDest = destinations[index - 1];
    const distance = calculateDistance(
      prevDest.coordinates.lat,
      prevDest.coordinates.lon,
      dest.coordinates.lat,
      dest.coordinates.lon
    );

    return {
      ...dest,
      distanceNM: Math.round(distance * 10) / 10,
      duration: calculateDuration(distance)
    };
  });
};
