import React, { useState, useRef } from 'react';
import { useChatUI } from '../contexts/ChatUIContext';

export default function ChatInput({ onSend, disabled }) {
  const { theme } = useChatUI();
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!message.trim() && files.length === 0) return;
    onSend(message.trim(), files);
    setMessage('');
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = null; // reset input
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`p-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-lg flex flex-col`} 
      style={{ fontFamily: 'Vazirmatn, sans-serif' }}
    >
      {/* فایل‌های انتخاب شده */}
      {files.length > 0 && (
        <div className="flex space-x-3 rtl:space-x-reverse mb-3 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
          {files.map((file, i) => (
            <div
              key={i}
              className="relative flex items-center space-x-2 rtl:space-x-reverse bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 shadow-sm min-w-max"
            >
              <div className="text-sm font-semibold truncate max-w-xs" title={file.name}>
                {file.name}
              </div>
              <button
                onClick={() => removeFile(i)}
                type="button"
                className="text-red-500 hover:text-red-700 transition-colors duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 w-5 h-5 flex items-center justify-center"
                aria-label="حذف فایل"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ورودی و دکمه‌ها */}
      <div className="flex items-center space-x-3 rtl:space-x-reverse" dir='rtl'>
        

        {/* دکمه ارسال به صورت آیکون فلش */}
        <button
          onClick={handleSend}
          disabled={disabled}
          aria-label="ارسال پیام"
          className={`flex items-center justify-center w-12 h-12 rounded-full
            bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200 shadow-lg`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>


        {/* آیکون آپلود */}
        {/* <label
          htmlFor="file-upload"
          className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
          title="آپلود فایل یا عکس"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.172 7l-6.586 6.586a2 2 0 11-2.828-2.828l6.414-6.414a4 4 0 015.656 5.656l-6.414 6.414a6 6 0 11-8.485-8.485l6.414-6.414"
            />
          </svg>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
            accept="image/*,application/pdf,text/plain"
          />
        </label> */}

        
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="پیام خود را تایپ کنید..."
          rows={2}
          disabled={disabled}
          className={`flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-700
            p-3 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200`}
          style={{ fontFamily: 'Vazirmatn, sans-serif' }}
        />
      </div>
    </div>
  );
}
