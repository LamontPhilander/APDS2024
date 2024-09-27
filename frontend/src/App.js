import './App.css';
import React from 'react';
// Import BrowserRouter to provide routing context
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Import all the components we need in our App
import Navbar from './components/navbar';
import PostList from './components/postList';
import EditPost from './components/postEdit';
import CreatePost from './components/postCreate';
import Register from './components/register';
import Login from './components/login';

const App = () => {
  return (
    <Router> {/* Wrap your Routes in Router */}
      <div>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<PostList />} />
          <Route path="/post/create" element={<CreatePost />} />
          <Route path="/post/edit/:id" element={<EditPost />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
