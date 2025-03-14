import { SavedTrip } from '@/types';

// Remove the direct pg import and pool creation since we're using API routes
// import { Pool } from 'pg';
// 
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

export const saveTripsToNeon = async (userId: string, trips: SavedTrip[]): Promise<void> => {
  try {
    console.log('Saving trips to Neon:', { userId, tripCount: trips.length });
    
    const response = await fetch('/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trips }),
    });
    
    const responseData = await response.json();
    console.log('Save trips response:', responseData);
    
    if (!response.ok) {
      throw new Error(`Failed to save trips: ${response.statusText} - ${JSON.stringify(responseData)}`);
    }
  } catch (error) {
    console.error('Error saving trips to Neon:', error);
    throw error;
  }
};

export const loadTripsFromNeon = async (userId: string): Promise<SavedTrip[]> => {
  try {
    const response = await fetch(`/api/trips?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load trips: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.trips;
  } catch (error) {
    console.error('Error loading trips from Neon:', error);
    throw error;
  }
}; 