
import React from 'react';

interface ToDoItemProps {
  todo: {
    id: string;
    text: string;
    dueDate?: Date;
    priority?: 'high' | 'medium' | 'low';
    completed: boolean;
  };
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
}

const ToDoItem: React.FC<ToDoItemProps> = ({ todo, onToggle, onEdit }) => {
  const priorityColors: { [key: string]: string } = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  return (
    <li className="flex items-center justify-between py-2 border-b border-gray-200">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={`todo-${todo.id}`} className={`text-gray-700 ${todo.completed ? 'line-through' : ''}`}>
          {todo.text}
        </label>
        {todo.priority && (
          <span
            className={`ml-2 inline-block h-2 w-2 rounded-full ${priorityColors[todo.priority]}`}
            title={`Priority: ${todo.priority}`}
          ></span>
        )}
        {todo.dueDate && (
          <span className="ml-2 text-gray-500 text-sm">
            Due: {todo.dueDate.toLocaleDateString()}
          </span>
        )}
      </div>
      <div>
        <button
          onClick={() => onEdit(todo.id)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Edit
        </button>
      </div>
    </li>
  );
};

export default ToDoItem;
