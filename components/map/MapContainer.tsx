'use client';

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { LayersIcon } from '@/components/shared/icons';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export interface MapContainerHandle {
  map: mapboxgl.Map | null;
  setCenter: (center: [number, number]) => void;
}

interface MapContainerProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  isActive?: boolean;
}

const MapContainer = forwardRef<MapContainerHandle, MapContainerProps>(
  ({ 
    initialCenter = [21.1231, 55.7033], 
    initialZoom = 10,
    isEditMode = false,
    onToggleEditMode,
    isActive = false 
  }, ref) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    
    const [currentStyle, setCurrentStyle] = useState(
      'mapbox://styles/mapbox/outdoors-v12'
    );

    useImperativeHandle(ref, () => ({
      map: mapRef.current,
      setCenter: (center: [number, number]) => {
        if (mapRef.current) {
          mapRef.current.setCenter(center);
        }
      }
    }));

    useEffect(() => {
      if (!mapContainer.current) return;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: currentStyle,
        center: initialCenter,
        zoom: initialZoom,
        pitch: 0
      });

      map.on('load', () => {
        mapRef.current = map;
      });

      return () => map.remove();
    }, [currentStyle, initialCenter, initialZoom]);

    const toggleMapStyle = () => {
      const map = mapRef.current;
      if (!map) return;

      const newStyle =
        currentStyle === 'mapbox://styles/mapbox/outdoors-v12'
          ? 'mapbox://styles/mapbox/satellite-streets-v12'
          : 'mapbox://styles/mapbox/outdoors-v12';

      map.setStyle(newStyle);
      setCurrentStyle(newStyle);
    };

    return (
      <>
        {/* Map Container */}
        <div ref={mapContainer} className="absolute inset-0 h-full w-full" />

        {/* Map Controls */}
        <div className="absolute right-4 top-20 z-10 flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMapStyle}
            className="bg-white/60 backdrop-blur-sm dark:bg-gray-800/60"
          >
            <LayersIcon className="h-5 w-5" />
          </Button>
          
          {isActive && onToggleEditMode && (
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleEditMode}
              className={`bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 ${isEditMode ? 'ring-2 ring-primary' : ''}`}
            >
              <LayersIcon className="h-5 w-5" /> {/* Replace with appropriate edit icon */}
            </Button>
          )}
        </div>
      </>
    );
  }
);

MapContainer.displayName = 'MapContainer';

export default MapContainer;