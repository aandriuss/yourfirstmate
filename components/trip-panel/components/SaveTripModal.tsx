import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from '@nextui-org/react';

interface SaveTripModalProps {
  isOpen: boolean;
  isUpdate: boolean;
  initialName?: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const SaveTripModal: React.FC<SaveTripModalProps> = ({
  isOpen,
  isUpdate,
  initialName = '',
  onClose,
  onSave
}) => {
  const [tripName, setTripName] = useState('');

  useEffect(() => {
    // Only set initialName if this is an update of an existing trip
    if (isOpen) {
      setTripName(isUpdate ? initialName : '');
    }
  }, [isOpen, initialName, isUpdate]);

  const handleSave = () => {
    if (tripName.trim()) {
      onSave(tripName.trim());
      onClose();
      setTripName(''); // Reset the input after saving
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur"
      onClick={(e) => {
        // Only close if clicked directly on the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="min-w-96 max-w-md rounded-lg bg-background shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b px-6 pb-4 pt-6 text-lg font-medium">
          {isUpdate ? 'Update Trip' : 'Save New Trip'}
        </div>
        <div className="p-6">
          <Input
            autoFocus
            label="Trip Name"
            placeholder="Enter a name for your trip"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            variant="flat"
            labelPlacement="outside"
            size="lg"
            classNames={{
              base: "max-w-full",
              mainWrapper: "h-auto",
              input: "text-base pt-2 h-10",
              label: "text-sm font-medium pb-10",
              inputWrapper: "border border-default-200 bg-default-100/50 min-h-unit-10 h-auto pt-0"
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              // Prevent ESC key from bubbling up
              if (e.key === 'Escape') {
                onClose();
                e.stopPropagation();
              }
            }}
          />
        </div>
        <div className="flex justify-end gap-2 border-t px-6 pb-6 pt-4">
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={!tripName.trim()}
            onPress={handleSave}
          >
            {isUpdate ? 'Update' : 'Save Trip'}
          </Button>
        </div>
      </div>
    </div>
  );
};
