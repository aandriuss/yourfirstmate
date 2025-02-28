import { Destination } from '@/types/types';

export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Klaipeda',
    distance: 12,
    comfortLevel: 'High',
    time: '6h',
    coordinates: { lat: 55.7033, lon: 21.1443 }
  },
  {
    id: '2',
    name: 'Juodkrante',
    distance: 8,
    comfortLevel: 'High',
    time: '5h',
    coordinates: { lat: 55.5333, lon: 21.1167 }
  },
  {
    id: '3',
    name: 'Nida',
    distance: 10,
    comfortLevel: 'Medium',
    time: '3h',
    coordinates: { lat: 55.3039, lon: 21.0056 }
  },
  {
    id: '4',
    name: 'Preila',
    distance: 4,
    comfortLevel: 'Medium',
    time: '2h',
    coordinates: { lat: 55.3667, lon: 21.0667 }
  },
  {
    id: '5',
    name: 'Pervalka',
    distance: 5,
    comfortLevel: 'Medium',
    time: '2h',
    coordinates: { lat: 55.4167, lon: 21.0833 }
  },
  {
    id: '6',
    name: 'Liepaja',
    distance: 45,
    comfortLevel: 'Low',
    time: '8h',
    coordinates: { lat: 56.5047, lon: 21.0108 }
  },
  {
    id: '7',
    name: 'Negyvos Kopos',
    distance: 6,
    comfortLevel: 'High',
    time: '3h',
    coordinates: { lat: 55.2667, lon: 21.0167 }
  },
  {
    id: '8',
    name: 'Gdansk',
    distance: 60,
    comfortLevel: 'High',
    time: '10h',
    coordinates: { lat: 54.3521, lon: 18.6466 }
  },
  {
    id: '9',
    name: 'Athens',
    distance: 150,
    comfortLevel: 'High',
    time: '20h',
    coordinates: { lat: 37.9838, lon: 23.7275 }
  }
];
