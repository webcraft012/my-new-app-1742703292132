import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "@/types/card";

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  onEditCard: (id: number, newTitle: string) => void;
}

export function EditCardModal({
  isOpen,
  onClose,
  card,
  onEditCard,
}: EditCardModalProps) {
  const [title, setTitle] = useState(card.title);

  const handleSave = () => {
    onEditCard(card.id, title);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Edit Card</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}