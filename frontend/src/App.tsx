import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { useAuth } from './AuthContext';
import MessageIcon from '@mui/icons-material/Message';

type Post = {
  id: bigint;
  author: [] | [Principal];
  content: string;
  category: string;
  timestamp: bigint;
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    const fetchedPosts = await backend.getPosts();
    setPosts(fetchedPosts);
  };

  const fetchCategories = async () => {
    const fetchedCategories = await backend.getCategories();
    setCategories(fetchedCategories);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content && category) {
      const result = await backend.createPost(content, category);
      if ('ok' in result) {
        setContent('');
        setCategory('');
        fetchPosts();
      } else {
        alert(`Error creating post: ${result.err}`);
      }
    }
  };

  const handleCategoryChange = async (newCategory: string) => {
    setSelectedCategory(newCategory);
    if (newCategory === 'all') {
      fetchPosts();
    } else {
      const filteredPosts = await backend.getPostsByCategory(newCategory);
      setPosts(filteredPosts);
    }
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      await login();
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Categories</h2>
        <ul>
          <li 
            onClick={() => handleCategoryChange('all')}
            className={selectedCategory === 'all' ? 'active' : ''}
          >
            All
          </li>
          {categories.map((cat) => (
            <li 
              key={cat} 
              onClick={() => handleCategoryChange(cat)}
              className={selectedCategory === cat ? 'active' : ''}
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <header className="header">
          <h1><MessageIcon /> Msg</h1>
          <button className="button" onClick={handleAuth}>
            {isAuthenticated ? 'Logout' : 'Login'}
          </button>
        </header>

        {isAuthenticated && (
          <form onSubmit={handleCreatePost} className="post-form">
            <textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button type="submit" className="button">
              Post
            </button>
          </form>
        )}

        <div className="post-list">
          {posts.map((post) => (
            <div key={post.id.toString()} className="post">
              <div className="post-content">{post.content}</div>
              <div className="post-meta">
                <span>Category: {post.category}</span>
                <span>{formatDate(post.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;