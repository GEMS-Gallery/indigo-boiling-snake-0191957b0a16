import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { useAuth } from './AuthContext';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

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

  const handleCategoryChange = async (e: React.ChangeEvent<{ value: unknown }>) => {
    const newCategory = e.target.value as string;
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
        <h1>Twitter Clone</h1>
        <Button variant="contained" onClick={handleAuth}>
          {isAuthenticated ? 'Logout' : 'Login'}
        </Button>
      </header>

      {isAuthenticated && (
        <form onSubmit={handleCreatePost} className="post-form">
          <TextField
            fullWidth
            variant="outlined"
            label="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Post
          </Button>
        </form>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel>Filter by Category</InputLabel>
        <Select value={selectedCategory} onChange={handleCategoryChange}>
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="technology">Technology</MenuItem>
          <MenuItem value="sports">Sports</MenuItem>
          <MenuItem value="entertainment">Entertainment</MenuItem>
        </Select>
      </FormControl>

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