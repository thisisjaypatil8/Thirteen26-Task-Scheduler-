import React from 'react';

function SettingsModal({ show, onClose, apiKey, setApiKey, onSave }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>
        <p className="text-gray-600 mb-2">Please enter your Google Gemini API Key.</p>
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter your API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;