
import React from 'react';
import ToDoItem from './ToDoItem';

interface ToDo {
  id: string;
  text: string;
  dueDate?: Date;
  priority?: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface ToDoListProps {
  todos: ToDo[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
}

const ToDoList: React.FC<ToDoListProps> = ({ todos, onToggle, onEdit }) => {
  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <ToDoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};

export default ToDoList;
