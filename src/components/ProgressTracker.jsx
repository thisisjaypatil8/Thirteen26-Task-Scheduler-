import React from 'react';

function ProgressTracker({ total, completed }) {
  // Prevent divide by zero if no tasks are scheduled
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const isAllDone = total > 0 && percentage === 100;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Daily Progress</h3>
      
      {total === 0 ? (
        <p className="text-gray-500">Generate a schedule to see your progress.</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium text-gray-800">
              {isAllDone ? "All tasks done! 🎉" : "Tasks Completed"}
            </span>
            <span className="text-lg font-bold text-blue-600">
              {completed} / {total}
            </span>
          </div>
          
          {/* The progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${isAllDone ? 'bg-green-500' : 'bg-blue-600'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProgressTracker;