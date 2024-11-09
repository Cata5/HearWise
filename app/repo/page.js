"use client"
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';
const RepositoryPage = () => {
  const [repositoryData, setRepositoryData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    // Simulate fetching repository data (e.g., from an API)
    setLoading(true);
    setTimeout(() => {
      setRepositoryData({
        name: 'My Awesome Repository',
        description: 'This repository contains all sorts of cool projects.',
      });
      setNewName('My Awesome Repository');
      setNewDescription('This repository contains all sorts of cool projects.');
      setLoading(false);
    }, 1000);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(repositoryData.name);
    setNewDescription(repositoryData.description);
  };

  const handleSave = () => {
    setRepositoryData({ name: newName, description: newDescription });
    setIsEditing(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" bg-[url('/bg.png')] bg-cover bg-center h-[100vh] rounded-lg shadow-lg text-white">
      <Header Name="Repository" />
    </div>
  );
};

export default RepositoryPage;
