import mapboxgl from 'mapbox-gl';

import { SailingDestination } from '@/types';

const MAP_LAYERS = {
  ROUTE: 'route-line',
  POINTS_LABEL: 'points-label',
  START_POINT: 'start-point',
  START_POINT_STEM: 'start-point-stem',
  END_POINT: 'end-point',
  END_POINT_STEM: 'end-point-stem',
  INTERMEDIATE_POINTS: 'intermediate-points'
} as const;

const MAP_SOURCES = {
  ROUTE: 'route',
  POINTS: 'points'
} as const;

const ensureMapReady = (map: mapboxgl.Map): Promise<void> => {
  return new Promise((resolve) => {
    const checkLoaded = () => {
      if (map.loaded() && map.isStyleLoaded()) {
        map.off('load', checkLoaded);
        map.off('style.load', checkLoaded);
        map.off('styledata', checkLoaded);
        setTimeout(() => resolve(), 100);
      }
    };

    if (map.loaded() && map.isStyleLoaded()) {
      setTimeout(() => resolve(), 100);

      return;
    }

    map.on('load', checkLoaded);
    map.on('style.load', checkLoaded);
    map.on('styledata', checkLoaded);
  });
};

export const clearMapLayers = async (map: mapboxgl.Map | null) => {
  if (!map) return;
  await ensureMapReady(map);

  Object.values(MAP_LAYERS).forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });

  Object.values(MAP_SOURCES).forEach((sourceId) => {
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  });
};

const createRouteData = (destinations: SailingDestination[]) => ({
  type: 'Feature' as const,
  properties: {},
  geometry: {
    type: 'LineString' as const,
    coordinates: destinations.map((dest) => [
      dest.coordinates.lon,
      dest.coordinates.lat
    ])
  }
});

const createPointsData = (destinations: SailingDestination[]) => ({
  type: 'FeatureCollection' as const,
  features: destinations.map((dest, index) => ({
    type: 'Feature' as const,
    id: dest.day, // Use day as unique identifier
    properties: {
      title: dest.destination,
      description: `Day ${index + 1}: ${dest.safety}`,
      pointType:
        index === 0
          ? 'start'
          : index === destinations.length - 1
            ? 'end'
            : 'intermediate'
    },
    geometry: {
      type: 'Point' as const,
      coordinates: [dest.coordinates.lon, dest.coordinates.lat]
    }
  }))
});

const addVisualizationLayers = (
  map: mapboxgl.Map,
  destinations: SailingDestination[]
) => {
  // Add route source and layer
  map.addSource(MAP_SOURCES.ROUTE, {
    type: 'geojson',
    data: createRouteData(destinations)
  });

  map.addLayer({
    id: MAP_LAYERS.ROUTE,
    type: 'line',
    source: MAP_SOURCES.ROUTE,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible'
    },
    paint: {
      'line-color': '#0066ff',
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        8, // width when hovered
        5 // default width
      ],
      'line-opacity': 0.8
    }
  });

  // Ensure route line is above base layers
  map.moveLayer(MAP_LAYERS.ROUTE);

  // Add points source
  map.addSource(MAP_SOURCES.POINTS, {
    type: 'geojson',
    data: createPointsData(destinations)
  });

  // Add intermediate points with improved interactivity
  map.addLayer({
    id: MAP_LAYERS.INTERMEDIATE_POINTS,
    type: 'circle',
    source: MAP_SOURCES.POINTS,
    filter: ['==', ['get', 'pointType'], 'intermediate'],
    paint: {
      'circle-radius': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        10, // radius when hovered
        8 // default radius
      ],
      'circle-color': '#0066ff',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  });

  // Setup end points
  map.addLayer({
    id: MAP_LAYERS.END_POINT,
    type: 'circle',
    source: MAP_SOURCES.POINTS,
    filter: ['==', ['get', 'pointType'], 'end'],
    paint: {
      'circle-radius': 12,
      'circle-color': '#ff0000',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-translate': [0, -6],
      'circle-pitch-alignment': 'viewport'
    }
  });

  map.addLayer({
    id: MAP_LAYERS.END_POINT_STEM,
    type: 'symbol',
    source: MAP_SOURCES.POINTS,
    filter: ['==', ['get', 'pointType'], 'end'],
    layout: {
      'text-field': '▼',
      'text-size': 14,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-offset': [0, 0.6]
    },
    paint: {
      'text-color': '#ff0000'
    }
  });

  // Setup start points
  map.addLayer({
    id: MAP_LAYERS.START_POINT,
    type: 'circle',
    source: MAP_SOURCES.POINTS,
    filter: ['==', ['get', 'pointType'], 'start'],
    paint: {
      'circle-radius': 12,
      'circle-color': '#00ff00',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-translate': [0, -6],
      'circle-pitch-alignment': 'viewport'
    }
  });

  map.addLayer({
    id: MAP_LAYERS.START_POINT_STEM,
    type: 'symbol',
    source: MAP_SOURCES.POINTS,
    filter: ['==', ['get', 'pointType'], 'start'],
    layout: {
      'text-field': '▼',
      'text-size': 14,
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-offset': [0, 0.6]
    },
    paint: {
      'text-color': '#00ff00'
    }
  });

  map.addLayer({
    id: MAP_LAYERS.POINTS_LABEL,
    type: 'symbol',
    source: MAP_SOURCES.POINTS,
    layout: {
      'text-field': ['get', 'title'],
      'text-anchor': 'top',
      'text-offset': [0, 1.5],
      'text-size': 12
    },
    paint: {
      'text-color': '#000000',
      'text-halo-color': '#ffffff',
      'text-halo-width': 2
    }
  });

  // Set up interactivity event handlers
  setupInteractivity(map);
};

