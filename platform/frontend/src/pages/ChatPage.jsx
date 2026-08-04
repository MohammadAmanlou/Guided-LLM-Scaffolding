import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChatApi } from '../hooks/useChatApi';
import { useChatUI } from '../contexts/ChatUIContext';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import ChatInput from '../components/ChatInput';
import ChatSettings from '../components/ChatSettings';
import ChatHeader from '../components/ChatHeader';
import { Alert, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

export default function ChatPage() {
    const { user } = useAuth();
    const { checkAccess, getHistory, sendMessage } = useChatApi();
    const { theme, font, fontSize } = useChatUI();

    const [status, setStatus] = useState('checking'); // وضعیت دسترسی: checking | denied | error | ready
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

    // اسکرول خودکار به پایین وقتی پیام تغییر میکنه یا در حال تایپ
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
            const errorMessage = err?.response?.data?.error;

            if (errorMessage === 'No active practice found') {
                setStatus('denied');
                setError('❌ شما در این بازه دسترسی به چت ندارید.');
                return;
            }

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
            className={`mx-auto flex flex-col p-4 relative max-h-[calc(100vh-16vh)] w-full 
        ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}
        rounded-lg shadow-lg
      `}
            style={{
                fontFamily: font,
                fontSize: `${fontSize}px`,
                height: 'calc(100vh - 6rem)',
                background: theme === 'dark'
                    ? 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)'
                    : 'linear-gradient(135deg, #f0f4f8,rgb(173, 188, 205))',
            }}
        >
            {/* هدر چت */}
            {/* <div className="sticky top-0 z-20 bg-inherit border-b border-gray-300 dark:border-gray-700 flex items-center justify-between px-2 py-3">
        <ChatHeader />
        <Button
          type="text"
          icon={<SettingOutlined style={{ fontSize: '20px' }} />}
          onClick={() => setSettingsOpen(true)}
          className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          aria-label="باز کردن تنظیمات"
        />
      </div> */}

            {/* وضعیت دسترسی */}
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

            {/* چت اصلی */}
            {status === 'ready' && (
                <>
                    <ChatHeader onOpenSettings={setSettingsOpen} />
                    <div
                        className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                        style={{ scrollbarWidth: 'thin' }}
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

            {/* پنل تنظیمات */}
            {settingsOpen && <ChatSettings onClose={() => setSettingsOpen(false)} />}
        </div>
    );
}
