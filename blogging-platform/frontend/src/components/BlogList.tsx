import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Tag {
  id: number;
  title: string;
  createdAt: string;
}

interface Author {
  id: number;
  name: string;
  email: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  tags: Tag[];
  author: Author;
}

interface BlogListProps {
  onCreateBlog: () => void;
  refreshKey?: number; // Add refresh key to trigger re-fetch
}

export const BlogList: React.FC<BlogListProps> = ({ onCreateBlog, refreshKey }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  const API_BASE = 'http://localhost:3000'; // Backend API URL

  useEffect(() => {
    fetchBlogs();
  }, [refreshKey]); // Re-fetch when refreshKey changes

  // Search functionality - you can implement your custom search logic here
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBlogs(blogs);
    } else {
      // TODO: Replace this with custom search implementation
      // Current implementation: Simple case-insensitive text matching
      // Enhance this with:
      // - Fuzzy search
      // - Search ranking/scoring
      // - Search by date ranges
      // - Advanced filters
      // - Search highlighting
      // - Backend search API calls
      
      const filtered = blogs.filter(blog => {
        const query = searchQuery.toLowerCase();
        return (
          blog.title.toLowerCase().includes(query) ||
          blog.content.toLowerCase().includes(query) ||
          blog.category.toLowerCase().includes(query) ||
          blog.author?.name?.toLowerCase().includes(query) ||
          blog.tags.some(tag => tag.title.toLowerCase().includes(query))
        );
      });
      setFilteredBlogs(filtered);
    }
  }, [blogs, searchQuery]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/blogs`, {
        method: 'GET',
        credentials: 'include', // Include cookies for JWT authentication
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      
      const blogsData = await response.json();
      setBlogs(blogsData);
      setFilteredBlogs(blogsData); // Initialize filtered blogs
    } catch (err) {
      setError('Failed to load blogs. Please try again.');
      console.error('Error fetching blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading blogs...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header with user info and logout button */}
      <header style={styles.header}>
        <div style={styles.userInfo}>
          <h1 style={styles.title}>Blog Platform</h1>
          <p style={styles.welcome}>Welcome, {user?.name}!</p>
        </div>
        <div style={styles.headerActions}>
          <button 
            onClick={onCreateBlog}
            style={styles.createButton}
          >
            + Create Blog
          </button>
          <button 
            onClick={async () => {
              await logout();
              // No need to redirect, the auth context will handle state change
            }} 
            style={styles.logoutButton}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search blogs by title, content, category, author, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              style={styles.clearButton}
              title="Clear search"
            >
              ✕
            </button>
          ) : (
            <div style={styles.searchIcon}>🔍</div>
          )}
        </div>

        {error ? (
          <div style={styles.error}>
            {error}
            <button onClick={fetchBlogs} style={styles.retryButton}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div style={styles.blogCount}>
              {searchQuery ? (
                <>
                  <span style={styles.searchResultText}>
                    {filteredBlogs.length} of {blogs.length} blogs found
                  </span>
                  {searchQuery && (
                    <span style={styles.searchTerm}> for "{searchQuery}"</span>
                  )}
                </>
              ) : (
                `${blogs.length} ${blogs.length === 1 ? 'Blog' : 'Blogs'} Available`
              )}
            </div>
            
            {filteredBlogs.length === 0 ? (
              <div style={styles.noBlogsMessage}>
                {searchQuery ? 'No blogs match your search.' : 'No blogs available yet. Check back later!'}
              </div>
            ) : (
              <div style={styles.blogGrid}>
                {filteredBlogs.map((blog) => (
                  <div key={blog.id} style={styles.blogCard}>
                    <h3 style={styles.blogTitle}>{blog.title}</h3>
                    <div style={styles.blogMeta}>
                      <span style={styles.category}>{blog.category}</span>
                      <span style={styles.date}>{formatDate(blog.createdAt)}</span>
                    </div>
                    
                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div style={styles.tagsContainer}>
                        {blog.tags.map((tag) => (
                          <span key={tag.id} style={styles.tag}>
                            {tag.title}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p style={styles.blogContent}>
                      {blog.content.length > 150 
                        ? `${blog.content.substring(0, 150)}...` 
                        : blog.content
                      }
                    </p>
                    <div style={styles.blogFooter}>
                      <span style={styles.authorName}>
                        By: {blog.author ? blog.author.name : `User ${blog.authorId}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  header: {
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '28px'
  },
  welcome: {
    margin: '5px 0 0 0',
    color: '#666',
    fontSize: '16px'
  },
  headerActions: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  main: {
    padding: '30px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  searchContainer: {
    position: 'relative' as const,
    marginBottom: '25px',
    maxWidth: '600px',
    margin: '0 auto 25px auto'
  },
  searchInput: {
    width: '100%',
    padding: '12px 45px 12px 15px',
    border: '1px solid #ddd',
    borderRadius: '25px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  searchIcon: {
    position: 'absolute' as const,
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '18px',
    color: '#999',
    pointerEvents: 'none' as const
  },
  clearButton: {
    position: 'absolute' as const,
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#999',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25px',
    height: '25px'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#666'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center' as const,
    marginBottom: '20px'
  },
  retryButton: {
    marginLeft: '10px',
    padding: '5px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  blogCount: {
    fontSize: '18px',
    color: '#495057',
    marginBottom: '25px',
    fontWeight: 'bold'
  },
  searchResultText: {
    color: '#495057'
  },
  searchTerm: {
    color: '#007bff',
    fontStyle: 'italic'
  },
  noBlogsMessage: {
    textAlign: 'center' as const,
    color: '#6c757d',
    fontSize: '18px',
    padding: '50px 20px'
  },
  blogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px'
  },
  blogCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  blogTitle: {
    margin: '0 0 15px 0',
    color: '#212529',
    fontSize: '20px',
    lineHeight: '1.3'
  },
  blogMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  category: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const
  },
  date: {
    color: '#6c757d',
    fontSize: '14px'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    marginBottom: '15px'
  },
  tag: {
    backgroundColor: '#e9ecef',
    color: '#495057',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  blogContent: {
    color: '#495057',
    lineHeight: '1.6',
    marginBottom: '15px'
  },
  blogFooter: {
    borderTop: '1px solid #e9ecef',
    paddingTop: '15px'
  },
  authorName: {
    color: '#6c757d',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  authorId: {
    color: '#6c757d',
    fontSize: '14px'
  }
};