const setupInteractivity = (map: mapboxgl.Map) => {
  // Route line interactions
  map.on('mouseenter', MAP_LAYERS.ROUTE, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', MAP_LAYERS.ROUTE, () => {
    map.getCanvas().style.cursor = '';
  });

  // Intermediate points interactions
  map.on('mouseenter', MAP_LAYERS.INTERMEDIATE_POINTS, (e) => {
    map.getCanvas().style.cursor = 'move';
    const feature = e.features?.[0];

    if (feature?.id) {
      map.setFeatureState(
        {
          source: MAP_SOURCES.POINTS,
          id:
            typeof feature.id === 'string' ? feature.id : feature.id.toString()
        },
        { hover: true }
      );
    }
  });

  map.on('mouseleave', MAP_LAYERS.INTERMEDIATE_POINTS, (e) => {
    map.getCanvas().style.cursor = '';
    const feature = e.features?.[0];

    if (feature?.id) {
      map.setFeatureState(
        {
          source: MAP_SOURCES.POINTS,
          id:
            typeof feature.id === 'string' ? feature.id : feature.id.toString()
        },
        { hover: false }
      );
    }
  });
};

export const visualizeRoute = async (
  map: mapboxgl.Map | null,
  destinations: SailingDestination[]
): Promise<void> => {
  if (!map || destinations.length === 0) return;

  try {
    await ensureMapReady(map);
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        await clearMapLayers(map);
        if (!map.isStyleLoaded()) {
          throw new Error('Map style not loaded');
        }
        addVisualizationLayers(map, destinations);

        // Verify all layers were added successfully
        const allLayersPresent = Object.values(MAP_LAYERS).every((layerId) =>
          map.getLayer(layerId)
        );

        if (!allLayersPresent) {
          throw new Error('Not all layers were added');
        }

        break; // If we get here, everything worked
      } catch (e) {
        console.log(
          `Visualization attempt ${retryCount + 1} of ${maxRetries} failed:`,
          e
        );
        retryCount++;
        if (retryCount === maxRetries) throw e;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    const bounds = new mapboxgl.LngLatBounds();

    destinations.forEach((dest) => {
      bounds.extend([dest.coordinates.lon, dest.coordinates.lat]);
    });

    map.fitBounds(bounds, {
      padding: {
        top: 114,
        bottom: 50,
        left: 450,
        right: 50
      },
      duration: 1000,
      maxZoom: 12
    });
    const layersVerification = Object.values(MAP_LAYERS).every((layer) =>
      map.getLayer(layer)
    );

    if (!layersVerification) {
      console.log('Final verification failed, retrying visualization');
      await new Promise((resolve) => setTimeout(resolve, 200));

      return visualizeRoute(map, destinations);
    }
  } catch (error) {
    console.error('Error visualizing route:', error);
    // On critical failure, try one more time after a longer delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      await clearMapLayers(map);
      addVisualizationLayers(map, destinations);
    } catch (retryError) {
      console.error('Final retry failed:', retryError);
    }
  }
};

export const updateRouteVisualization = async (
  map: mapboxgl.Map | null,
  destinations: SailingDestination[]
) => {
  if (!map || destinations.length === 0) return;

  try {
    await ensureMapReady(map);

    const routeSource = map.getSource(
      MAP_SOURCES.ROUTE
    ) as mapboxgl.GeoJSONSource;
    const pointsSource = map.getSource(
      MAP_SOURCES.POINTS
    ) as mapboxgl.GeoJSONSource;

    if (routeSource && pointsSource) {
      routeSource.setData(createRouteData(destinations));
      pointsSource.setData(createPointsData(destinations));

      const bounds = new mapboxgl.LngLatBounds();

      destinations.forEach((dest) => {
        bounds.extend([dest.coordinates.lon, dest.coordinates.lat]);
      });

      map.fitBounds(bounds, {
        padding: {
          top: 114,
          bottom: 50,
          left: 450,
          right: 50
        },
        duration: 1000,
        maxZoom: 12
      });
    } else {
      await visualizeRoute(map, destinations);
    }
  } catch (error) {
    console.error('Error updating route visualization:', error);
  }
};
