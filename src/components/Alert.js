// Alert.js
import React from 'react';

export default function Alert({ message, type, onDismiss }) {
  const getColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`${getColor()} p-4 rounded-lg mb-4 flex justify-between items-center`}>
      <span>{message}</span>
      <button onClick={onDismiss} className="text-xl font-bold px-2 cursor-pointer">
        &times;
      </button>
    </div>
  );
}
