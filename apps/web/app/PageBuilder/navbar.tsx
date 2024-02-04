import { useEditor } from "@craftjs/core";
import React from "react";

export const Navbar: React.FC = () => {
  const { store } = useEditor();

  const save = (): void => {
    console.log({
      nodes: store.query.getNodes(),
    });
    localStorage.setItem("craftjs", JSON.stringify(store.query.serialize()));
  };

  return (
    <nav className="bg-white border-b border-b-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and branding */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Replace with your logo */}
              Editor
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Navigation Links */}
                <button
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => {
                    save();
                  }}
                  type="button"
                >
                  Save
                </button>
                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  href="/"
                >
                  About
                </a>
                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  href="/"
                >
                  Services
                </a>
                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  href="/"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <button
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
              type="button"
            >
              {/* Icon for menu */}
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16m-7 6h7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
