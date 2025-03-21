import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Navigation, Clock, Anchor, ArrowDown } from 'lucide-react';
import { ComfortChip } from './ComfortChip';

import { SailingDestination } from '@/types';

interface DraggableListViewProps {
  destinations: SailingDestination[];
  onReorder: (destinations: SailingDestination[]) => void;
  onRemove: (day: string) => void;
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
                      className="relative border-divider bg-content1 flex items-center justify-between rounded-lg border p-3 shadow-sm z-10 cursor-pointer hover:shadow-md"
                      onClick={(e) => toggleExpansion(destination.day, e)}
                    >
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
                  )}
                </Draggable>
                
                {/* Expanded content - only shown when expanded */}
                {expandedItems.has(destination.day) && (
                  <div className="mt-1 ml-10 mb-2 rounded-lg bg-default-50 p-3 border-l-2 border-primary/30">
                    <p className="text-sm">{destination.safety}</p>
                  </div>
                )}
                
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