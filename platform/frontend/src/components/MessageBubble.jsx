import React from 'react';
import { Tooltip } from 'antd';

export default function MessageBubble({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Tooltip title={message.time}>
        <div
          className={`max-w-[80%] px-4 py-2 rounded-xl shadow text-sm whitespace-pre-line transition-all duration-200
            ${isUser
              ? 'bg-[color:var(--user-bubble-color)] text-white rounded-br-none'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
            }`}
        >
          {message.text}
        </div>
      </Tooltip>
    </div>
  );
}
