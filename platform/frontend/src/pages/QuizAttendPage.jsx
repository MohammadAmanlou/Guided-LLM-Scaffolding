import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Card,
  Upload,
  Typography,
  Space,
  Spin,
  message,
  Modal,
  Progress
} from 'antd';
import {
  CheckOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuizApi } from '../hooks/useQuizApi';
import { useQuizContext } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const QuizAttendPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getQuizById, uploadAnswer, finalizeQuiz, getPracticeQuestions } = useQuizApi();

  const {
    quiz,
    setQuiz,
    startedAt,
    setStartedAt,
    answer,
    registerAnswer,
    resetQuizState,
    getQuizState,
    QuizStates,
  } = useQuizContext();

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const hasRedirected = useRef(false);

  const formatTime = (seconds) => {
    const pad = (n) => n.toString().padStart(2, '0');
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getQuizById(id);
        const fetchedQuiz = response.data;
        setQuiz(fetchedQuiz);

        const state = getQuizState(fetchedQuiz, startedAt);
        if (state !== QuizStates.IN_PROGRESS) {
          if (!hasRedirected.current) {
            hasRedirected.current = true;
            message.warning('شما مجاز به شرکت در این آزمون نیستید.');
            navigate('/QuizList', { replace: true });
          }
          return;
        }

        if (!startedAt) setStartedAt(dayjs());
      } catch (err) {
        message.error('خطا در دریافت اطلاعات آزمون');
        navigate('/quizzes', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!quiz || !startedAt) return;

    const expectedEnd = startedAt.add(quiz.expectedTime, 'minute');

    const update = () => {
      const diff = Math.max(0, Math.floor(expectedEnd.diff(dayjs(), 'second')));
      setTimeLeft(diff);

      if (diff <= 0) {
        handleAutoFinalize();
      }
    };

    update();

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [quiz, startedAt]);

  const handleAutoFinalize = async () => {
    try {
      const formData = new FormData();
      formData.append('files', answer);
      formData.append('userId', user.username);
      await finalizeQuiz(id, formData);
      resetQuizState();
      message.info('مهلت آزمون به پایان رسید. آزمون شما ثبت شد.');
      navigate('/QuizList');
    } catch {
      message.error('خطا در ثبت خودکار آزمون');
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      if (!file || !file.name || file.size === 0) {
        throw new Error('فایل نامعتبر است یا دریافت نشده است.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.username);

      await uploadAnswer(id, formData, (event) => {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      });

      registerAnswer(file);
      onSuccess("ok");
      message.success('پاسخ با موفقیت ثبت شد');
    } catch (err) {
      console.log(err);
      console.error('❌ Upload error:', err);
      message.error('خطا در آپلود فایل');
      onError(err);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const handleFinalize = () => {
    Modal.confirm({
      title: 'آیا مطمئن هستید؟',
      content: 'پس از ثبت نهایی امکان ویرایش پاسخ‌ها وجود ندارد.',
      okText: 'بله، ثبت نهایی',
      cancelText: 'خیر',
      onOk: async () => {
        try {
          const formData = new FormData();
          formData.append('files', answer);
          formData.append('userId', user.username);
          await finalizeQuiz(id, formData);
          resetQuizState();
          message.success('آزمون با موفقیت ثبت شد');
          navigate('/QuizList');
        } catch(err) {
	  console.log(err)
          message.error('خطا در ثبت نهایی آزمون');
        }
      },
    });
  };

  const handleDownloadQuestion = async () => {
  try {
    const response = await getPracticeQuestions(id); // مستقیماً از useParams

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream'
    });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;

    let filename = `quiz_${id}_questions.pdf`;
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=(['"]?)([^'"\n]*)\1?/);
      if (match && match[2]) {
        filename = decodeURIComponent(match[2]);
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('❌ خطا در دانلود فایل سوالات:', error);
    message.error('دانلود سوالات با خطا مواجه شد');
  }
};


  if (loading || !quiz) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card style={{ maxWidth: 600, margin: '40px auto', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {timeLeft !== null && (
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#d4380d', textAlign: 'center' }}>
            زمان باقی‌مانده: {formatTime(timeLeft)}
          </Text>
        )}

        <Title level={4}>آزمون</Title>

        <Button icon={<DownloadOutlined />} block onClick={handleDownloadQuestion}>
          دانلود سوالات آزمون
        </Button>

        <Upload customRequest={handleUpload} showUploadList={false} disabled={uploading}>
          <Button loading={uploading} block>
            {answer ? `تغییر پاسخ (${answer})` : 'بارگذاری پاسخ‌نامه'}
          </Button>
        </Upload>

        {uploading && (
          <Progress
            percent={uploadProgress}
            status="active"
            strokeColor="#16ff22ff"
            style={{ marginTop: 16 }}
          />
        )}

        <Button type="primary" danger icon={<CheckOutlined />} onClick={handleFinalize} block>
          ثبت نهایی آزمون
        </Button>
      </Space>
    </Card>
  );
};

export default QuizAttendPage;
