import { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';
import { useAuthApi } from '../hooks/useAuthApi';
import AuthLayout from '../layouts/AuthLayout.jsx';

const { Text } = Typography;

export default function ChangePassword() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [form] = Form.useForm();

  const { changePassword } = useAuthApi();
  const navigate = useNavigate();

  useEffect(() => {
    const temp = localStorage.getItem('temp_user');
    if (temp) {
      setUsername(JSON.parse(temp).username);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const onFinish = async ({ old_password, new_password }) => {
    setLoading(true);
    setError(null);
    try {
      await changePassword(username, old_password, new_password);
      localStorage.removeItem('temp_user');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در تغییر رمز عبور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="تغییر رمز عبور" subtitle="لطفاً رمز عبور جدید خود را وارد کنید">
      {error && <Alert message={error} type="error" showIcon className="mb-4" closable />}
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label="رمز عبور فعلی"
          name="old_password"
          rules={[{ required: true, message: 'لطفاً رمز فعلی را وارد کنید' }]}
        >
          <Input.Password prefix={<LockOutlined />} size="large" />
        </Form.Item>

        <Form.Item
          label="رمز عبور جدید"
          name="new_password"
          rules={[
            { required: true, message: 'لطفاً رمز جدید را وارد کنید' },
            { min: 6, message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} size="large" />
        </Form.Item>

        <Form.Item
          label="تکرار رمز عبور جدید"
          name="confirm_password"
          dependencies={['new_password']}
          hasFeedback
          rules={[
            { required: true, message: 'لطفاً تکرار رمز عبور را وارد کنید' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('رمز عبور با تکرار آن یکسان نیست'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="rounded-md bg-gradient-to-r from-yellow-500 to-orange-500"
          >
            تغییر رمز عبور
          </Button>
        </Form.Item>
      </Form>

      <Text className="block text-center mt-6 text-gray-600">
        رمز را فراموش کرده‌اید؟ با{' '}
        <span className="text-blue-600 font-semibold">مدیر سیستم</span> تماس بگیرید.
      </Text>
    </AuthLayout>
  );
}
