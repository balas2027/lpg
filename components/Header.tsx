import React from 'react';
import type { User } from '../App';

interface HeaderProps {
    user: User;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="w-full bg-gray-800/80 backdrop-blur-sm p-4 shadow-lg z-20 border-b border-gray-700 flex justify-between items-center">
      <h1 className="text-lg sm:text-2xl font-bold text-red-400 tracking-wider">
        🔥 Chennai Leak Monitor
      </h1>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="text-right">
            <p className="text-sm font-medium text-white hidden sm:block">{user.email}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-red-400">{user.role}</p>
        </div>
        <button 
            onClick={onLogout} 
            className="px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </header>
  );
};