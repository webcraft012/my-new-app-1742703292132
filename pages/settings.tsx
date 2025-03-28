
import Header from '../components/Header';
import { useState } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="Settings" showBackButton={true} />
      <div className="flex-grow p-4">
        <h2 className="text-2xl font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="theme-switch" className="text-gray-700">
            Dark Mode
          </label>
          <button
            id="theme-switch"
            className={`bg-gray-200 rounded-full w-12 h-6 flex items-center transition duration-300 ease-in-out ${
              theme === 'dark' ? 'justify-end' : 'justify-start'
            }`}
            onClick={toggleTheme}
          >
            <span className="bg-white w-6 h-6 rounded-full shadow-md"></span>
          </button>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Account</h2>
        <ul className="space-y-2">
          <li>
            <a href="#" className="block p-2 rounded hover:bg-gray-100">
              Change Password
            </a>
          </li>
          <li>
            <a href="#" className="block p-2 rounded hover:bg-gray-100">
              Update Email
            </a>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data</h2>
        <ul className="space-y-2">
          <li>
            <a href="#" className="block p-2 rounded hover:bg-gray-100">
              Backup Data
            </a>
          </li>
          <li>
            <a href="#" className="block p-2 rounded hover:bg-gray-100">
              Restore Data
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
