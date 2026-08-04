import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Typography, Button, Space, Tag, Row, Col } from 'antd';
import { usePracticeContext } from '../contexts/PracticeContext';
import { CheckOutlined, CloseOutlined, FileImageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PracticeReviewPage = () => {
  const navigate = useNavigate();
  const {
    questions,
    answers,
    setCurrentIndex,
    practice
  } = usePracticeContext();

  const handleBackToQuestion = (index) => {
    setCurrentIndex(index);
    navigate(`/practice/${practice.id}`);
  };

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const unanswered = total - answered;
  const percent = Math.round((answered / total) * 100);

  return (
    <Card
      style={{ maxWidth: 700, margin: '40px auto', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={3}>مرور پاسخ‌ها پیش از ثبت نهایی</Title>

        <Row gutter={16} justify="center">
          <Col><Tag color="blue">تعداد کل سوال‌ها: {total}</Tag></Col>
          <Col><Tag color="green">پاسخ داده شده: {answered}</Tag></Col>
          <Col><Tag color="red">بی‌پاسخ: {unanswered}</Tag></Col>
          <Col><Tag color="gold">درصد تکمیل: {percent}%</Tag></Col>
        </Row>

        <List
          itemLayout="horizontal"
          dataSource={questions}
          renderItem={(q, index) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => handleBackToQuestion(index)}>
                  ویرایش
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<FileImageOutlined style={{ fontSize: 24 }} />}
                title={`سوال ${index + 1}`}
                description={
                  answers[q.id] ? (
                    <Tag icon={<CheckOutlined />} color="green">
                      پاسخ داده شده ({answers[q.id]})
                    </Tag>
                  ) : (
                    <Tag icon={<CloseOutlined />} color="red">
                      بدون پاسخ
                    </Tag>
                  )
                }
              />
            </List.Item>
          )}
        />

        <Row gutter={16}>
          <Col span={12}>
            <Button block onClick={() => navigate('/PracticeList')}>
              بازگشت به لیست تمرین‌ها
            </Button>
          </Col>
          <Col span={12}>
            <Button block type="primary" danger onClick={() => navigate(-1)}>
              بازگشت به ثبت نهایی
            </Button>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default PracticeReviewPage;
