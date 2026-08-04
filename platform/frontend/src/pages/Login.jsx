import { Form, Input, Button, Alert, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import AuthLayout from '../layouts/AuthLayout.jsx';

const { Text } = Typography;

export default function Login() {
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/videos');
  }, [user, navigate]);

  const onFinish = ({ username, password }) => {
    login(username, password);
  };

  return (
    <AuthLayout title="خوش‌آمدید 👋" subtitle="لطفاً وارد حساب خود شوید">
      {error && <Alert message={error} type="error" showIcon className="mb-4" closable />}

      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="نام کاربری"
          name="username"
          rules={[{ required: true, message: 'لطفاً نام کاربری را وارد کنید' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="نام کاربری خود را وارد کنید"
            size="large"
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          label="رمز عبور"
          name="password"
          rules={[{ required: true, message: 'لطفاً رمز عبور را وارد کنید' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="رمز عبور خود را وارد کنید"
            size="large"
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="rounded-md bg-gradient-to-l from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
          >
            ورود
          </Button>
        </Form.Item>
      </Form>

      {/* <Text className="block text-center mt-6 text-gray-600">
        حساب کاربری ندارید؟{' '}
        <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
          ثبت‌نام
        </Link>
      </Text> */}
    </AuthLayout>
  );
}
