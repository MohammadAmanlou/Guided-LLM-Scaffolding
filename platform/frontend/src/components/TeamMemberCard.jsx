import React from 'react';
import { Card, Avatar, Typography, Space, Row, Col } from 'antd';
import { MailOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import { toPersianNumber } from "../utils/persianDate";

const { Text, Title } = Typography;

export default function TeamMemberCard({ ta }) {
    const author = { ...ta, title: toPersianNumber(ta.title) };

    return (
        <Card
            hoverable
            style={{
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                width: '100%',
            }}

        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Row align="middle" gutter={16}>
                    <Col>
                        <Avatar size={64} src={author.imageURL} />
                        {console.log(author)}
                    </Col>
                    <Col>
                        <Title level={5} style={{ margin: 0 }}>{author.name}</Title>
                    </Col>
                </Row>

                <Row justify="space-around" align="middle" style={{ marginTop: 8 }}>
                    {author.email && (
                        <Col>
                            <a href={`mailto:${author.email}`} title="ایمیل">
                                <MailOutlined style={{ fontSize: 22 }} />
                            </a>
                        </Col>
                    )}
                    {author.socials?.github && (
                        <Col>
                            <a href={author.socials.github} target="_blank" rel="noopener noreferrer" title="گیت‌هاب">
                                <GithubOutlined style={{ fontSize: 22 }} />
                            </a>
                        </Col>
                    )}
                    {author.socials?.linkedin && (
                        <Col>
                            <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" title="لینکدین">
                                <LinkedinOutlined style={{ fontSize: 22 }} />
                            </a>
                        </Col>
                    )}
                </Row>

            </Space>
        </Card>
    );
}
