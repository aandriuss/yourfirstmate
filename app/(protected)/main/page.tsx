'use client';

import React from 'react';
import { MapProvider } from '@/context/map-context';
import MainContent from './MainContent';

export default function MainPage() {
  return (
    <MapProvider>
      <MainContent />
    </MapProvider>
  );
}