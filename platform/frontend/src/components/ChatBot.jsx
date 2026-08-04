// components/ChatBot.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChatApi } from '../hooks/useChatApi';
import { useChatUI } from '../contexts/ChatUIContext';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import ChatSettings from './ChatSettings';
import ChatHeader from './ChatHeader';
import { Alert, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

export default function ChatBot() {
    const { user } = useAuth();
    const { checkAccess, getHistory, sendMessage } = useChatApi();
    const { theme, font, fontSize } = useChatUI();

    const [status, setStatus] = useState('checking'); // checking | denied | error | ready
    const [messages, setMessages] = useState([]);
    const [loadingReply, setLoadingReply] = useState(false);
    const [error, setError] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const initChat = async () => {
            try {
                setStatus('checking');
                const accessRes = await checkAccess();
                if (!accessRes.data.allowed) {
                    setStatus('denied');
                    return;
                }
                const historyRes = await getHistory();
                setMessages(historyRes.data.messages || []);
                setStatus('ready');
            } catch (err) {
                setStatus('error');
                setError('❌ خطا در ارتباط با سرور');
            }
        };
        initChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loadingReply]);

    const handleSend = async (content, files) => {
        if (!content.trim() && (!files || files.length === 0)) return;

        const newUserMessage = {
            id: Date.now(),
            role: 'user',
            content,
            files,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setLoadingReply(true);

        try {
            const formData = new FormData();
            formData.append('message', content);
            formData.append('userId', user.username);
            if (files) {
                Array.from(files).forEach((file) => formData.append('files', file));
            }

            const res = await sendMessage(formData);

            const aiMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: res.data.reply,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, aiMessage]);
            setError(null);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 2,
                    role: 'system',
                    content: '❌ خطا در دریافت پاسخ از سرور.',
                    timestamp: new Date().toISOString(),
                },
            ]);
            setError('خطا در ارتباط با سرور');
        } finally {
            setLoadingReply(false);
        }
    };

    return (
        <div
            className={`flex flex-col p-4 relative max-h-full w-full 
            ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}
            rounded-lg shadow-lg
          `}
            style={{
                fontFamily: font,
                fontSize: `${fontSize}px`,
                background: theme === 'dark'
                    ? 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)'
                    : 'linear-gradient(135deg, #f0f4f8, rgb(173, 188, 205))',
                height: '100%',
            }}
        >
            {status === 'checking' && (
                <Alert message="⏳ در حال بررسی دسترسی..." type="info" showIcon className="my-4" />
            )}
            {status === 'denied' && (
                <Alert
                    message="❌ شما در این بازه دسترسی به چت ندارید."
                    type="error"
                    showIcon
                    className="my-4"
                />
            )}
            {status === 'error' && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    className="my-4"
                />
            )}

            {status === 'ready' && (
                <>
                    <ChatHeader onOpenSettings={setSettingsOpen} />
                    <div
                        className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                        style={{ scrollbarWidth: 'thin', maxHeight: 'calc(100% - 130px)' }}
                    >
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}

                        {loadingReply && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    <ChatInput onSend={handleSend} disabled={loadingReply} />
                </>
            )}

            {settingsOpen && <ChatSettings onClose={() => setSettingsOpen(false)} />}
        </div>
    );
}
