import React from 'react';
import { useChatUI } from '../contexts/ChatUIContext';
import dayjs from 'dayjs';
import { splitByMath } from '../utils/splitByMath';

function cleanTextForDir(text) {
  // حذف کاراکترهای کنترل RTL/LTR (مثل \u200E, \u200F و ...)
  return text.replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim();
}
function detectRTL(text) {
  const cleaned = cleanTextForDir(text);
  const rtlChars = cleaned.match(/[\u0600-\u06FF]/g) || [];
  const ltrChars = cleaned.match(/[A-Za-z]/g) || [];

  if (rtlChars.length === 0 && ltrChars.length === 0) return false;

  return rtlChars.length / (rtlChars.length + ltrChars.length) > 0.3;
}

export default function ChatMessage({ message }) {
  const { userBubbleColor, aiBubbleColor, theme } = useChatUI();
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const isRTL = detectRTL(message.content);
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-2`}
      dir="ltr"  // اینجا ثابت بمونه که جای پیام عوض نشه
      style={{ animation: 'fadeInUp 0.35s ease forwards' }}
    >
      <div
        dir={isRTL ? 'rtl' : 'ltr'}  // جهت خود متن اینجا تنظیم میشه
        className={`max-w-[72%] p-4 rounded-3xl whitespace-pre-wrap break-words
          ${isUser
            ? 'text-white shadow-xl'
            : isSystem
            ? 'text-gray-500 dark:text-gray-400 italic'
            : 'text-gray-900 shadow-lg'}
          relative cursor-default
          transition-all duration-300 ease-in-out
          hover:shadow-2xl
        `}
        style={{
          backgroundColor: isUser
            ? userBubbleColor
            : isSystem
            ? 'transparent'
            : aiBubbleColor,
          border: isSystem ? '1.5px solid #bbb' : 'none',
          fontFamily: "'Vazirmatn', sans-serif",
          borderTopRightRadius: isUser ? '0.6rem' : '1.8rem',
          borderTopLeftRadius: isUser ? '1.8rem' : '0.6rem',
          userSelect: 'text',
          backdropFilter: theme === 'dark' && !isSystem ? 'blur(8px)' : undefined,
          WebkitBackdropFilter: theme === 'dark' && !isSystem ? 'blur(8px)' : undefined,
        }}
        title={dayjs(message.timestamp).format('YYYY/MM/DD HH:mm:ss')}
      >
        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          {splitByMath(message.content)}
        </div>

        {message.files && message.files.length > 0 && (
          <div className="mt-4 space-y-3">
            {message.files.map((file, idx) => (
              <FilePreview key={idx} file={file} />
            ))}
          </div>
        )}

        <div
          className={`text-[11px] ${
            isUser ? 'text-white/80' : 'text-black-500 dark:text-black-400'
          } mt-3 text-left select-none`}
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        >
          {dayjs(message.timestamp).format('HH:mm')}
        </div>
      </div>
    </div>
  );
}

function FilePreview({ file }) {
  const url = typeof file === 'string' ? file : URL.createObjectURL(file);

  const isImage = file.type
    ? file.type.startsWith('image/')
    : /\.(png|jpg|jpeg|gif)$/i.test(file.name || '');

  if (isImage) {
    return (
      <img
        src={url}
        alt={file.name || 'image'}
        className="max-w-full rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-110 hover:shadow-2xl shadow-md"
        onClick={() => window.open(url, '_blank')}
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline break-all transition-colors duration-300 hover:text-blue-700"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      {file.name || 'فایل'}
    </a>
  );
}
