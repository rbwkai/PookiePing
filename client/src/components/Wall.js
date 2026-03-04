// ===========================================
// WALL PAGE COMPONENT
// ===========================================
// Main wall page where users can post messages
// Content is rendered with dangerouslySetInnerHTML
// (intentionally unsafe for XSS demonstration)
// ===========================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Wall() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [sanitizationEnabled, setSanitizationEnabled] = useState(false);
  
  const { user, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
        setSanitizationEnabled(data.sanitizationEnabled);
      }
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [token, logout, navigate]);

  // Load posts on mount
  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token, fetchPosts]);

  // Handle post submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setPosting(true);
    setError('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setContent('');
        // Add new post to top of list
        setPosts([data.post, ...posts]);
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle destruct - clear all posts
  const handleDestruct = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setPosts([]);
      } else {
        setError(data.message || 'Failed to delete posts');
      }
    } catch (err) {
      setError('Failed to delete posts');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="wall-container">
      {/* Header */}
      <header className="wall-header">
        <div className="header-content">
          <h1>🧱 The Wall</h1>
          <div className="header-right">
            <span className="username">@{user?.username}</span>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </div>
        </div>
        
        {/* Sanitization Status Badge */}
        <div className={`sanitization-badge ${sanitizationEnabled ? 'safe' : 'unsafe'}`}>
          {sanitizationEnabled ? (
            <>🛡️ Sanitization: ENABLED (Safe Mode)</>
          ) : (
            <>⚠️ Sanitization: DISABLED (XSS Active)</>
          )}
        </div>
      </header>

      {/* Post Form */}
      <div className="post-form-container">
        <form onSubmit={handleSubmit} className="post-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something on the wall... (HTML allowed)"
            className="post-input"
            rows={4}
          />
          <div className="post-form-footer">
            <span className="html-hint">💡 Try: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, or... something else 😉</span>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={posting || !content.trim()}
            >
              {posting ? 'Posting...' : 'Post to Wall'}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Posts List */}
      <div className="posts-section-header">
        <button onClick={handleDestruct} className="btn btn-destruct">
          Destruct
        </button>
      </div>
      <div className="posts-container">
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Be the first to write on the wall!</p>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <article key={post._id} className="post-card">
                <div className="post-header">
                  <span className="post-author">@{post.author}</span>
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                </div>
                {/* 
                  ⚠️ INTENTIONALLY UNSAFE - dangerouslySetInnerHTML
                  This renders raw HTML without sanitization
                  This is the XSS vulnerability for educational purposes
                */}
                <div 
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Footer Warning */}
      <footer className="wall-footer">
        <div className="warning-banner">
          ⚠️ Educational cybersecurity tool. Never deploy publicly. Local network only.
        </div>
      </footer>
    </div>
  );
}

export default Wall;
