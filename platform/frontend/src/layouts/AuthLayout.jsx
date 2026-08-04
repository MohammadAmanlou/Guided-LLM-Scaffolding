import { Card, Typography } from 'antd';
const { Title, Text } = Typography;

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card
        className="w-full sm:max-w-md"
        dir="rtl"
        bordered={false}
        style={{
          borderRadius: '1rem',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
          padding: '2.5rem',
          backgroundColor: 'white',
        }}
      >
        <div className="text-center mb-6">
          <Title level={3} className="!text-gray-800">
            {title}
          </Title>
          <Text className="text-gray-600">{subtitle}</Text>
        </div>

        {children}
      </Card>
    </div>
  );
}
