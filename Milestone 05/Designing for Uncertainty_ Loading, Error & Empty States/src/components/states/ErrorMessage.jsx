import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorMessage — displays a clear error with an optional Retry button.
 *
 * Props:
 *   message  {string}    — human-readable description of what went wrong and what to do
 *   onRetry  {function}  — if provided, a "Try Again" button is rendered
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle size={32} className="text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Something went wrong</h3>
      <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
