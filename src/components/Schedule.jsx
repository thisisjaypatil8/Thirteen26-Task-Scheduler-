import React from 'react';
import Timeline from './Timeline';
import Loading from './Loading';
import Error from './Error';
import { exportToICS } from '../utils/icsExporter.js';

// Helper to format minutes into a readable string
const formatFreeTime = (minutes) => {
  if (minutes === null || minutes < 1) return null;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` and ${mins} minute${mins > 1 ? 's' : ''}` : ''}`;
  }
  return `${mins} minute${mins > 1 ? 's' : ''}`;
};


function Schedule({
  schedule,
  isLoading,
  error,
  completedTasks,
  onToggleComplete,
  currentTime,
  showCompleted,
  setShowCompleted,
  // New props
  freeTime,
  unScheduledTasks
}) {
  const hasSchedule = schedule.length > 0;

  if (!hasSchedule && !isLoading && !error) {
    return null; // Don't show this section at all if there's nothing
  }

  const freeTimeString = formatFreeTime(freeTime);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Your Day, Organized</h2>
        {hasSchedule && (
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow"
            onClick={() => exportToICS(schedule)}
          >
            Export (.ics)
          </button>
        )}
      </div>

      {isLoading && <Loading />}
      <Error message={error} />
      
      {/* New Info Boxes */}
      {hasSchedule && !isLoading && (
        <div className="space-y-4 mb-6">
          
          {/* Free Time Box */}
          {freeTimeString && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <p className="font-bold">Time in Hand: You have {freeTimeString} of free time remaining today!</p>
            </div>
          )}
          
          {/* Unscheduled Tasks Box */}
          {unScheduledTasks && unScheduledTasks.length > 0 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
              <p className="font-bold">Tasks Not Scheduled (Not Enough Time):</p>
              <ul className="list-disc list-inside">
                {unScheduledTasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
      
      {hasSchedule && (
        <>
          <div className="flex justify-end mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
              <span className="text-gray-600">Show Completed Tasks</span>
            </label>
          </div>
          <Timeline
            schedule={schedule}
            completedTasks={completedTasks}
            onToggleComplete={onToggleComplete}
            currentTime={currentTime}
            showCompleted={showCompleted}
          />
        </>
      )}
    </div>
  );
}

export default Schedule;