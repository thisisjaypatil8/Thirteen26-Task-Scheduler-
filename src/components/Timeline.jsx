import React from 'react';
import { parseTime, formatTimeRemaining } from '../utils/timeUtils.js';

// This is the individual item
function TimelineItem({ item, isCompleted, onToggle, currentTime }) {
  const startTime = parseTime(item.startTime);
  const endTime = parseTime(item.endTime);
  
  // New: Check if this is a free time block
  const isFreeTime = item.task.toLowerCase() === 'free time';

  const isCurrent = currentTime >= startTime && currentTime < endTime;
  const isPast = currentTime > endTime && !isCurrent;
  
  let timeRemaining = null;
  if (isCurrent) {
    timeRemaining = formatTimeRemaining(endTime.getTime() - currentTime.getTime());
  }

  const priorityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-green-500 bg-green-50',
  };
  
  // New: Use a neutral gray color for Free Time
  const colorClass = isFreeTime 
    ? 'border-gray-400 bg-gray-50' 
    : (priorityColors[item.priority?.toLowerCase()] || 'border-gray-500 bg-gray-50');

  return (
    <div className={`relative ${colorClass} border-l-4 p-4 rounded-r-lg shadow-sm transition-all ${isPast && !isCurrent ? 'opacity-50' : ''} ${isCompleted ? 'opacity-40' : ''}`}>
      {/* The dot on the timeline */}
      <div className={`absolute -left-[1.625rem] top-4 w-6 h-6 ${isCurrent ? 'bg-red-500 animate-pulse' : (isFreeTime ? 'bg-gray-400' : 'bg-blue-500')} rounded-full border-4 border-white`}></div>
      
      {isCurrent && (
        <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          NOW
        </div>
      )}

      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-semibold text-lg ${isFreeTime ? 'text-gray-600 italic' : 'text-gray-800'} ${isCompleted ? 'line-through' : ''}`}>
            {item.task}
          </h3>
          <p className={`${isFreeTime ? 'text-gray-500' : 'text-blue-700'} font-medium`}>{item.startTime} - {item.endTime}</p>
          {timeRemaining && (
            <p className="text-red-600 font-medium text-sm">{timeRemaining}</p>
          )}
        </div>
        
        {/* NEW: Only show the checkbox if it's NOT free time */}
        {!isFreeTime && (
          <div className="flex items-center space-x-2 pl-2">
            <label htmlFor={`task-${item.id}`} className="text-sm text-gray-500">Done:</label>
            <input 
              type="checkbox" 
              id={`task-${item.id}`} 
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={isCompleted}
              onChange={() => onToggle(item.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}


// This is the main Timeline component (unchanged)
function Timeline({ schedule, completedTasks, onToggleComplete, currentTime, showCompleted }) {
  
  const visibleSchedule = schedule.filter(item => {
    return showCompleted ? true : !completedTasks.has(item.id);
  });
  
  return (
    <div className="border-l-4 border-blue-500 pl-6 space-y-8">
      {visibleSchedule.map(item => (
        <TimelineItem
          key={item.id}
          item={item}
          isCompleted={completedTasks.has(item.id)}
          onToggle={onToggleComplete}
          currentTime={currentTime}
        />
      ))}
    </div>
  );
}

export default Timeline;