
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Header from '../components/Header';
import ToDoList from '../components/ToDoList';
import Footer from '../components/Footer';
import { ToDoItemType } from '../types';

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState(new Date());

  // Mock to-do items for demonstration
  const mockToDoItems: ToDoItemType[] = [
    { id: '1', text: 'Grocery Shopping', completed: false, date: new Date() },
    { id: '2', text: 'Book Appointment', completed: true, date: new Date() },
    { id: '3', text: 'Meeting with John', completed: false, date: new Date(new Date().setDate(new Date().getDate() + 1)) },
  ];

  const onChange = (newDate: Date) => {
    setDate(newDate);
  };

  const getToDoItemsForDate = (selectedDate: Date): ToDoItemType[] => {
    return mockToDoItems.filter(item => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === selectedDate.getFullYear() &&
        itemDate.getMonth() === selectedDate.getMonth() &&
        itemDate.getDate() === selectedDate.getDate()
      );
    });
  };

  const toDoItemsForSelectedDate = getToDoItemsForDate(date);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Calendar" showBackButton={true} />
      <main className="container mx-auto py-4 flex-grow">
        <div className="mb-4">
          <Calendar onChange={onChange} value={date} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">To-Do Items for {date.toLocaleDateString()}</h2>
          <ToDoList items={toDoItemsForSelectedDate} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CalendarPage;
