import React from 'react';
import ProgressTracker from './ProgressTracker.jsx';
import Tips from './Tips.jsx';

function Sidebar({ totalTasks, completedCount, schedule, apiKey }) {
  return (
    // The space-y-8 gives vertical spacing between the widgets
    <>
      <ProgressTracker total={totalTasks} completed={completedCount} />
      
      {/* Pass the schedule and key to the Tips component */}
      <Tips schedule={schedule} apiKey={apiKey} />
    </>
  );
}

export default Sidebar;