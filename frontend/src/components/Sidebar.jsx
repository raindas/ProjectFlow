import React, { useState } from 'react';

const Sidebar = ({ onProjectCreated }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const userEmail = localStorage.getItem('pf_user_email'); // Ensure you store this on login!

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const res = await fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerEmail: userEmail,
        projectName: newProjectName
      })
    });

    if (res.ok) {
      setNewProjectName('');
      onProjectCreated(); // Refresh the dashboard data
    }
  };

  return (
    <div className="w-64 bg-white border-r h-screen p-6 hidden md:block">
      <h2 className="font-bold text-lg mb-6">Projects</h2>
      
      <form onSubmit={handleCreateProject} className="mb-8">
        <input 
          type="text" 
          placeholder="+ New Project"
          className="w-full p-2 text-sm border-b focus:border-black outline-none transition-colors"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
      </form>

      {/* Project list items would go here */}
    </div>
  );
};

export default Sidebar;