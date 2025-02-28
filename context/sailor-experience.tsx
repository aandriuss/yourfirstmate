import { createContext, useContext, useState } from 'react';

// Define the interface for sailor experience data
interface SailorExperienceData {
  years: string;
  waterType: string[]; // Ensure these are arrays
  milesSailed: string;
  avgPassage: string;
  boatSizes: string[]; // Ensure these are arrays
  boatTypes: string[]; // Ensure these are arrays
  soloSailing: string[];
  sailingCourses: string;
  certifications: string[]; // Ensure these are arrays
}

// Create the context
const SailorExperienceContext = createContext<{
  sailorExperience: SailorExperienceData | null;
  setSailorExperience: (data: SailorExperienceData) => void;
}>({
  sailorExperience: null,
  setSailorExperience: () => {}
});

// Define a provider component
export const SailorExperienceProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [sailorExperience, setSailorExperience] =
    useState<SailorExperienceData | null>(null);

  const updateSailorExperience = (data: SailorExperienceData) => {
    setSailorExperience(data);
    // Save to localStorage or any other storage mechanism (optional)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sailorExperience', JSON.stringify(data));
    }
  };

  return (
    <SailorExperienceContext.Provider
      value={{ sailorExperience, setSailorExperience: updateSailorExperience }}
    >
      {children}
    </SailorExperienceContext.Provider>
  );
};

// Custom hook to use sailor experience data
export const useSailorExperience = () => {
  const context = useContext(SailorExperienceContext);

  if (context === undefined) {
    throw new Error(
      'useSailorExperience must be used within a SailorExperienceProvider'
    );
  }

  return context;
};

// Helper function to get sailor experience data (optional)
export const getSailorExperience = (): SailorExperienceData | null => {
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem('sailorExperience');

    return savedData ? JSON.parse(savedData) : null;
  }

  return null;
};

// Helper function to set sailor experience data (optional)
export const setSailorExperience = (data: SailorExperienceData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sailorExperience', JSON.stringify(data));
  }
};
