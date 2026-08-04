import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Button, Tag, Spin } from 'antd';
import { usePracticeApi } from '../hooks/usePracticeApi';
import { useNavigate } from 'react-router-dom';
import { convertUtcToJalali, toPersianNumber } from '../utils/persianDate';
import { usePracticeContext } from '../contexts/PracticeContext';
import dayjs from 'dayjs';

const PracticeListPage = () => {
  const { getPracticeState, PracticeStates, startedAt, resetPracticeState  } = usePracticeContext();
  const { getPractices, downloadAnswerSheet } = usePracticeApi();
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();




const handleDownloadAnswerSheet = async (practiceId) => {
  try {
    const response = await downloadAnswerSheet(practiceId);

    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;

    const contentDisposition = response.headers['content-disposition'];
    let filename = `practice_${practiceId}_answersheet.pdf`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match.length > 1) {
        filename = match[1];
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download the answer sheet:", error);
  }
};


  useEffect(() => {
    getPractices()
      .then(({ data }) => {setPractices(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStateLabel = (state) => {
    switch (state) {
      case PracticeStates.NOT_STARTED_YET:
        return <Tag color="blue">زمان شرکت در تمرین نرسیده است.</Tag>;
      case PracticeStates.READY_TO_START:
        return <Tag color="green">در انتظار شرکت در تمرین</Tag>;
      case PracticeStates.IN_PROGRESS:
        return <Tag color="volcano">در حال انجام</Tag>;
      case PracticeStates.ATTENDED:
        return <Tag color="red">شما قبلا در این تمرین شرکت کرده‌اید.</Tag>;
      case PracticeStates.TIME_OVER:
        return <Tag color="default">مدت زمان شرکت در تمرین به پایان رسیده است.</Tag>;
      default:
        return null;
    }
  };

  return (
    <Card
      style={{ border: 'none', boxShadow: 'none' }}
      headStyle={{ borderBottom: 'none' }}
      title={<h1 className="text-2xl">تمرین‌ها</h1>}
    >
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 100 }}>
          <Spin size="large" />
          <Typography.Text style={{ display: 'block', marginTop: 16 }}>
            در حال بارگذاری تمرین‌ها...
          </Typography.Text>
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          style={{ gap: 16 }}
          dataSource={practices}
          renderItem={(practice) => {
            const state = getPracticeState(practice, startedAt);
            const canEnter = state === PracticeStates.READY_TO_START || state === PracticeStates.IN_PROGRESS;

            return (
              <Card
                hoverable={canEnter}
                style={{
                  marginBottom: '16px',
                  opacity: canEnter ? 1 : 0.6,
                }}
                key={practice.id}
              >
                <List.Item
                  onClick={() => {
                    if (canEnter) {
                      navigate(`/PracticeInfo/${practice.id}`);
                    }
                  }}
                  style={{
                    padding: 8,
                    marginBottom: 8,
                    cursor: canEnter ? 'pointer' : 'default',
                  }}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {practice.name}
                        {getStateLabel(state)}
                      </div>
                    }
                    description={`شروع: ${convertUtcToJalali(practice.startTime)} | پایان: ${convertUtcToJalali(practice.endTime)} | مدت: ${toPersianNumber(practice.expectedTime)} دقیقه`}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row-reverse' }}>
                    <Typography.Text strong>
                      {practice.userScore != null
                        ? `${toPersianNumber(practice.totalScore)} / ${toPersianNumber(practice.userScore)}`
                        : `${toPersianNumber(practice.totalScore)} / -`}
                    </Typography.Text>
                    {state === PracticeStates.TIME_OVER && (
                      <Button
                        type="link"
                        onClick={() => handleDownloadAnswerSheet(practice.id)}
                        target="_blank"
                      >
                        دریافت پاسخنامه
                      </Button>
                    )}
                  </div>
                </List.Item>
              </Card>
            );
          }}
        />
      )}
    </Card>
  );
};

export default PracticeListPage;
