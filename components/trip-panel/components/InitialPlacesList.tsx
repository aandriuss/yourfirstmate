import React from 'react';
import {
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip
} from '@nextui-org/react';

import { Port } from '@/types';

interface InitialPlacesListProps {
  ports: Port[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelect: (port: Port) => void;
}

export const InitialPlacesList: React.FC<InitialPlacesListProps> = ({
  ports,
  searchQuery,
  onSearchChange,
  onSelect
}) => {
  const filteredPorts = ports.filter((port) =>
    port.port.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        className="mb-4"
        placeholder="Search places..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Table
        aria-label="Available destinations"
        selectionMode="single"
        onRowAction={(key) => {
          const destination = filteredPorts[Number(key)];

          if (destination) onSelect(destination);
        }}
      >
        <TableHeader>
          <TableColumn>Place</TableColumn>
          <TableColumn>Comfort Level</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredPorts.map((port, index) => (
            <TableRow key={index} className="cursor-pointer">
              <TableCell>{port.port}</TableCell>
              <TableCell>
                <Chip
                  color={
                    port.comfortScore === 'high'
                      ? 'success'
                      : port.comfortScore === 'medium'
                        ? 'warning'
                        : 'danger'
                  }
                >
                  {port.comfortScore || 'Unknown'}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
