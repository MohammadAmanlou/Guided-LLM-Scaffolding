import React from 'react';
import { Button } from 'antd';
import { SettingOutlined, MessageOutlined } from '@ant-design/icons';

const dummyChats = [
    { id: 'chat1', title: 'مکالمه اول' },
    { id: 'chat2', title: 'مکالمه با LLM' },
    { id: 'chat3', title: 'تمرین‌های قبلی' },
];

export default function ChatSidebar({ onSelect, onOpenSettings }) {


    const handleNewChat = async () => {
        try {
            const res = await fetch('/api/chats', {
                method: 'POST',
            });
            const data = await res.json();
            onSelect(data.id);
        } catch (err) {
            console.error('خطا در ایجاد چت جدید:', err);
        }
    };

    return (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">گفتگوها</h2>
                <Button
                    icon={<SettingOutlined />}
                    onClick={onOpenSettings}
                    shape="circle"
                    type="text"
                />
            </div>


            <Button
                block
                type="dashed"
                className="mb-4"
                onClick={handleNewChat}
            >
                چت جدید
            </Button>

            <div className="flex-1 overflow-y-auto space-y-2">
                {dummyChats.map(chat => (
                    <Button
                        key={chat.id}
                        icon={<MessageOutlined />}
                        block
                        className="text-right"
                        onClick={() => onSelect(chat.id)}
                    >
                        {chat.title}
                    </Button>
                ))}
            </div>
        </div>
    );
}
