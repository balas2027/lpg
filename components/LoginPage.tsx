import React, { useState } from 'react';
import type { User, Role } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    setError('');
    onLogin({ email, role });
  };

  const buttonStyle = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const activeStyle = "bg-red-600 text-white ring-red-500";
  const inactiveStyle = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-2xl shadow-2xl ring-1 ring-white/10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-400">🔥 Chennai Leak Monitor</h1>
          <p className="mt-2 text-gray-400">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sign in as
            </label>
            <div className="flex items-center space-x-2 bg-gray-900 p-1 rounded-lg">
                <button type="button" onClick={() => setRole('USER')} className={`w-1/2 ${buttonStyle} ${role === 'USER' ? activeStyle : inactiveStyle}`}>
                User
                </button>
                <button type="button" onClick={() => setRole('ADMIN')} className={`w-1/2 ${buttonStyle} ${role === 'ADMIN' ? activeStyle : inactiveStyle}`}>
                Admin
                </button>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-transform transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};