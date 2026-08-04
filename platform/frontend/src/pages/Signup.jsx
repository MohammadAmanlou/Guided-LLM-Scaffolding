import { Form, Input, Button, Alert, Typography, Select } from 'antd';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { UserAddOutlined, LockOutlined } from '@ant-design/icons';
import AuthLayout from '../layouts/AuthLayout.jsx';

const { Text } = Typography;

export default function Signup() {
  const { signup, loading, error, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/videos');
  }, [user, navigate]);

  const onFinish = ({username, password, first_name, last_name, role}) => {
    signup(username, password, first_name, last_name, role);
  };

  return (
    <AuthLayout title="ایجاد حساب کاربری" subtitle="فرم ثبت‌نام برای کاربران جدید">
      {error && <Alert message={error} type="error" showIcon className="mb-4" closable />}

      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="نام کاربری"
          name="username"
          rules={[{ required: true, message: 'لطفاً نام کاربری را وارد کنید' }]}
        >
          <Input prefix={<UserAddOutlined />} size="large" />
        </Form.Item>

        <Form.Item
          label="رمز عبور"
          name="password"
          rules={[{ required: true, message: 'لطفاً رمز عبور را وارد کنید' }]}
        >
          <Input.Password prefix={<LockOutlined />} size="large" />
        </Form.Item>

        <Form.Item
          label="نام"
          name="first_name"
          rules={[{ required: true, message: 'لطفاً نام را وارد کنید' }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="نام خانوادگی"
          name="last_name"
          rules={[{ required: true, message: 'لطفاً نام خانوادگی را وارد کنید' }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="نقش"
          name="role"
          rules={[{ required: true, message: 'لطفاً نقش را انتخاب کنید' }]}
        >
          <Select size="large">
            <Select.Option value="normal-student">دانشجوی معمولی</Select.Option>
            <Select.Option value="restricted-student">دانشجوی محدود</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            ثبت‌نام
          </Button>
        </Form.Item>
      </Form>

      <Text className="block text-center mt-6 text-gray-600">
        حساب دارید؟{' '}
        <Link to="/login" className="text-purple-600 font-semibold hover:underline">
          وارد شوید
        </Link>
      </Text>
    </AuthLayout>
  );
}
