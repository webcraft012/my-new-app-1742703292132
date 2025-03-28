
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

const Lists = () => {
  // Mock data for lists/projects
  const lists = [
    { id: 1, title: 'Grocery List' },
    { id: 2, title: 'Work Projects' },
    { id: 3, title: 'Home Improvement' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Lists" backButton={true} addListButton={true} />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">My Lists/Projects</h1>
        <ul>
          {lists.map((list) => (
            <li key={list.id} className="mb-2">
              <Link href={`/list/${list.id}`} className="text-blue-500 hover:underline">
                {list.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export default Lists;
