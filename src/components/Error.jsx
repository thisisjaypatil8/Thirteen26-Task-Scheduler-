import React from 'react';

function Error({ message }) {
  if (!message) return null;
  return (
    <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      <p className="font-bold">An Error Occurred</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default Error;