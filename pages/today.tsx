
import Header from '../components/Header';
import ToDoList from '../components/ToDoList';
import Footer from '../components/Footer';
import { ToDoItemType } from '../components/ToDoItem';

const Today = () => {
  // Mock data for to-do items due today
  const today = new Date();
  const mockToDoItems: ToDoItemType[] = [
    {
      id: '1',
      text: 'Grocery Shopping',
      completed: false,
      dueDate: today.toISOString(),
    },
    {
      id: '2',
      text: 'Book Appointment',
      completed: true,
      dueDate: today.toISOString(),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Today" showBackButton={true} />
      <main className="flex-grow p-4">
        <ToDoList todos={mockToDoItems} />
      </main>
      <Footer />
    </div>
  );
};

export default Today;
