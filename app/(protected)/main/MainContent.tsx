'use client';

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TripPanel from '@/components/trip-panel';
import MapContainer from '@/components/map/MapContainer';
import { useMap } from '@/context/map-context';
import portsData from '@/mock/ports_data.json';
import mapboxgl from 'mapbox-gl';

export default function MainContent() {
  const { mapRef, isEditMode, toggleEditMode, isActive, setActive, setMapCenter } = useMap();
  const [showTripPanel, setShowTripPanel] = React.useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = React.useState(false);
  const tripPanelRef = React.useRef(null);
  
  // Create a proper ref for mapboxgl.Map to pass to TripPanel
  const mapboxMapRef = useRef<mapboxgl.Map | null>(null);
  
  // Update the mapboxMapRef whenever mapRef.current?.map changes
  useEffect(() => {
    if (mapRef.current?.map) {
      mapboxMapRef.current = mapRef.current.map;
    }
  }, [mapRef]);

  const handlePanelOpen = () => {
    if (showTripPanel && isPanelMinimized) {
      setIsPanelMinimized(false);
    } else if (!showTripPanel) {
      setShowTripPanel(true);
    }
  };

  const handlePanelClose = () => {
    setShowTripPanel(false);
    setActive(false);
    setIsPanelMinimized(false);
  };

  const handleTripStart = (coordinates: { lat: number; lon: number }) => {
    setActive(true);
    setMapCenter(coordinates);
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      {/* Map Container Component */}
      <MapContainer 
        ref={mapRef}
        isEditMode={isEditMode}
        onToggleEditMode={toggleEditMode}
        isActive={isActive}
      />

      {/* Trip Panel Button */}
      <div className="absolute bottom-24 z-10 flex w-full justify-center">
        {!isActive && (
          <Button
            variant="default"
            size="lg"
            className="gap-2 px-5"
            onClick={handlePanelOpen}
          >
            Let&apos;s go!
          </Button>
        )}
      </div>

      {/* Trip Panel Component */}
      <TripPanel
        ref={tripPanelRef}
        isEditMode={isEditMode}
        isOpen={showTripPanel && !isPanelMinimized}
        isPanelMinimized={isPanelMinimized}
        mapRef={mapboxMapRef}
        portsData={portsData}
        onClose={handlePanelClose}
        onMinimizeChange={setIsPanelMinimized}
        onTripStart={handleTripStart}
      />
    </div>
  );
}