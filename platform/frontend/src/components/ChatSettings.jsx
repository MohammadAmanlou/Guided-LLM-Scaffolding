import { Drawer, Select, Slider, Divider, Switch, Button } from 'antd';
import { useChatUI } from '../contexts/ChatUIContext';
import {
  FontColorsOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
} from '@ant-design/icons';

const fontOptions = [
  { label: 'Vazirmatn', value: 'Vazirmatn' },
  { label: 'Tahoma', value: 'Tahoma' },
  { label: 'IRANSans', value: 'IRANSans' },
];

const bubbleColors = [
  '#4f46e5', '#16a34a', '#dc2626', '#f59e0b', '#0ea5e9', '#9333ea',
];

export default function ChatSettings({ onClose }) {
  const {
    font,
    fontSize,
    theme,
    userBubbleColor,
    aiBubbleColor,
    setFont,
    setFontSize,
    setTheme,
    setUserBubbleColor,
    setAiBubbleColor,
  } = useChatUI();

  return (
    <Drawer
      title="تنظیمات چت"
      placement="left"
      onClose={onClose}
      open={true}
      width={320}
    >
      <Divider orientation="right">
        <FontColorsOutlined /> فونت
      </Divider>
      <Select
        value={font}
        options={fontOptions}
        onChange={setFont}
        style={{ width: '100%' }}
      />

      <Divider orientation="right">
        <FontSizeOutlined /> اندازه متن
      </Divider>
      <Slider
        min={10}
        max={24}
        value={fontSize}
        onChange={setFontSize}
      />

      <Divider orientation="right">
        <BgColorsOutlined /> رنگ پیام کاربر
      </Divider>
      <div className="flex flex-wrap gap-2">
        {bubbleColors.map((color) => (
          <div
            key={color}
            onClick={() => setUserBubbleColor(color)}
            className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
              userBubbleColor === color ? 'border-black' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <Divider orientation="right">رنگ پیام LLM</Divider>
      <div className="flex flex-wrap gap-2">
        {bubbleColors.map((color) => (
          <div
            key={color}
            onClick={() => setAiBubbleColor(color)}
            className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
              aiBubbleColor === color ? 'border-black' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <Divider orientation="right">حالت شب</Divider>
      <Switch
        checked={theme === 'dark'}
        onChange={(val) => setTheme(val ? 'dark' : 'light')}
      />

      <div className="pt-6">
        <Button type="primary" block onClick={onClose}>
          بستن
        </Button>
      </div>
    </Drawer>
  );
}
