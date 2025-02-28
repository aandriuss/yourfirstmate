import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@nextui-org/react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDontSave: () => void;
  onSave: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onDontSave,
  onSave
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Unsaved Changes</ModalHeader>
        <ModalBody>
          Would you like to save your changes before closing?
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onDontSave}>
            Don't Save
          </Button>
          <Button color="primary" onPress={onSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
