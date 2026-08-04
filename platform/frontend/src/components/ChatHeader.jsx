import { SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export default function ChatHeader({ onOpenSettings }) {
  return (
    <div className="absolute top-5 left-5 z-10">
      <Button
        type="primary"
        shape="circle"
        icon={<SettingOutlined />}
        size="large"
        onClick={onOpenSettings}
        title="تنظیمات چت"
      />
    </div>
  );
}
