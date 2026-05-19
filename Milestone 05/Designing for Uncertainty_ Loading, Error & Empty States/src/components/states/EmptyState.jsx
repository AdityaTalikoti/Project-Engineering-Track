import React from 'react';
import { InboxIcon } from 'lucide-react';

/**
 * EmptyState — shown when data returns successfully but is an empty list.
 *
 * Props:
 *   title       {string}    — headline, e.g. "No orders yet"
 *   message     {string}    — supporting context, what will appear here / what to do
 *   actionLabel {string}    — CTA button text (optional)
 *   onAction    {function}  — CTA button handler (optional)
 *   icon        {component} — lucide icon override (optional, defaults to InboxIcon)
 */
const EmptyState = ({ title, message, actionLabel, onAction, icon: Icon = InboxIcon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
