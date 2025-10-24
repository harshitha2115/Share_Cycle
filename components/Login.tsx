import React, { useState } from 'react';
import { User } from '../types';

// Mock user database
const users: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@sharecycle.com', role: 'admin' },
  { id: 'u2', name: 'Regular User', email: 'user@sharecycle.com', role: 'user' },
];

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email);

    // In a real app, you would also check the password against a hash
    if (user) {
      setError('');
      onLogin(user);
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-4xl font-bold text-primary-dark text-center">
            Share<span className="text-neutral-700">Cycle</span>
        </h1>
        <p className="text-center text-neutral-600 mt-2 mb-8">Welcome back! Please sign in to continue.</p>
      </div>

      <div className="max-w-sm w-full bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
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
                onChange={e => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-neutral-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:text-sm"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-DEFAULT transition-transform transform hover:scale-105"
            >
              Sign in
            </button>
          </div>
        </form>
         <div className="mt-6 text-sm text-center text-neutral-500">
            <p className="font-semibold">Demo Accounts:</p>
            <p>Admin: <span className="font-mono">admin@sharecycle.com</span></p>
            <p>User: <span className="font-mono">user@sharecycle.com</span></p>
            <p>(Any password will work)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;