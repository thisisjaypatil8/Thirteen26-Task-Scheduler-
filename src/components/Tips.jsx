import React, { useState, useEffect } from 'react';
import { getAITips } from '../services/geminiService.js'; // Import the service here

function Tips({ schedule = [], apiKey = '' }) {
  const [aiTips, setAiTips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // When the schedule changes, reset the tips
  useEffect(() => {
    setAiTips([]);
    setError(null);
  }, [schedule]); // This is a dependency

  const handleGenerateTips = async () => {
    if (!apiKey) {
      alert("API Key is missing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiTips([]);
    
    try {
      const tips = await getAITips(schedule, apiKey);
      setAiTips(tips);
    } catch (err) {
      setError(err.message);
      setAiTips(["Could not load tips due to an error."]);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show anything if there is no schedule
  if (schedule.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">💡 AI Productivity Tips</h3>
        <p className="text-gray-500">Generate a schedule to get AI-powered tips.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold mb-4 text-gray-700">💡 AI Productivity Tips</h3>
      
      {/* Show tips if they exist */}
      {aiTips.length > 0 && (
        <ul className="space-y-3 list-disc list-inside text-gray-600 mb-4">
          {aiTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      )}

      {/* Show loading state */}
      {isLoading && (
        <div className="text-gray-500 text-center my-4">
          <p>Generating custom tips for your schedule...</p>
        </div>
      )}

      {/* Show error */}
      {error && (
        <p className="text-red-500 my-4">Error: {error}</p>
      )}

      {/* Show the button if not loading AND no tips are loaded yet */}
      {!isLoading && aiTips.length === 0 && (
        <button
          onClick={handleGenerateTips}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all"
        >
          Generate Tips for this Schedule
        </button>
      )}
    </div>
  );
}

export default Tips;