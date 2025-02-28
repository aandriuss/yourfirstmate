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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{isUpdate ? 'Update Trip' : 'Save New Trip'}</ModalHeader>
        <ModalBody>
          <Input
            autoFocus
            label="Trip Name"
            placeholder="Enter a name for your trip"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
        </ModalBody>
        <ModalFooter>
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
