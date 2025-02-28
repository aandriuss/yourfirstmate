import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY // Ensure this is set in your environment
});

/**
 * Generates a sailing trip plan using the OpenAI API.
 * @param location - The port selected by the user.
 * @param localtime - The local time at the location.
 * @returns A promise that resolves to the trip plan.
 */

export const config = {
  maxDuration: 60
};

const DEFAULT_SYSTEM_PROMPT = `
        You are a sailboat expert.
        Your main objective is to provide a detailed 6-day sailing round trip plan for a user. 
        The user provides you with sailingData, including their current location, boat information, and sailing experience.
        Your task is to generate a plan that includes:
        - A nearby port to travel to each day
        - Coordinates for each port. Double check the coordinates are correct for the port name.
        - Distance between ports in Nautical Miles
        - Duration of each trip in hours and minutes (00:00)
        - Comfort level based on weather and sailor experience (comfortable, moderate, challenging)
        - Safety considerations based on weather and sailor experience
        
        The first and last port should be the same port. 
        Day zero has predefined values for destination and day.
        "destination": "starting port name from prompt <name>"
        "day": "Starting Port", (always fixed)
        Provide tips for the user to prepare for the trip as "safety" value for that day.

        Then provide the rest of the plan for the next 6 days based on weekPlan.
        The one day distance should be not more than 28 nautical miles.
        Additionally, provide a list of ports from that region not further than 50NM. Make it a separate object in reply, call it "extendedPorts".`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { location, localtime, customPrompt } = req.body;

    const messages: { role: 'system' | 'user'; content: string }[] = [
      {
        role: 'system',
        content: `${customPrompt || DEFAULT_SYSTEM_PROMPT}
        Please return the output as a JSON object without any additional text or formatting symbols. The JSON should follow this structure:
        
        {
          "weekPlan": [
            {
              "day": "Day 1",
              "destination": "Port Name",
              "coordinates": { "lat": 0.0, "lon": 0.0 },
              "distanceNM": 0.0,
              "duration": "00:00",
              "comfortLevel": "Comfort Level",
              "safety": "Safety Description"
            },
            ...
          ],
          "extendedPorts": [
            {
              "name": "Port Name",
              "coordinates": { "lat": 0.0, "lon": 0.0 }
            },
            ...
          ]
        }
        `
      },
      {
        role: 'user',
        content: `
<sailingData>
  <location>
    <name>${location.port}</name>
    <lat>${location.coordinates.lat}</lat>
    <lon>${location.coordinates.lon}</lon>
    <localtime>${localtime}</localtime>
  </location>
  <boatInfo>
    <boatType>Cruising Yacht</boatType>
    <length>12.5</length>
    <width>4.2</width>
    <waterlineDepth>1.8</waterlineDepth>
    <mastHeight>16.0</mastHeight>
    <displacement>8500</displacement>
    <keelType>Fin keel</keelType>
    <sailArea>75</sailArea>
    <enginePower>25</enginePower>
    <fuelCapacity>200</fuelCapacity>
    <rudderType>Skeg-hung</rudderType>
    <crewSize>6</crewSize>
    <hullMaterial>Fiberglass</hullMaterial>
  </boatInfo>
  <experience>
    <yearsOfExperience>7</yearsOfExperience>
    <experienceLevel>Intermediate</experienceLevel>
    <typeOfWaterSailed>
      <waterType>Coastal</waterType>
      <waterType>Inland Waters</waterType>
    </typeOfWaterSailed>
    <typesOfBoatsSailed>
      <boatType>Monohull</boatType>
      <boatType>Dinghy</boatType>
    </typesOfBoatsSailed>
    <certifications>
      <certification>ASA 101 Basic Keelboat Sailing</certification>
      <certification>ASA 103 Coastal Navigation</certification>
    </certifications>
    <totalMilesSailed>2500</totalMilesSailed>
    <soloSailingExperience>No</soloSailingExperience>
    <sailingCoursesTraining>
      <course>Coastal Cruising</course>
      <course>Advanced Seamanship</course>
    </sailingCoursesTraining>
  </experience>
</sailingData>
        `
      }
    ];

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
        temperature: 1,
        max_tokens: 8000
      });

      res.status(200).json({ content: response.choices[0].message.content });
    } catch (error) {
      console.error('Error generating sailing plan:', error);
      res.status(500).json({ error: 'Failed to generate sailing plan' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
