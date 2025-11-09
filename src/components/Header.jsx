import React from 'react';

function Header({ onSettingsClick }) { 
  return (
    <header 
      className="bg-white shadow-md px-4 flex justify-between items-center w-full sticky top-0 z-50 h-16"
      // We changed p-4 to px-4 and added:
      // sticky top-0 z-50 h-16
    >
      
      {/* App Title */}
      <div className="flex items-center space-x-3">
        <span className="text-2xl"><img src="/logo.png" alt="Logo" className="w-8 h-8" /></span>
        <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">
          Thirteen26 | Smart Scheduler
        </h1>
        <h1 className="text-xl font-bold text-gray-800 sm:hidden">
          Scheduler
        </h1>
      </div>

      {/* Settings Button */}
      <button
        onClick={onSettingsClick}
        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow"
      >
        Settings
      </button>
    </header>
  );
}

export default Header;