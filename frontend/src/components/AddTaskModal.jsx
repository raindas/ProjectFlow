import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, projectId, onTaskAdded, projects }) => {
    const [selectedProjectId, setSelectedProjectId] = useState(projectId);
    const [title, setTitle] = useState('');
    const [due, setDue] = useState('');
    const [email, setEmail] = useState('');

    // Update selected ID if the prop changes
    useEffect(() => {
        setSelectedProjectId(projectId);
    }, [projectId]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!projectId) {
            alert("You need to create a project first!");
            return;
        }

        if (!selectedProjectId) return alert("Please select a project first!");

        const res = await fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: selectedProjectId, // Use the state variable here
                title,
                due: new Date(due).toISOString(),
                assignedEmail: email
            })
        });

        if (res.ok) {
            onTaskAdded();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
            <div className="bg-white w-full max-w-md h-full p-8 shadow-2xl animate-in slide-in-from-right">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">New Task</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                        <select
                            className="w-full p-3 border rounded-lg bg-white"
                            value={selectedProjectId || ""}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a project</option>
                            {projects.map(p => (
                                <option key={p.ProjectID} value={p.ProjectID}>
                                    {p.ProjectName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                        <input
                            required className="w-full p-3 border rounded-lg"
                            value={title} onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            type="datetime-local" required className="w-full p-3 border rounded-lg"
                            value={due} onChange={e => setDue(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign To (Email)</label>
                        <input
                            type="email" required className="w-full p-3 border rounded-lg"
                            value={email} onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;