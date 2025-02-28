'use client';

import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { MapContainerHandle } from '@/components/map/MapContainer';

interface MapContextType {
  mapRef: React.RefObject<MapContainerHandle>;
  isEditMode: boolean;
  toggleEditMode: () => void;
  isActive: boolean;
  setActive: (isActive: boolean) => void;
  setMapCenter: (coordinates: { lat: number; lon: number }) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapRef = useRef<MapContainerHandle>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const setMapCenter = (coordinates: { lat: number; lon: number }) => {
    if (mapRef.current) {
      mapRef.current.setCenter([coordinates.lon, coordinates.lat]);
    }
  };

  const setActive = (active: boolean) => {
    setIsActive(active);
  };

  return (
    <MapContext.Provider
      value={{
        mapRef,
        isEditMode,
        toggleEditMode,
        isActive,
        setActive,
        setMapCenter
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};