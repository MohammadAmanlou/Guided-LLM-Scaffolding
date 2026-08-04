import React, { useEffect, useState } from 'react';
import { Card, Button, Descriptions, Space, Typography, Spin, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useQuizApi } from '../hooks/useQuizApi.js';
import { convertUtcToJalali, toPersianNumber } from '../utils/persianDate';
import { useQuizContext } from '../contexts/QuizContext.jsx';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const QuizInfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getQuizById, startQuiz } = useQuizApi();

  const { quiz, setQuiz, startedAt, setStartedAt, QuizStates, getQuizState } = useQuizContext();

  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!quiz || quiz.id !== id) {
      getQuizById(id)
        .then(({ data }) => {
          setQuiz(data);
          if (data.startedAt) {
            setStartedAt(dayjs(data.startedAt));
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, quiz]);

  const handleActionClick = async () => {
    const state = getQuizState(quiz, startedAt);

    if (state === QuizStates.READY_TO_START) {
      try {
        await startQuiz(id);
        const { data: updatedQuiz } = await getQuizById(id);
        setQuiz(updatedQuiz);
        if (updatedQuiz.startedAt) {
          setStartedAt(dayjs(updatedQuiz.startedAt));
        }
      } catch (err) {
        message.error('خطا در ثبت شروع آزمون');
        return;
      }
    }

    if (state === QuizStates.TIME_OVER) {
      message.info('زمان مجاز برای این آزمون به پایان رسیده است.');
      return;
    }

    navigate(`/quizzes/${id}/attend`);
  };

  const handleBack = () => {
    navigate('/quizzes');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Text type="danger">خطا در بارگذاری اطلاعات آزمون.</Text>
      </div>
    );
  }

  const isStarted = !!quiz.startedAt || !!startedAt;
  const actualStartedAt = startedAt || (quiz.startedAt && dayjs(quiz.startedAt));
  const hasTimeLimit = isStarted && quiz.expectedTime > 0;
  const expectedEndTime = hasTimeLimit ? actualStartedAt.add(quiz.expectedTime, 'minute') : null;

  let actionLabel = '';
  let disableButton = false;

  const state = getQuizState(quiz, startedAt);

  if (state === QuizStates.NOT_STARTED_YET) {
    actionLabel = 'زمان آزمون نرسیده';
    disableButton = true;
  } else if (state === QuizStates.READY_TO_START) {
    actionLabel = 'شروع آزمون';
  } else if (state == QuizStates.IN_PROGRESS) {
    actionLabel = 'ادامه آزمون';
  } else if (state === QuizStates.ATTENDED) {
    actionLabel = 'شما در این آزمون شرکت کرده‌اید.';
    disableButton = true;
  } else if (state === QuizStates.TIME_OVER) {
    actionLabel = 'مهلت شرکت در آزمون به پایان رسیده';
    disableButton = true;
  }

  const getRemainingTimeString = () => {
    if (!hasTimeLimit || !expectedEndTime) return null;
    const duration = expectedEndTime.diff(now, 'second');
    if (duration <= 0) return '00:00:00';

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <Card
      style={{
        maxWidth: 600,
        margin: '40px auto',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleBack}>
          بازگشت به لیست آزمون‌ها
        </Button>

        {hasTimeLimit && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#d4380d',
            }}
          >
            زمان باقی‌مانده: {getRemainingTimeString()}
          </div>
        )}

        <Title level={3} style={{ marginBottom: 0 }}>
          {quiz.name}
        </Title>

        <Descriptions
          column={1}
          size="middle"
          layout="horizontal"
          style={{
            backgroundColor: '#fafafa',
            padding: '12px',
            borderRadius: 8,
          }}
        >
          <Descriptions.Item label="زمان شروع">
            {convertUtcToJalali(quiz.startTime)}
          </Descriptions.Item>
          <Descriptions.Item label="زمان پایان">
            {convertUtcToJalali(quiz.endTime)}
          </Descriptions.Item>
          <Descriptions.Item label="مدت آزمون">
            {toPersianNumber(quiz.expectedTime)} دقیقه
          </Descriptions.Item>
          <Descriptions.Item label="نمره کل">{toPersianNumber(quiz.totalScore)}</Descriptions.Item>
          {isStarted && (
            <Descriptions.Item label="زمان شروع شما">
              {convertUtcToJalali(actualStartedAt.toISOString())}
            </Descriptions.Item>
          )}
          {hasTimeLimit && expectedEndTime && (
            <Descriptions.Item label="زمان پایان مجاز شما">
              {convertUtcToJalali(expectedEndTime.toISOString())}
            </Descriptions.Item>
          )}
        </Descriptions>

        <Button
          type="primary"
          size="large"
          onClick={handleActionClick}
          block
          disabled={disableButton}
        >
          {actionLabel}
        </Button>
      </Space>
    </Card>
  );
};

export default QuizInfoPage;
