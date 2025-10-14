

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { BlogList } from './components/BlogList';
import { BlogForm } from './components/BlogForm';

// Main App Content component that uses auth context
const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);

  const API_BASE = 'http://localhost:3000';

  const handleCreateBlog = async (blogData: any): Promise<boolean> => {
    setIsCreatingBlog(true);
    try {
      const response = await fetch(`${API_BASE}/blogs/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        setShowBlogForm(false);
        setSuccessMessage('Blog created successfully!');
        setRefreshKey(prev => prev + 1);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      return false;
    } finally {
      setIsCreatingBlog(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // If user is logged in, show appropriate view
  if (user) {
    if (showBlogForm) {
      return (
        <BlogForm
          onSubmit={handleCreateBlog}
          onCancel={() => setShowBlogForm(false)}
          isLoading={isCreatingBlog}
        />
      );
    }

    return (
      <>
        {successMessage && (
          <div style={styles.successMessage}>
            {successMessage}
          </div>
        )}
        <BlogList 
          onCreateBlog={() => setShowBlogForm(true)} 
          refreshKey={refreshKey}
        />
      </>
    );
  }

  // If user is not logged in, show login or signup
  return (
    <>
      {showSignup ? (
        <Signup onSwitchToLogin={() => setShowSignup(false)} />
      ) : (
        <Login onSwitchToSignup={() => setShowSignup(true)} />
      )}
    </>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  },
  successMessage: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px 20px',
    borderRadius: '5px',
    border: '1px solid #c3e6cb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 1000,
    fontSize: '16px',
    fontWeight: 'bold'
  }
};

export default App;
