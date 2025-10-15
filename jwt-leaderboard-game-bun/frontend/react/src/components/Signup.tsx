import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface SignupProps {
  onSwitchToLogin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signup(name, email, password);
    if (success) {
      alert('Signup successful! Please login with your credentials.');
      onSwitchToLogin();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-[#1a1a1a] rounded-xl border-2 border-[#fbf0df]">
      <h2 className="text-3xl font-bold text-center mb-6 text-[#fbf0df]">Sign Up</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#fbf0df] mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 bg-transparent border-2 border-[#fbf0df]/40 rounded-lg text-[#fbf0df] focus:border-[#f3d5a3] focus:outline-none"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#fbf0df] mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-transparent border-2 border-[#fbf0df]/40 rounded-lg text-[#fbf0df] focus:border-[#f3d5a3] focus:outline-none"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#fbf0df] mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-transparent border-2 border-[#fbf0df]/40 rounded-lg text-[#fbf0df] focus:border-[#f3d5a3] focus:outline-none"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#fbf0df] text-[#1a1a1a] py-2 px-4 rounded-lg font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <span className="text-[#fbf0df]/60">Already have an account? </span>
        <button
          onClick={onSwitchToLogin}
          className="text-[#fbf0df] hover:text-[#f3d5a3] font-medium underline"
        >
          Login
        </button>
      </div>
    </div>
  );
};