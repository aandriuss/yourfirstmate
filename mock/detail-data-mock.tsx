import type { TripDestination } from '@/types';
export interface TripPlan {
  totalDistance: number;
  totalDays: number;
  startLocation: string;
  destinations: TripDestination[];
}

export const tripData: TripPlan = {
  totalDistance: 120,
  totalDays: 7,
  startLocation: 'Klaipėda',
  destinations: [
    {
      id: 'klaipeda',
      name: 'Klaipėda',
      day: 1,
      sailingHours: 6,
      image: '/images/mock/klaipeda.jpg',
      description:
        'Nice place to eat. Has castle. Klaipėda is a port city in Lithuania, known for its rich history and vibrant cultural scene. The city offers a variety of dining options and historical sites, including the Klaipėda Castle.',
      rating: 8,
      distanceNM: 12,
      coordinates: { lat: 55.7033, lon: 21.1443 }
    },
    {
      id: 'juodkrante',
      name: 'Juodkrantė',
      day: 2,
      sailingHours: 5,
      image: '/images/mock/juodkrante.jpg',
      description:
        'Small town with sea and lagoon beaches. Juodkrantė is a picturesque town located on the Curonian Spit, known for its beautiful beaches and serene atmosphere. It is a perfect spot for relaxation and enjoying nature.',
      rating: 8,
      distanceNM: 8,
      coordinates: { lat: 55.5519, lon: 21.1222 }
    },
    {
      id: 'negyvos-kopos',
      name: 'Negyvos Kopos',
      day: 3,
      sailingHours: 3,
      image: '/images/mock/negyvos-kopos.jpg',
      description:
        'Popular nature place to visit. Negyvos Kopos, also known as the Dead Dunes, is a unique natural attraction on the Curonian Spit. The area is known for its shifting sand dunes and stunning landscapes, making it a must-visit for nature enthusiasts.',
      rating: 8,
      distanceNM: 6,
      coordinates: { lat: 55.5019, lon: 21.1022 }
    },
    {
      id: 'nida',
      name: 'Nida',
      day: 4,
      sailingHours: 3,
      image: '/images/mock/nida.jpeg',
      description:
        'Best town on peninsula. Have fun! Nida is a charming town on the Curonian Spit, famous for its beautiful scenery, traditional wooden houses, and vibrant cultural life. It is a popular destination for tourists seeking a mix of relaxation and cultural experiences.',
      rating: 9,
      distanceNM: 10,
      coordinates: { lat: 55.3033, lon: 21.0097 }
    },
    {
      id: 'preila',
      name: 'Preila',
      day: 5,
      sailingHours: 4,
      image: '/images/mock/preila.jpg',
      description:
        'Quiet village with beautiful nature. Preila is a small village on the Curonian Spit, known for its peaceful environment and stunning natural surroundings. It is an ideal destination for those looking to escape the hustle and bustle of city life.',
      rating: 7,
      distanceNM: 7,
      coordinates: { lat: 55.35, lon: 21.0667 }
    },
    {
      id: 'pervalka',
      name: 'Pervalka',
      day: 6,
      sailingHours: 2,
      image: '/images/mock/pervalka.jpg',
      description:
        'Small village perfect for peaceful stay. Pervalka is a tranquil village on the Curonian Spit, offering a serene environment and beautiful natural landscapes. It is an ideal spot for a peaceful retreat.',
      rating: 7,
      distanceNM: 5,
      coordinates: { lat: 55.4144, lon: 21.0936 }
    },
    {
      id: 'liepaja',
      name: 'Liepaja',
      day: 7,
      sailingHours: 8,
      image: '/images/mock/liepaja.jpg',
      description:
        'Historic Latvian port city with beautiful beach. Liepaja is a historic port city in Latvia, known for its stunning beaches and rich cultural heritage. The city offers a mix of historical sites, cultural attractions, and beautiful coastal scenery.',
      rating: 8,
      distanceNM: 45,
      coordinates: { lat: 56.505, lon: 21.0107 }
    }
  ]
};

export const getNearbyDestinations = (
  locationId: string
): TripDestination[] => {
  const currentLocation = tripData.destinations.find(
    (dest) => dest.id === locationId
  );

  if (!currentLocation) return [];

  return tripData.destinations.filter((dest) => dest.id !== locationId);
};

export const calculateTripDistance = (
  selectedDestinations: TripDestination[]
): number => {
  return selectedDestinations.reduce(
    (total, dest) => total + (dest.distanceNM || 0),
    0
  );
};

export const calculateTripDuration = (
  selectedDestinations: TripDestination[]
): number => {
  return selectedDestinations.reduce(
    (total, dest) => total + Math.ceil((dest.sailingHours || 0) / 24),
    0
  );
};
