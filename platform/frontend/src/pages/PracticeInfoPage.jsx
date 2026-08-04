import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Descriptions,
  Space,
  Typography,
  Spin,
  message,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { usePracticeApi } from '../hooks/usePracticeApi';
import { convertUtcToJalali, toPersianNumber } from '../utils/persianDate';
import { usePracticeContext } from '../contexts/PracticeContext.jsx';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const PracticeInfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPracticeById, startPractice } = usePracticeApi();

  const {
    practice,
    setPractice,
    startedAt,
    setStartedAt,
    PracticeStates,
    getPracticeState,
  } = usePracticeContext();

  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!practice || practice.id !== id) {
      getPracticeById(id)
        .then(({ data }) => {
          setPractice(data);
          if (data.startedAt) {
            setStartedAt(dayjs(data.startedAt));
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, practice]);

  const handleActionClick = async () => {
    const state = getPracticeState(practice, startedAt);

    if (state === PracticeStates.READY_TO_START) {
      try {
        await startPractice(id);
        const { data: updatedPractice } = await getPracticeById(id);
        setPractice(updatedPractice);
        if (updatedPractice.startedAt) {
          setStartedAt(dayjs(updatedPractice.startedAt));
        }
      } catch (err) {
        message.error('خطا در ثبت شروع تمرین');
        return;
      }
    }

    if (state === PracticeStates.TIME_OVER) {
      message.info('زمان مجاز برای این تمرین به پایان رسیده است.');
      return;
    }

    navigate(`/practice/${id}`);
  };

  const handleBack = () => {
    navigate('/PracticeList');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!practice) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Text type="danger">خطا در بارگذاری اطلاعات تمرین.</Text>
      </div>
    );
  }

  const isStarted = !!practice.startedAt || !!startedAt;
  const actualStartedAt = startedAt || (practice.startedAt && dayjs(practice.startedAt));
  const hasTimeLimit = isStarted && practice.expectedTime > 0;
  const expectedEndTime = hasTimeLimit ? actualStartedAt.add(practice.expectedTime, 'minute') : null;

  let actionLabel = '';
  let disableButton = false;

  const state = getPracticeState(practice, startedAt);

  if (state === PracticeStates.NOT_STARTED_YET)
  {
    actionLabel = 'زمان تمرین نرسیده';
    disableButton = true;
  }
  else if (state === PracticeStates.READY_TO_START)
  {
    actionLabel = 'شروع تمرین';
  }
  else if (state == PracticeStates.IN_PROGRESS)
  {
    actionLabel = 'ادامه تمرین';
  }
  else if (state === PracticeStates.ATTENDED)
  {
    actionLabel = 'شما در این تمرین شرکت کرده‌اید.'
    disableButton = true;
  }
  else if (state === PracticeStates.TIME_OVER)
  {
    actionLabel = 'مهلت شرکت در تمرین به پایان رسیده'
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
          بازگشت به لیست تمرین‌ها
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
          {practice.name}
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
            {convertUtcToJalali(practice.startTime)}
          </Descriptions.Item>
          <Descriptions.Item label="زمان پایان">
            {convertUtcToJalali(practice.endTime)}
          </Descriptions.Item>
          <Descriptions.Item label="مدت تمرین">
            {toPersianNumber(practice.expectedTime)} دقیقه
          </Descriptions.Item>
          <Descriptions.Item label="نمره کل">
            {toPersianNumber(practice.totalScore)}
          </Descriptions.Item>
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

export default PracticeInfoPage;
