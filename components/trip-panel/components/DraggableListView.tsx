import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Navigation, Clock, Anchor, ArrowDown, Wind, AlertTriangle, LucideIcon, Compass } from 'lucide-react';
import { ComfortChip } from './ComfortChip';
import { NotificationsList } from "@/components/ui/cards/NotificationsList";
import { NotificationCard } from "@/components/ui/cards/NotificationCard";
import { WeatherDataGrid } from "@/components/ui/data-tiles/WeatherDataGrid";
import { cn } from "@/lib/utils";

import { SailingDestination } from '@/types';

interface DraggableListViewProps {
  destinations: SailingDestination[];
  onReorder: (destinations: SailingDestination[]) => void;
  onRemove: (day: string) => void;
}

type NotificationItem = {
  icon: LucideIcon;
  title: string;
  message: string;
  variant: 'blue' | 'green' | 'red' | 'purple' | 'amber';
}

const DraggableListView: React.FC<DraggableListViewProps> = ({
  destinations,
  onReorder,
  onRemove
}) => {
  // Track expanded items
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(destinations);
    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    // Update days based on new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      day: new Date(Date.now() + index * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
    }));

    onReorder(updatedItems);
  };

  // Toggle item expansion
  const toggleExpansion = (day: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newExpandedItems = new Set(expandedItems);
    if (expandedItems.has(day)) {
      newExpandedItems.delete(day);
    } else {
      newExpandedItems.add(day);
    }
    setExpandedItems(newExpandedItems);
  };

  const getNotificationItems = (destination: SailingDestination): NotificationItem[] => {
    const items: NotificationItem[] = [
      {
        icon: Wind,
        title: "Weather Conditions",
        message: "Expected conditions: Calm seas with light winds",
        variant: "blue"
      },
      {
        icon: Compass,
        title: "AI Assessment",
        message: "Consider changing course by 15° to optimize for wind conditions",
        variant: "blue"
      },
      {
        icon: Navigation,
        title: "Navigation Update",
        message: `Distance: ${destination.distanceNM} nm, Duration: ${destination.duration}`,
        variant: "green"
      }
    ];

    if (destination.comfortLevel.toLowerCase() === 'challenging') {
      items.push({
        icon: AlertTriangle,
        title: "Safety Warning",
        message: "Challenging conditions expected. Exercise caution.",
        variant: "red"
      });
    }

    return items;
  };

  // Mock weather data - in a real app, this would come from your backend
  const getMockWeatherData = (destination: SailingDestination) => ({
    windSpeed: 6.8,
    windDirection: 45,
    temperature: 22,
    waveHeight: 1.2,
    distance: destination.distanceNM,
    course: 140,
    duration: destination.duration
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="destinations">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-0 relative"
          >
            {destinations.map((destination, index) => (
              <React.Fragment key={destination.day}>
                <Draggable draggableId={destination.day} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        "relative bg-white rounded-lg shadow-sm mb-4 cursor-pointer hover:shadow-md transition-all",
                        expandedItems.has(destination.day) && "border-2 border-transparent bg-gradient-to-r from-[#6366f1] to-[#a855f7] p-[2px]"
                      )}
                      onClick={(e) => toggleExpansion(destination.day, e)}
                    >
                      <div className={cn(
                        "h-full w-full bg-white rounded-lg",
                        expandedItems.has(destination.day) && "relative"
                      )}>
                        {/* Main content */}
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white font-medium">
                                {index + 1}
                              </div>
                              
                              <div>
                                <div className="font-medium">
                                  {destination.destination}
                                </div>
                                
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Navigation className="h-3 w-3 text-primary" />
                                    <span>{destination.distanceNM} nm</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-primary" />
                                    <span>{destination.duration}</span>
                                  </div>
                                  
                                  <ComfortChip comfort={destination.comfortLevel} />
                                </div>
                              </div>
                            </div>
                            
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent toggle expansion
                                onRemove(destination.day);
                              }}
                            >
                              ✕
                            </button>
                          </div>

                          {/* Expanded content inside the card */}
                          {expandedItems.has(destination.day) && (
                            <div className="mt-3 pt-3 border-t border-gray-100 space-y-4 pb-3">
                              {/* Description */}
                              <p className="text-sm text-gray-600">{destination.safety}</p>
                              
                              {/* Weather Data Grid */}
                              <WeatherDataGrid data={getMockWeatherData(destination)} />
                              
                              {/* Notifications */}
                              <NotificationsList 
                                notifications={getNotificationItems(destination)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
                
                {/* Connection line between destinations */}
                {index < destinations.length - 1 && (
                  <div className="relative py-1 pl-3 ml-3 border-l-2 border-dashed border-primary/30">
                    <div className="flex items-center text-xs text-gray-500">
                      <ArrowDown className="h-3 w-3 absolute -left-[7px] top-1/2 transform -translate-y-1/2 text-primary bg-white rounded-full" />
                      <div className="ml-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <span>{destinations[index].destination} → {destinations[index + 1].destination}</span>
                          <span className="text-xs text-primary">{destinations[index + 1].distanceNM} nm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableListView;