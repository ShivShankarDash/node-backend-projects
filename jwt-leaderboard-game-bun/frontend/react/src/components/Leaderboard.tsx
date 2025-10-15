import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface User {
  id: number;
  name: string;
  email: string;
  token: string;
}

interface LeaderboardEntry {
  name: string;
  tokenLength: number;
}

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3000/leaderboard', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const leaderboardData = await response.json();
        setLeaderboard(leaderboardData);
      } else {
        setError('Failed to fetch leaderboard');
      }
    } catch (err) {
      setError('An error occurred while fetching leaderboard');
    }
  };

  const invalidateToken = async (userId: number) => {
    try {
      const response = await fetch('http://localhost:3000/users/invalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        // Refresh the users list after invalidation
        await fetchUsers();
        await fetchLeaderboard();
        alert('Token invalidated successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to invalidate token: ${errorData.message}`);
      }
    } catch (err) {
      alert('An error occurred while invalidating token');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchLeaderboard()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 text-center">
        <div className="text-[#fbf0df] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#fbf0df]">JWT Leaderboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-[#fbf0df]">Welcome, {user?.name}!</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* Users List */}
      <div className="bg-[#1a1a1a] rounded-xl border-2 border-[#fbf0df] p-6 mb-8">
        <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#fbf0df]/30">
                <th className="py-3 px-4 text-[#fbf0df] font-bold">ID</th>
                <th className="py-3 px-4 text-[#fbf0df] font-bold">Name</th>
                <th className="py-3 px-4 text-[#fbf0df] font-bold">Email</th>
                <th className="py-3 px-4 text-[#fbf0df] font-bold">Token</th>
                <th className="py-3 px-4 text-[#fbf0df] font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userData) => (
                <tr key={userData.id} className="border-b border-[#fbf0df]/10 hover:bg-[#fbf0df]/5">
                  <td className="py-3 px-4 text-[#fbf0df]">{userData.id}</td>
                  <td className="py-3 px-4 text-[#fbf0df]">{userData.name}</td>
                  <td className="py-3 px-4 text-[#fbf0df]">{userData.email}</td>
                  <td className="py-3 px-4 text-[#fbf0df] font-mono text-sm">
                    {userData.token ? (
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        {userData.token.length > 20 ? `${userData.token.substring(0, 20)}...` : userData.token}
                      </span>
                    ) : (
                      <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded">No Token</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {userData.id !== user?.id && (
                      <button
                        onClick={() => invalidateToken(userData.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Invalidate Token
                      </button>
                    )}
                    {userData.id === user?.id && (
                      <span className="text-[#fbf0df]/60 text-sm italic">Current User</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-[#1a1a1a] rounded-xl border-2 border-[#fbf0df] p-6">
        <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">Token Length Leaderboard</h2>
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-[#fbf0df]/5 rounded-lg border border-[#fbf0df]/20"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-[#fbf0df]">#{index + 1}</div>
                <div className="text-[#fbf0df] font-medium">{entry.name}</div>
              </div>
              <div className="text-[#fbf0df] font-mono">
                Token Length: <span className="font-bold">{entry.tokenLength}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};