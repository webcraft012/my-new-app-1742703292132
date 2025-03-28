
import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';

interface HeaderProps {
  title: string;
  showThemeToggle?: boolean;
  showSearchIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showThemeToggle = false, showSearchIcon = false }) => {
  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-md p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4">
        {showThemeToggle && (
          <Button variant="ghost" size="icon">
            <Image src="/globe.svg" alt="Theme Toggle" width={20} height={20} />
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
        {showSearchIcon && (
          <Button variant="ghost" size="icon">
            <Image src="/search.svg" alt="Search" width={20} height={20} />
            <span className="sr-only">Search</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
