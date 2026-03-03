import React from 'react';

const ProgressBar = ({ progress }) => {
    // Ensure the progress stays between 0 and 100
    const safeProgress = Math.min(Math.max(progress, 0), 100);
    const barColor = safeProgress === 100 ? 'bg-green-500' : 'bg-black';

    return (
        <div className="w-full mt-3">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 font-medium">Progress</span>
                <span className="text-gray-900 font-bold">{Math.round(safeProgress)}%</span>
            </div>
            {/* Background Track */}
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                {/* Fill Bar */}
                <div
                    className={`${barColor} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${safeProgress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;