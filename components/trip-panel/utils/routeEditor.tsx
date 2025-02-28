import mapboxgl from 'mapbox-gl';

import { calculateDistance, calculateDuration } from './distanceUtils';

import { SailingDestination } from '@/types';

interface RouteEditorOptions {
  map: mapboxgl.Map;
  onRouteUpdate: (destinations: SailingDestination[]) => void;
}

export class RouteEditor {
  private map: mapboxgl.Map;
  private onRouteUpdate: (destinations: SailingDestination[]) => void;
  private destinations: SailingDestination[] = [];
  private isEditing = false;
  private draggedPointId: string | null = null;
  private dragStartLngLat: mapboxgl.LngLat | null = null;
  private eventHandlers: { [key: string]: any } = {};

  constructor({ map, onRouteUpdate }: RouteEditorOptions) {
    this.map = map;
    this.onRouteUpdate = onRouteUpdate;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.map) return;

    console.log('Setting up RouteEditor event listeners');

    // Route line click handling
    this.eventHandlers.routeClick = this.handleRouteClick.bind(this);
    this.map.on('click', 'route-line', this.eventHandlers.routeClick);

    // Mouse cursor updates for route line
    this.eventHandlers.routeMouseEnter = () => {
      if (!this.isEditing && this.map) {
        this.map.getCanvas().style.cursor = 'pointer';
      }
    };
    this.map.on('mouseenter', 'route-line', this.eventHandlers.routeMouseEnter);

    this.eventHandlers.routeMouseLeave = () => {
      if (!this.isEditing && this.map) {
        this.map.getCanvas().style.cursor = '';
      }
    };
    this.map.on('mouseleave', 'route-line', this.eventHandlers.routeMouseLeave);

    // Point dragging
    this.eventHandlers.pointMouseDown = this.handlePointMouseDown.bind(this);
    this.map.on(
      'mousedown',
      'intermediate-points',
      this.eventHandlers.pointMouseDown
    );

    // Mouse cursor updates for points
    this.eventHandlers.pointMouseEnter = () => {
      if (!this.isEditing && this.map) {
        this.map.getCanvas().style.cursor = 'move';
      }
    };
    this.map.on(
      'mouseenter',
      'intermediate-points',
      this.eventHandlers.pointMouseEnter
    );

    this.eventHandlers.pointMouseLeave = () => {
      if (!this.isEditing && this.map) {
        this.map.getCanvas().style.cursor = '';
      }
    };
    this.map.on(
      'mouseleave',
      'intermediate-points',
      this.eventHandlers.pointMouseLeave
    );

    // Clean up events when dragging ends
    this.eventHandlers.mouseUp = this.handleMouseUp.bind(this);
    this.eventHandlers.mouseMove = this.handleMouseMove.bind(this);

