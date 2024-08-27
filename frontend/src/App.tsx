import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { useAuth } from './AuthContext';

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const fetchedPosts = await backend.getPosts();
    setPosts(fetchedPosts);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content && category) {
      await backend.createPost(content, category);
      setContent('');
      setCategory('');
      fetchPosts();
    }
  };

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
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

  return (
    <div className="container">
      <header className="header">
        <h1>Twitter Clone v0</h1>
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
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button type="submit" className="button">
            Post
          </button>
        </form>
      )}

      <div className="category-toggle">
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="all">All Categories</option>
          <option value="technology">Technology</option>
          <option value="sports">Sports</option>
          <option value="entertainment">Entertainment</option>
        </select>
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id.toString()} className="post">
            <p>{post.content}</p>
            <small>Category: {post.category}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;