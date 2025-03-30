import { Button } from "@/components/ui/button";
import AddCardModal from "@/components/AddCardModal";
import EditCardModal from "@/components/EditCardModal";
import { Card as CardType } from "@/types/card";
import { useState } from "react";

interface Card extends CardType {}

const initialCards: Card[] = [
  { id: "1", title: "Example Card 1", status: "To Do" },
  { id: "2", title: "Example Card 2", status: "In Progress" },
  { id: "3", title: "Example Card 3", status: "Done" },
];

const KanbanBoard = () => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);
  const [editCardModalOpen, setEditCardModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);

  const handleAddCard = (newCard: Card) => {
    setCards([...cards, newCard]);
    setAddCardModalOpen(false);
  };

  const handleEditCard = (updatedCard: Card) => {
    setCards(
      cards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
    setEditCardModalOpen(false);
  };

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const openEditModal = (card: Card) => {
    setCardToEdit(card);
    setEditCardModalOpen(true);
  };

  const cardsByStatus = (status: string) =>
    cards.filter((card) => card.status === status);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* To Do Column */}
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-semibold mb-2">To Do</h2>
        {cardsByStatus("To Do").map((card) => (
          <div
            key={card.id}
            className="bg-white rounded shadow p-2 mb-2 cursor-pointer"
            onClick={() => openEditModal(card)}
          >
            {card.title}
          </div>
        ))}
        <Button onClick={() => setAddCardModalOpen(true)}>Add Card</Button>
      </div>

      {/* In Progress Column */}
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-semibold mb-2">In Progress</h2>
        {cardsByStatus("In Progress").map((card) => (
          <div
            key={card.id}
            className="bg-white rounded shadow p-2 mb-2 cursor-pointer"
            onClick={() => openEditModal(card)}
          >
            {card.title}
          </div>
        ))}
      </div>

      {/* Done Column */}
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-semibold mb-2">Done</h2>
        {cardsByStatus("Done").map((card) => (
          <div
            key={card.id}
            className="bg-white rounded shadow p-2 mb-2 cursor-pointer"
            onClick={() => openEditModal(card)}
          >
            {card.title}
          </div>
        ))}
      </div>

      <AddCardModal
        open={addCardModalOpen}
        onClose={() => setAddCardModalOpen(false)}
        onAdd={handleAddCard}
      />
      <EditCardModal
        open={editCardModalOpen}
        onClose={() => setEditCardModalOpen(false)}
        card={cardToEdit}
        onEdit={handleEditCard}
        onDelete={handleDeleteCard}
      />
    </div>
  );
};

export default KanbanBoard;