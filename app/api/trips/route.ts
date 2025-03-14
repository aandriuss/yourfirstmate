import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get trips from database
    const trips = await db.trip.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    // Parse JSON data from destinations field if it's stored as a string
    const formattedTrips = trips.map(trip => ({
      ...trip,
      destinations: typeof trip.destinations === 'string' 
        ? JSON.parse(trip.destinations) 
        : trip.destinations,
    }));
    
    return NextResponse.json({ trips: formattedTrips });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log('No session or user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const body = await req.json();
    console.log('Received request body:', body);
    
    const { trips } = body;
    
    if (!trips || !Array.isArray(trips)) {
      console.log('Invalid trips data:', trips);
      return NextResponse.json({ error: 'Invalid trips data' }, { status: 400 });
    }
    
    console.log(`Deleting existing trips for user ${userId}`);
    // Delete existing trips for this user
    await db.trip.deleteMany({
      where: {
        userId: userId,
      },
    });
    
    console.log(`Creating ${trips.length} new trips`);
    // Insert new trips
    for (const trip of trips) {
      console.log(`Creating trip: ${trip.id} - ${trip.name}`);
      await db.trip.create({
        data: {
          id: trip.id,
          name: trip.name,
          userId: userId,
          createdAt: new Date(trip.createdAt),
          updatedAt: new Date(trip.updatedAt),
          // Store destinations as JSON string if your DB schema requires it
          destinations: JSON.stringify(trip.destinations || []),
        },
      });
    }
    
    console.log('All trips created successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving trips:', error);
    return NextResponse.json({ error: `Failed to save trips: ${error.message}` }, { status: 500 });
  }
} 