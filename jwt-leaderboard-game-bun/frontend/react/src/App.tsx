import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Leaderboard } from './components/Leaderboard';
import "./index.css";

const AuthenticatedApp: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2B2B2B] flex items-center justify-center">
        <div className="text-[#fbf0df] text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Leaderboard />;
  }

  return <AuthPage />;
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#2B2B2B] p-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold my-8 text-[#fbf0df]">JWT Leaderboard Game</h1>
        <p className="text-[#fbf0df]/80 mb-8">
          Sign up or login to view the leaderboard and manage user tokens
        </p>
        
        {isLogin ? (
          <Login onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <Signup onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export function App() {
  return (
    <div className="min-h-screen bg-[#2B2B2B]">
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </div>
  );
}

export default App;
