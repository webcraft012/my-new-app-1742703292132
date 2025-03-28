
import React, { useState } from 'react';
import { Button } from './ui/button';

interface AddToDoProps {
  onAdd: (text: string) => void;
}

const AddToDo: React.FC<AddToDoProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() !== '') {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Add a to-do..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button type="submit">Add</Button>
    </form>
  );
};

export default AddToDo;
