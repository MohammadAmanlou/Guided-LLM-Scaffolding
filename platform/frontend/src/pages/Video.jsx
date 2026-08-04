import React, { useEffect, useState, useRef } from 'react';
import { Alert, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideoApi } from '../hooks/useVideoApi';
import { useChatUI } from '../contexts/ChatUIContext';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export default function Video() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVideoById } = useVideoApi();
  const { theme, font, fontSize } = useChatUI();

  const [video, setVideo] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setStatus('loading');
        const res = await getVideoById(parseInt(id, 10));
        setVideo(res.data);
        setStatus('ready');
      } catch {
        setError('❌ خطا در دریافت اطلاعات ویدیو');
        setStatus('error');
      }
    };
    fetchVideo();
  }, [id]);

  // useEffect(() => {
  //   if (status !== 'ready') return;

  //   timeoutRef.current = setTimeout(() => {
  //     setShowConfirm(true);
  //   }, /*300000*/ 10000); 

  //   return () => clearTimeout(timeoutRef.current);
  // }, [status]);

  // useEffect(() => {
  //   if (!showConfirm) return;

  //   setCountdown(10);

  //   countdownRef.current = setInterval(() => {
  //     setCountdown(prev => {
  //       if (prev <= 1) {
  //         clearInterval(countdownRef.current);
  //         navigate('/videos');
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(countdownRef.current);
  // }, [showConfirm, navigate]);

  const handleOk = () => {
    setShowConfirm(false);

    timeoutRef.current = setTimeout(() => {
      setShowConfirm(true);
    }, 10000);
  };

  const handleCancel = () => {
    navigate('/videos');
  };

  if (status === 'loading')
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert message="در حال بارگذاری ویدیو..." type="info" showIcon />
      </div>
    );

  if (status === 'error')
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert message={error} type="error" showIcon />
      </div>
    );

  return (
    <div
      className={`min-h-screen px-4 py-6 flex flex-col items-center transition-all duration-300 ease-in-out
        ${theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-gradient-to-tr from-sky-50 to-blue-100 text-gray-900'}`}
      style={{
        fontFamily: font,
        fontSize: `${fontSize}px`,
      }}
    >
      <div className="w-full max-w-4xl flex justify-start mb-6">
        <Button
          type="default"
          onClick={() => navigate('/videos')}
          icon={<RightOutlined />}
          className="rounded-full px-4 py-2 font-semibold shadow-sm bg-white text-gray-800 hover:bg-gray-100 transition"
        >
          بازگشت
        </Button>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">{video.title}</h1>

      <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-xl border border-gray-300">
        <iframe
          title={video.title}
          src={video.embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
        />

        {showConfirm && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20 rounded-3xl p-6">
            <p className="text-lg font-semibold mb-2">آیا می‌خواهید به تماشای ویدیو ادامه دهید؟</p>
            <p className="text-sm mb-4">زمان باقی‌مانده: {countdown} ثانیه</p>
            <div className="flex gap-4">
              <Button type="primary" onClick={handleOk} className="px-6 py-1.5 text-base rounded-lg">
                ادامه
              </Button>
              <Button danger ghost onClick={handleCancel} className="px-6 py-1.5 text-base rounded-lg">
                بازگشت
              </Button>
            </div>
          </div>
        )}
      </div>
      {video.youtubeUrl && (
        <div className="w-full max-w-3xl mt-4 text-right">
          <p className="text-sm md:text-base bg-white/70 dark:bg-white/10 p-3 rounded-lg shadow text-blue-700 dark:text-blue-300">
            لینک یوتیوب:{" "}
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-500"
            >
              {video.youtubeUrl}
            </a>
          </p>
        </div>
      )}
      <p className="max-w-3xl mt-6 leading-relaxed text-justify bg-white/60 dark:bg-white/10 p-4 rounded-xl shadow-md">
        {video.description}
      </p>
    </div>
  );
}
