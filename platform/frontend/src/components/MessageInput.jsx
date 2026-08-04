import React, { useState } from 'react';
import { UploadOutlined, SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message as antdMessage } from 'antd';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!text.trim() && fileList.length === 0) return;

    onSend(text.trim(), fileList[0]);
    setText('');
    setFileList([]);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      if (file.size > 5 * 1024 * 1024) {
        antdMessage.error('حداکثر حجم فایل ۵ مگابایت است');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false; 
    },
    fileList,
    onRemove: () => setFileList([]),
    multiple: false,
  };

  return (
    <div className="flex items-end gap-2">
      <Upload {...uploadProps}>
        <Button icon={<PaperClipOutlined />} />
      </Upload>

      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="پیامت را بنویس..."
        autoSize={{ minRows: 1, maxRows: 4 }}
        className="rounded-lg"
      />

      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={sendMessage}
        disabled={!text.trim() && fileList.length === 0}
      />
    </div>
  );
}
