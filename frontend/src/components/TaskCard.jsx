import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const TaskCard = ({ task, onUpdate }) => {
  const isCompleted = task.Status === 'Completed';

  const handleComplete = async () => {
    if (isCompleted) return;
    
    const res = await fetch(`${import.meta.env.VITE_BASE_BACKEND_URL}/api/v1/tasks/${task.TaskID}/complete`, {
      method: 'PATCH'
    });
    
    if (res.ok) onUpdate();
  };

  return (
    <div className={`p-4 border rounded-xl flex items-center justify-between transition-all ${
      isCompleted ? 'bg-gray-50 opacity-60' : 'bg-white shadow-sm'
    }`}>
      <div className="flex items-center gap-4">
        <button onClick={handleComplete} className="text-gray-400 hover:text-green-500 transition-colors">
          {isCompleted ? <CheckCircle className="text-green-500" /> : <Circle />}
        </button>
        <div>
          <h4 className={`font-semibold ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.TaskTitle}
          </h4>
          <p className="text-xs text-gray-500">
            Due: {new Date(task.DueDate).toLocaleString()}
          </p>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
        isCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {task.Status}
      </span>
    </div>
  );
};

export default TaskCard;