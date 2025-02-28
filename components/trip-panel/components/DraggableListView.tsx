import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="destinations">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {destinations.map((destination, index) => (
              <Draggable
                key={destination.day}
                draggableId={destination.day}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="border-divider bg-content1 flex items-center justify-between rounded-lg border p-3 shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-gray-500">{index + 1}</div>
                      <div>
                        <div className="font-medium">
                          {destination.destination}
                        </div>
                        <div className="text-sm text-gray-500">
                          {destination.distanceNM} nm ({destination.duration})
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => onRemove(destination.day)}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableListView;
