import React, { useState, useEffect } from 'react';

interface Tag {
  id: number;
  title: string;
  createdAt: string;
}

interface BlogFormProps {
  onSubmit: (blogData: any) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
}

export const BlogForm: React.FC<BlogFormProps> = ({ onSubmit, onCancel, isLoading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newTagTitle, setNewTagTitle] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:3000';
  const categories = ['Technology', 'Leisure', 'Motivation', 'Life'];

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch(`${API_BASE}/tags`, {
        credentials: 'include',
      });
      if (response.ok) {
        const tags = await response.json();
        setAvailableTags(tags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagTitle.trim()) return;
    
    setIsCreatingTag(true);
    try {
      const response = await fetch(`${API_BASE}/tags/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title: newTagTitle.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        const newTag = data.tag;
        setAvailableTags([...availableTags, newTag]);
        setSelectedTagIds([...selectedTagIds, newTag.id]);
        setNewTagTitle('');
      } else if (response.status === 409) {
        const data = await response.json();
        // Tag already exists, add it to selected if not already
        if (data.tag && !selectedTagIds.includes(data.tag.id)) {
          setSelectedTagIds([...selectedTagIds, data.tag.id]);
        }
        setNewTagTitle('');
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleTagSelection = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim() || !category) {
      setError('Please fill in all required fields');
      return;
    }

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      category,
      tagIds: selectedTagIds,
    };

    const success = await onSubmit(blogData);
    if (success) {
      // Reset form
      setTitle('');
      setContent('');
      setCategory('');
      setSelectedTagIds([]);
      setNewTagTitle('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create New Blog Post</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter blog title"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={styles.select}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={styles.textarea}
              placeholder="Write your blog content here..."
              rows={8}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Tags</label>
            
            {/* Create new tag */}
            <div style={styles.tagCreateSection}>
              <input
                type="text"
                value={newTagTitle}
                onChange={(e) => setNewTagTitle(e.target.value)}
                placeholder="Create new tag"
                style={styles.tagInput}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleCreateTag}
                disabled={isCreatingTag || !newTagTitle.trim()}
                style={{
                  ...styles.createTagButton,
                  ...(isCreatingTag || !newTagTitle.trim() ? styles.buttonDisabled : {})
                }}
              >
                {isCreatingTag ? 'Creating...' : 'Create Tag'}
              </button>
            </div>

            {/* Tag selection */}
            <div style={styles.tagGrid}>
              {availableTags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleTagSelection(tag.id)}
                  style={{
                    ...styles.tagChip,
                    ...(selectedTagIds.includes(tag.id) ? styles.tagChipSelected : {})
                  }}
                >
                  {tag.title}
                </div>
              ))}
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitButton,
                ...(isLoading ? styles.buttonDisabled : {})
              }}
            >
              {isLoading ? 'Creating...' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    width: '100%'
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    color: '#333',
    fontSize: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box' as const
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
    backgroundColor: 'white'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const
  },
  tagCreateSection: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px'
  },
  tagInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px'
  },
  createTagButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  tagGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px'
  },
  tagChip: {
    padding: '6px 12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    userSelect: 'none' as const
  },
  tagChipSelected: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff'
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '20px'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  },
  error: {
    color: '#dc3545',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '5px'
  }
};