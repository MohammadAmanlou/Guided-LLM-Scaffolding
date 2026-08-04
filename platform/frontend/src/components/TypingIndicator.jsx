import React from 'react';
import { useChatUI } from '../contexts/ChatUIContext';

export default function TypingIndicator() {
  const { theme } = useChatUI();

  return (
    <div
      dir="rtl"
      className={`flex justify-start mb-2`}
    >
      <div
        className={`bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-lg inline-flex items-center`}
        style={{ minWidth: 80 }}
      >
        <div className="typing-dots flex space-x-1 rtl:space-x-reverse">
          <span className="dot bg-gray-500 dark:bg-gray-300 rounded-full w-2 h-2 animate-bounce delay-150"></span>
          <span className="dot bg-gray-500 dark:bg-gray-300 rounded-full w-2 h-2 animate-bounce delay-300"></span>
          <span className="dot bg-gray-500 dark:bg-gray-300 rounded-full w-2 h-2 animate-bounce delay-450"></span>
        </div>
        <span className="mr-2 text-gray-600 dark:text-gray-300 select-none">در حال تایپ...</span>
      </div>
      <style>{`
        .typing-dots span {
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-450 {
          animation-delay: 0.45s;
        }
      `}</style>
    </div>
  );
}
