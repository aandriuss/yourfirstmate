import React from 'react';

export const ComfortChip: React.FC<{ comfort: string }> = ({ comfort }) => {
  const getChipColor = (comfort: string) => {
    const level = comfort.toLowerCase();
    if (level.includes('comfortable')) return 'bg-green-100 text-green-700';
    if (level.includes('moderate')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getChipColor(comfort)}`}>
      {comfort}
    </span>
  );
}; 