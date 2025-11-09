import React from 'react';

function TaskForm({ taskInput, setTaskInput, onSubmit, isLoading }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">What's on your plate today?</h2>
      <textarea
        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g.&#10;- Write team report&#10;- Dentist at 3pm for 1 hour&#10;- Call mom"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
      />
      <button
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out disabled:bg-gray-400"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? '🧠 Thinking...' : '✨ Generate Schedule'}
      </button>
    </div>
  );
}

export default TaskForm;