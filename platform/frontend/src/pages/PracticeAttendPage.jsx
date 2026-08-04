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
  Drawer,
  Progress
} from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CheckOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { usePracticeApi } from '../hooks/usePracticeApi';
import { usePracticeContext } from '../contexts/PracticeContext';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';
import ChatBot from '../components/ChatBot';

const { Title, Text } = Typography;

const PracticeAttendPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPracticeById, getPracticeQuestions, uploadAnswer, finalizePractice } = usePracticeApi();

  const {
    practice,
    setPractice,
    startedAt,
    setStartedAt,
    questions,
    setQuestions,
    currentIndex,
    setCurrentIndex,
    answers,
    registerAnswer,
    resetPracticeState,
    PracticeStates,
    getPracticeState,
  } = usePracticeContext();

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
        const response = await getPracticeById(id);
        const fetchedPractice = response.data;
        setPractice(fetchedPractice);

        const state = getPracticeState(fetchedPractice, startedAt);
        if (state !== PracticeStates.IN_PROGRESS) {
          if (!hasRedirected.current) {
            hasRedirected.current = true;
            message.warning('شما مجاز به شرکت در این تمرین نیستید.');
            navigate('/PracticeList', { replace: true });
          }
          return;
        }

        if (!startedAt) setStartedAt(dayjs());

        const questionsResp = await getPracticeQuestions(id);
        setQuestions(questionsResp.data.questions);
        const savedIndex = localStorage.getItem('currentIndex');
        const lastIndex = savedIndex !== null ? Number(savedIndex) : (questionsResp.data.lastQuestionIndex ?? 0);
        setCurrentIndex(lastIndex);

      } catch (err) {
        message.error('خطا در دریافت اطلاعات تمرین');
        navigate('/PracticeList', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!practice || !startedAt) return;

    const expectedEnd = startedAt.add(practice.expectedTime, 'minute');

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
  }, [practice, startedAt]);

  const handleAutoFinalize = async () => {
    try {
      const formData = new FormData();
      formData.append('files', answers);
      formData.append('userId', user.username);
      await finalizePractice(id, formData);
      resetPracticeState();
      message.info('مهلت تمرین به پایان رسید. تمرین شما ثبت شد.');
      navigate('/PracticeList');
    } catch {
      message.error('خطا در ثبت خودکار تمرین');
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
      formData.append('questionId', questions[currentIndex].id);
      formData.append('userId', user.username);

      await uploadAnswer(id, formData, (event) => {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      });

      registerAnswer(questions[currentIndex].id, file);
      onSuccess("ok");
      message.success('پاسخ با موفقیت ثبت شد');
    } catch (err) {
      console.error('❌ Upload error:', err);
      message.error('خطا در آپلود فایل');
      onError(err);
    } finally {
      setUploading(false);
      
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const handlePrev = () => setCurrentIndex((prev) => prev - 1);
  const handleNext = () => setCurrentIndex((prev) => prev + 1);

  const handleFinalize = () => {
    Modal.confirm({
      title: 'آیا مطمئن هستید؟',
      content: 'پس از ثبت نهایی امکان ویرایش پاسخ‌ها وجود ندارد.',
      okText: 'بله، ثبت نهایی',
      cancelText: 'خیر',
      onOk: async () => {
        try {
          const formData = new FormData();
          formData.append('files', answers);
          formData.append('userId', user.username);
          await finalizePractice(id, formData);
          resetPracticeState();
          message.success('تمرین با موفقیت ثبت شد');
          navigate('/PracticeList');
        } catch {
          message.error('خطا در ثبت نهایی تمرین');
        }
      },
    });
  };

  const handleReview = () => {
    navigate('/practice/review');
  };

  if (loading || !practice || questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <>
      <Card style={{ maxWidth: 600, margin: '40px auto', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {timeLeft !== null && (
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#d4380d', textAlign: 'center' }}>
              زمان باقی‌مانده: {formatTime(timeLeft)}
            </Text>
          )}

          <Title level={4}>سوال {currentIndex + 1}</Title>

          <img
            src={question.imageUrl}
            alt={`سوال ${currentIndex + 1}`}
            style={{ width: '100%', borderRadius: 8 }}
          />

          <Upload customRequest={handleUpload} showUploadList={false} disabled={uploading}>
            <Button loading={uploading} block>
              {answers[question.id] ? `تغییر پاسخ (${answers[question.id]})` : 'بارگذاری پاسخ'}
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

          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button onClick={handlePrev} disabled={currentIndex === 0} icon={<RightOutlined />}>
              قبلی
            </Button>

            <Button onClick={handleReview} icon={<SearchOutlined />}>
              مرور پاسخ‌ها
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button type="primary" onClick={handleNext} icon={<LeftOutlined />}>
                بعدی
              </Button>
            ) : (
              <Button type="primary" danger icon={<CheckOutlined />} onClick={handleFinalize}>
                ثبت نهایی
              </Button>
            )}
          </Space>
        </Space>
      </Card>

      <Button
        type="primary"
        onClick={() => setDrawerOpen(true)}
        style={{
          position: 'fixed',
          bottom: 120,
          right: 0,
          zIndex: 1000,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          padding: '0 12px',
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1677ff',
          color: 'white',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.padding = '0 24px';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.padding = '0 12px';
        }}
      >
        🤖 چت با LLM
      </Button>

      <Drawer
        title="🤖 چت با LLM"
        placement="right"
        width={400}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0, height: '100%' }}
      >
        <ChatBot />
      </Drawer>
    </>
  );
};

export default PracticeAttendPage;
