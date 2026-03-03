import React, { useState, useEffect } from 'react';
import StatsGrid from '../components/StatsGrid';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import ProgressBar from '../components/ProgressBar';
import { Trash2 } from 'lucide-react';

const Dashboard = () => {
    const [data, setData] = useState({ projects: [], tasks: [], stats: {} });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    const fetchDashboardData = async () => {
        try {
            const userEmail = localStorage.getItem('pf_user_email');

            const [projRes, taskRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/projects/${userEmail}`),
                fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/tasks?email=${userEmail}`)
            ]);

            const projects = await projRes.json();
            const tasks = await taskRes.json();

            // Simple client-side aggregation for the demo
            const stats = {
                totalProjects: projects.length,
                dueToday: tasks.filter(t => new Date(t.DueDate).toDateString() === new Date().toDateString()).length,
                overdue: tasks.filter(t => new Date(t.DueDate) < new Date() && t.Status !== 'Completed').length,
                completed: 0 // Fetch from a specialized stats endpoint in production
            };

            setData({ projects, tasks, stats });
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const userEmail = localStorage.getItem('pf_user_email'); // Ensure you set this in Verify.jsx!

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
            // Re-run your fetch function here to refresh the list
            fetchDashboardData();
        }
    };

    const handleDeleteProject = async (projectId, projectName) => {
        // 1. Simple confirmation alert
        const confirmed = window.confirm(`Are you sure you want to delete "${projectName}"? This will also delete all tasks inside it.`);

        if (!confirmed) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/projects/${projectId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // 2. Refresh the data
                fetchDashboardData();
            } else {
                alert("Failed to delete project.");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-gray-500">Loading your flow...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">ProjectFlow</h1>
                        <p className="text-gray-500">Overview of your active projects</p>
                    </div>
                    <button
                        onClick={() => {
                            if (data.projects.length === 0) {
                                alert("Please create a project first using the 'Add' field on the right.");
                            } else {
                                setIsModalOpen(true);
                            }
                        }}
                        className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                        + New Task
                    </button>
                </div>
            </header>

            <StatsGrid stats={data.stats} />

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
                    <div className="space-y-4">
                        {data.tasks.map(task => (
                            <TaskCard
                                key={task.TaskID}
                                task={task}
                                onUpdate={() => window.location.reload()} // Simple refresh for now
                            />
                        ))}
                        {data.tasks.length === 0 && <p className="text-gray-400">No upcoming tasks. Time to relax!</p>}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Your Projects</h3>
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm p-4">

                        {/* Inline Project Creator */}
                        <form onSubmit={handleCreateProject} className="mb-4 flex gap-2">
                            <input
                                type="text"
                                placeholder="New project name..."
                                className="flex-1 p-2 text-sm border rounded-lg focus:ring-1 focus:ring-black outline-none"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                            />
                            <button className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-bold hover:bg-gray-200">
                                Add
                            </button>
                        </form>

                        <div className="space-y-2">
                            {data.projects.map((project) => {
                                // 1. Get total tasks from the Prisma _count property
                                const total = project._count?.Tasks || 0;

                                // 2. Get completed tasks
                                // (Assuming your backend returns a 'Tasks' array or a 'completedCount' field)
                                const completed = project.Tasks?.filter(t => t.Status === 'Completed').length || 0;

                                // 3. Calculate percentage (and prevent division by zero)
                                const progressPercentage = total === 0 ? 0 : (completed / total) * 100;

                                return (
                                    <div key={project.ProjectID} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{project.ProjectName}</span>
                                            {/* Delete Button - only shows clearly on hover if you use the 'group' class */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent clicking the project itself
                                                    handleDeleteProject(project.ProjectID, project.ProjectName);
                                                }}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            {/* <span className="text-xs text-gray-400">{total} tasks</span> */}
                                        </div>

                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                                                {total} tasks
                                            </span>
                                        </div>

                                        {/* 4. Pass the calculated percentage here */}
                                        <ProgressBar progress={progressPercentage} />
                                    </div>
                                );
                            })}

                            {data.projects.length === 0 && (
                                <p className="text-center py-4 text-gray-400 text-sm italic">
                                    No projects yet. Create one above to get started!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                // Fallback to null so the modal knows it doesn't have a default project
                projectId={data.projects.length > 0 ? data.projects[0].ProjectID : null}
                // Pass the list of projects so the user can choose in a dropdown
                projects={data.projects}
                onTaskAdded={fetchDashboardData} // Use the function we talked about!
            />
        </div>
    );
};

export default Dashboard;