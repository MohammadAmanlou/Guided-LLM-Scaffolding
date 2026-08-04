import React from 'react';
import { Row, Col, Typography } from 'antd';
import TeamMemberCard from "../components/TeamMemberCard";
import TeamMembersData from "../data/TeamMembersData";

const { Title, Paragraph } = Typography;

const title = "اعضای تیم";
const desc = "معرفی اعضای تیم و راه‌های ارتباطی";

function TeamList() {
    return (
        <section style={{ padding: '24px 0' }}>
            {TeamMembersData.map((sec, idx) => (
                <article
                    key={idx}
                    style={{
                        maxWidth: '100%',
                        margin: '0 auto',
                        padding: '0 16px',
                        marginTop: '24px',
                    }}
                >
                    <Title level={2} style={{ marginBottom: '24px' }}>{sec.section}</Title>
                    <Row gutter={[16, 24]}>
                        {sec.list.map((ta, idx) => (
                            <Col key={idx} xs={24} sm={12} md={8} lg={6} xl={6}>
                                <TeamMemberCard ta={ta} />
                            </Col>
                        ))}
                    </Row>
                </article>
            ))}
        </section>
    );
}

export default function AboutUs() {
    return (
        <main style={{ flexGrow: 1, padding: '24px 16px', maxWidth: 1200, margin: '0 auto' }}>
            <section style={{ marginBottom: '48px' }}>
                <Title level={1} style={{ textAlign: 'start' }}> دوره تابستانه آمار و احتمال مهندسی</Title>
                <Paragraph style={{ textAlign: 'justify', lineHeight: '2', fontSize: '16px', color: '#444' }}>
                    
                    سلام و خوش‌آمدید!<br /><br />
                    ما، جمعی از پژوهشگران تحت نظارت دکتر بهرک، قصد داریم یک دوره آموزشی-پژوهشی تابستانه برگزار کنیم که به‌طور ویژه برای دانشجویان ورودی ۴۰۳ رشته‌های برق و کامپیوتر دانشگاه تهران طراحی شده است.<br /><br />
                    این دوره با سه هدف اصلی برگزار می‌شود:<br />
                    ۱. <strong>آمادگی درسی:</strong> یادگیری مفاهیم و تکنیک‌های آمار و احتمال مهندسی که ترم آینده خواهید داشت، به‌صورت تئوری و عملی.<br />
                    ۲. <strong>یادگیری مهارت‌های جدید:</strong> آشنایی با روش‌های استفاده از مدل‌های زبانی بزرگ (LLMs) و به‌کارگیری آن‌ها در حل مسائل مهندسی و پژوهشی.<br />
                    ۳. <strong>راهنمایی تحصیلی و شغلی:</strong> معرفی گرایش‌های مختلف رشته کامپیوتر (برای دانشجویان علاقه‌مند) تا بتوانید مسیر تحصیلی و شغلی خود را با آگاهی و علاقه بیشتری انتخاب کنید.<br /><br />
                    <strong>ویژگی پژوهشی دوره</strong><br />
                    این دوره بخشی از یک پروژه تحقیقاتی گسترده است. به همین دلیل، تمام اطلاعات مربوط به عملکرد، تعاملات و رفتار شما در طول دوره (از جمله نتایج تمرین‌ها، مشارکت‌ها و پیشرفت‌ها) جمع‌آوری و به‌صورت ناشناس و تجمیعی برای انتشار در یک مقاله علمی معتبر استفاده خواهد شد.<br />
                    اطمینان داشته باشید که هیچ‌یک از اطلاعات فردی شما به‌صورت جداگانه منتشر نخواهد شد و فقط تیم هماهنگ‌کننده دوره به داده‌های خام دسترسی خواهد داشت.
                </Paragraph>

            </section>

            <TeamList />
        </main>
    );
}
