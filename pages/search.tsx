
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ToDoList from '../components/ToDoList';
import Footer from '../components/Footer';
import { ToDoItemType } from '../components/ToDoItem';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ToDoItemType[]>([]);

  // Mock to-do items data
  const mockToDoItems: ToDoItemType[] = [
    { id: '1', text: 'Buy groceries', completed: false },
    { id: '2', text: 'Walk the dog', completed: true },
    { id: '3', text: 'Finish homework', completed: false },
    { id: '4', text: 'Grocery Shopping', completed: false },
  ];

  useEffect(() => {
    // Filter to-do items based on search query
    const filteredResults = mockToDoItems.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Search Results" showBackButton onSearch={handleSearch} />
      <main className="flex-grow p-4">
        {searchResults.length > 0 ? (
          <ToDoList todos={searchResults} />
        ) : (
          <p>No results found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Search;
