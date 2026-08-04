import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const defaultMessages = [
  { id: 1, sender: 'llm', text: 'سلام! چطور می‌تونم کمکت کنم؟', time: '14:25' },
  { id: 2, sender: 'user', text: 'می‌خوام با LLM چت کنم.', time: '14:26' },
  { id: 3, sender: 'llm', text: 'خیلی خب، بپرس!', time: '14:27' },
];

export default function ChatWindow({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    setTimeout(() => {
      setMessages(defaultMessages);
    }, 500);
  }, [chatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = (newMessageText, file = null) => {
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: newMessageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setTyping(true);

    // شبیه‌سازی پاسخ LLM
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'llm',
        text: `پاسخ LLM به: "${newMessageText}"`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {typing && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
