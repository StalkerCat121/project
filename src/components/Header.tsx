import React from 'react';
import { LogOut, Waves } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { currentUser, logout } = useStore();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Waves className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              Neptun
            </h1>
          </div>
          {currentUser && (
            <div className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">{currentUser.name}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({currentUser.role})
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {currentUser && (
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}