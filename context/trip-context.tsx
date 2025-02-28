'use client'
import React, { createContext, useContext, useState } from 'react';

interface TripContextType {
  currentDestination: string | null;
  setCurrentDestination: (destination: string | null) => void;
  clearDestination: () => void;
}

const TripContext = createContext<TripContextType>({
  currentDestination: null,
  setCurrentDestination: () => {},
  clearDestination: () => {}
});

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentDestination, setCurrentDestination] = useState<string | null>(
    null
  );

  const clearDestination = () => setCurrentDestination(null);

  return (
    <TripContext.Provider
      value={{ currentDestination, setCurrentDestination, clearDestination }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
