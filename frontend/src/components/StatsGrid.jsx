import React from 'react';

const StatCard = ({ label, count, colorClass }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{count}</p>
  </div>
);

const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard label="Total Projects" count={stats.totalProjects} colorClass="text-gray-900" />
      <StatCard label="Tasks Due Today" count={stats.dueToday} colorClass="text-amber-600" />
      <StatCard label="Overdue Tasks" count={stats.overdue} colorClass="text-red-600" />
      <StatCard label="Completed (24h)" count={stats.completed} colorClass="text-green-600" />
    </div>
  );
};

export default StatsGrid;