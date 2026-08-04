import axiosInstance from '../services/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

export const useChatApi = () => {
  const { user } = useAuth();

  return {
    // بررسی دسترسی کاربر به چت‌بات
    checkAccess: () =>
      axiosInstance.post('api/chatbot/access', {
        userId: user.username,
      }),

    // گرفتن تاریخچه چت
    getHistory: () =>
      axiosInstance.post('api/chatbot/history', {
        userId: user.username,
        // limit: 5,
        // offset: 4
      }),

    // ارسال پیام جدید
    sendMessage: (formData) =>
      axiosInstance.post('api/chatbot/send', formData),
  };
};
