import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Button, Tag, Spin } from 'antd';
import { useQuizApi } from '../hooks/useQuizApi';
import { useNavigate } from 'react-router-dom';
import { convertUtcToJalali, toPersianNumber } from '../utils/persianDate';
import {  useQuizContext } from '../contexts/QuizContext';
import dayjs from 'dayjs';

const QuizListPage = () => {
  const { getQuizState, QuizStates, startedAt,  resetQuizState  } = useQuizContext();
  const { getQuiz, downloadAnswerSheet } = useQuizApi();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 


  const handleDownloadAnswerSheet = async (quizId) => {
  try {
    const response = await downloadAnswerSheet(quizId);

    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;

    const contentDisposition = response.headers['content-disposition'];
    let filename = `quiz_${quizId}_answersheet.pdf`;
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
    getQuiz()
      .then(({ data }) => {setQuizzes(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStateLabel = (state) => {
    switch (state) {
      case QuizStates.NOT_STARTED_YET:
        return <Tag color="blue">زمان شرکت در آزمون نرسیده است.</Tag>;
      case QuizStates.READY_TO_START:
        return <Tag color="green">در انتظار شرکت در آزمون</Tag>;
      case QuizStates.IN_PROGRESS:
        return <Tag color="volcano">در حال انجام</Tag>;
      case QuizStates.ATTENDED:
        return <Tag color="red">شما قبلا در این آزمون شرکت کرده‌اید.</Tag>;
      case QuizStates.TIME_OVER:
        return <Tag color="default">مدت زمان شرکت در آزمون به پایان رسیده است.</Tag>;
      default:
        return null;
    }
  };

  return (
    <Card
      style={{ border: 'none', boxShadow: 'none' }}
      headStyle={{ borderBottom: 'none' }}
      title={<h1 className="text-2xl">آزمون‌ها</h1>}
    >
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 100 }}>
          <Spin size="large" />
          <Typography.Text style={{ display: 'block', marginTop: 16 }}>
            در حال بارگذاری آزمون‌ها...
          </Typography.Text>
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          style={{ gap: 16 }}
          dataSource={quizzes}
          renderItem={(quiz) => {
            const state = getQuizState(quiz, startedAt);
            const canEnter = state === QuizStates.READY_TO_START || state === QuizStates.IN_PROGRESS;

            return (
              <Card
                hoverable={canEnter}
                style={{
                  marginBottom: '16px',
                  opacity: canEnter ? 1 : 0.6,
                }}
                key={quiz.id}
              >
                <List.Item
                  onClick={() => {
                    if (canEnter) {
                      navigate(`/quizzes/${quiz.id}`);
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
                        {quiz.name}
                        {getStateLabel(state)}
                      </div>
                    }
                    description={`شروع: ${convertUtcToJalali(quiz.startTime)} | پایان: ${convertUtcToJalali(quiz.endTime)} | مدت: ${toPersianNumber(quiz.expectedTime)} دقیقه`}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row-reverse' }}>
                    <Typography.Text strong>
                      {quiz.userScore != null
                        ? `${toPersianNumber(quiz.totalScore)} / ${toPersianNumber(quiz.userScore)}`
                        : `${toPersianNumber(quiz.totalScore)} / -`}
                    </Typography.Text>
                    {state === QuizStates.TIME_OVER && (
                      <Button
                        type="link"
                        onClick={() => handleDownloadAnswerSheet(quiz.id)}
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

export default QuizListPage;
