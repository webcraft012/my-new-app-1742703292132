
import React, { useState } from 'react';
import Header from '../components/Header';
import AddToDo from '../components/AddToDo';
import ToDoList from '../components/ToDoList';
import Footer from '../components/Footer';
import ToDoItem from '../components/ToDoItem';

const Home = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn Next.js', completed: false },
    { id: 2, text: 'Build a To-Do App', completed: false },
    { id: 3, text: 'Deploy the App', completed: true },
  ]);

  const [showCompleted, setShowCompleted] = useState(false);

  const handleAddTodo = (text: string) => {
    const newTodo = {
      id: todos.length + 1,
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="My To-Do List" />
      <main className="container mx-auto py-4 flex-grow">
        <AddToDo onAdd={handleAddTodo} />
        <ToDoList
          todos={activeTodos}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTodo}
        />

        <div className="mt-4">
          <button
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </button>

          {showCompleted && completedTodos.length > 0 && (
            <div className="mt-2">
              <h2 className="text-lg font-semibold">Completed Tasks</h2>
              <ul>
                {completedTodos.map((todo) => (
                  <ToDoItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