    this.map.on('mouseup', this.eventHandlers.mouseUp);
    this.map.on('mousemove', this.eventHandlers.mouseMove);
  }

  private handleRouteClick = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    }
  ) => {
    if (!this.map || !e.lngLat || this.isEditing) {
      console.log('Click ignored - editing in progress or no coordinates');

      return;
    }

    // Prevent event from propagating to the map
    e.originalEvent?.preventDefault();
    e.originalEvent?.stopPropagation();

    this.addNewPoint(e.lngLat);
  };

  private handlePointMouseDown = (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    }
  ) => {
    if (!e.features?.[0]) return;

    // Prevent map panning while dragging points
    e.originalEvent?.preventDefault();
    e.originalEvent?.stopPropagation();

    const feature = e.features[0];

    if (!feature.id) return;

    this.draggedPointId = feature.id.toString();
    this.dragStartLngLat = e.lngLat;
    this.isEditing = true;

    // Disable map panning during drag
    this.map.dragPan.disable();
    this.map.getCanvas().style.cursor = 'grabbing';

    // Set hover state
    this.map.setFeatureState(
      { source: 'points', id: feature.id },
      { hover: true }
    );
  };

  private handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
    if (!this.draggedPointId || !this.dragStartLngLat) return;

    const pointIndex = this.destinations.findIndex(
      (d) => d.day === this.draggedPointId
    );

    if (pointIndex === -1) return;

    const newDestinations = [...this.destinations];

    // Update dragged point coordinates
    newDestinations[pointIndex] = {
      ...newDestinations[pointIndex],
      coordinates: {
        lat: e.lngLat.lat,
        lon: e.lngLat.lng
      }
    };

    // Recalculate distances for affected segments
    if (pointIndex > 0) {
      const prev = newDestinations[pointIndex - 1];
      const curr = newDestinations[pointIndex];
      const distance = calculateDistance(
        prev.coordinates.lat,
        prev.coordinates.lon,
        curr.coordinates.lat,
        curr.coordinates.lon
      );

      curr.distanceNM = Math.round(distance * 10) / 10;
      curr.duration = calculateDuration(distance);
    }

    if (pointIndex < newDestinations.length - 1) {
      const curr = newDestinations[pointIndex];
      const next = newDestinations[pointIndex + 1];
      const distance = calculateDistance(
        curr.coordinates.lat,
        curr.coordinates.lon,
        next.coordinates.lat,
        next.coordinates.lon
      );

      next.distanceNM = Math.round(distance * 10) / 10;
      next.duration = calculateDuration(distance);
    }

    this.destinations = newDestinations;
    this.onRouteUpdate(newDestinations);
  };

  private handleMouseUp = () => {
    if (!this.draggedPointId) return;

    // Reset hover state
    this.map.setFeatureState(
      { source: 'points', id: this.draggedPointId },
      { hover: false }
    );

    // Re-enable map panning and reset cursor
    this.map.dragPan.enable();
    this.map.getCanvas().style.cursor = '';

    this.draggedPointId = null;
    this.dragStartLngLat = null;
    this.isEditing = false;
  };

  private addNewPoint(lngLat: mapboxgl.LngLat) {
    const insertIndex = this.findClosestSegment(lngLat);

    if (insertIndex === -1) return;

    const newDestination: SailingDestination = {
      day: new Date(Date.now()).toISOString().split('T')[0],
      coordinates: {
        lat: lngLat.lat,
        lon: lngLat.lng
      },
      destination: `Waypoint ${this.destinations.length + 1}`,
      distanceNM: 0,
      duration: '',
      comfortLevel: 'moderate',
      safety: 'Added waypoint'
    };

    const newDestinations = [
      ...this.destinations.slice(0, insertIndex),
      newDestination,
      ...this.destinations.slice(insertIndex)
    ];

    // Update days and recalculate distances
    this.updateDestinationDaysAndDistances(newDestinations);
  }

  private findClosestSegment(point: mapboxgl.LngLat): number {
    if (this.destinations.length < 2) return -1;

    let minDistance = Infinity;
    let insertIndex = -1;

    for (let i = 0; i < this.destinations.length - 1; i++) {
      const start = this.destinations[i];
      const end = this.destinations[i + 1];

      const distToSegment = this.pointToLineDistance(
        point,
        start.coordinates,
        end.coordinates
      );

      if (distToSegment < minDistance) {
        minDistance = distToSegment;
        insertIndex = i + 1;
      }
    }

    return insertIndex;
  }

  private pointToLineDistance(
    point: mapboxgl.LngLat,
    start: { lat: number; lon: number },
    end: { lat: number; lon: number }
  ): number {
    const x = point.lng;
    const y = point.lat;
    const x1 = start.lon;
    const y1 = start.lat;
    const x2 = end.lon;
    const y2 = end.lat;

    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }

  private updateDestinationDaysAndDistances(
    destinations: SailingDestination[]
  ) {
    const updatedDestinations = destinations.map((dest, index) => ({
      ...dest,
      day: new Date(Date.now() + index * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
    }));

    for (let i = 1; i < updatedDestinations.length; i++) {
      const prev = updatedDestinations[i - 1];
      const curr = updatedDestinations[i];
      const distance = calculateDistance(
        prev.coordinates.lat,
        prev.coordinates.lon,
        curr.coordinates.lat,
        curr.coordinates.lon
      );

      curr.distanceNM = Math.round(distance * 10) / 10;
      curr.duration = calculateDuration(distance);
    }

    this.destinations = updatedDestinations;
    this.onRouteUpdate(updatedDestinations);
  }

  public cleanup() {
    if (!this.map) return;

    try {
      // Remove all event listeners
      Object.entries(this.eventHandlers).forEach(([key, handler]) => {
        if (key.includes('route')) {
          this.map.off('click', 'route-line', handler);
          this.map.off('mouseenter', 'route-line', handler);
          this.map.off('mouseleave', 'route-line', handler);
        } else if (key.includes('point')) {
          this.map.off('mousedown', 'intermediate-points', handler);
          this.map.off('mouseenter', 'intermediate-points', handler);
          this.map.off('mouseleave', 'intermediate-points', handler);
        } else {
          this.map.off(key.toLowerCase(), handler);
        }
      });

      // Reset hover states if necessary
      if (this.draggedPointId) {
        this.map.setFeatureState(
          { source: 'points', id: this.draggedPointId },
          { hover: false }
        );
      }

      // Reset state
      this.draggedPointId = null;
      this.dragStartLngLat = null;
      this.isEditing = false;

      // Re-enable map interactions
      if (this.map.dragPan) {
        this.map.dragPan.enable();
      }

      // Reset cursor
      const canvas = this.map.getCanvas();

      if (canvas) {
        canvas.style.cursor = '';
      }
    } catch (error) {
      console.warn('Error during RouteEditor cleanup:', error);
    }
  }

  public setDestinations(destinations: SailingDestination[]) {
    this.destinations = [...destinations];
  }
}
