import React, { useEffect, useState } from 'react';
import { Alert, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useVideoApi } from '../hooks/useVideoApi';
import { useChatUI } from '../contexts/ChatUIContext';
import { useNavigate } from 'react-router-dom';

export default function VideosPage() {
  const { user } = useAuth();
  const { theme, font, fontSize } = useChatUI();
  const { checkVideoAccess, getVideos } = useVideoApi();
  const navigate = useNavigate();

  const [status, setStatus] = useState('checking');
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setStatus('checking');
        const accessRes = await checkVideoAccess();
        if (!accessRes.data.allowed) {
          setStatus('denied');
          return;
        }

        const res = await getVideos();
        setVideos(res.data.videos || []);
        setStatus('ready');
      } catch (err) {
        setStatus('error');
        setError('❌ خطا در ارتباط با سرور.');
      }
    };

    init();
  }, []);

  return (
    <div
      className={`mx-auto p-4 w-full h-full rounded-lg shadow
        ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
      style={{
        fontFamily: font,
        fontSize: `${fontSize}px`,
        height: 'fit-content',
        background:
          theme === 'dark'
            ? 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)'
            : 'linear-gradient(135deg, #f0f4f8, rgb(173, 188, 205))',
      }}
    >
      {/* Source Book Link */}
      <div className="w-full flex justify-center mb-6">
        <a
          href="https://drive.google.com/file/d/1f43EyHoNKlqRvdrEal7d-C2wHoTG82Pn/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-base md:text-lg font-semibold shadow hover:brightness-110 transition-all duration-200"
        >
          📘 مشاهده کتاب منبع
        </a>
      </div>

      {status === 'checking' && (
        <Alert
          message="⏳ در حال بررسی دسترسی به ویدیوها..."
          type="info"
          showIcon
          className="my-4"
        />
      )}
      {status === 'denied' && (
        <Alert
          message="❌ شما در این بازه به ویدیوها دسترسی ندارید."
          type="error"
          showIcon
          className="my-4"
        />
      )}
      {status === 'error' && <Alert message={error} type="error" showIcon className="my-4" />}

      {status === 'ready' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {videos.map((video, index) => (
            <Card
              key={video.id}
              hoverable={video.accessible}
              className={`relative cursor-pointer transition-transform duration-300 ease-in-out rounded-lg shadow-md transform
                ${video.accessible
                  ? theme === 'dark'
                    ? 'bg-gray-800 hover:scale-105 hover:shadow-lg'
                    : 'bg-white hover:scale-105 hover:shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 opacity-60 cursor-not-allowed'
                }
              `}
              onClick={() => {
                if (video.accessible) {
                  navigate(`/video/${video.id}`);
                }
              }}
              bodyStyle={{ padding: 0, height: '220px' }}
              style={{ height: '220px', overflow: 'hidden' }}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-lg"
                  style={{ display: 'block' }}
                />

                {!video.accessible && (
                  <LockOutlined
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '40px',
                      color:
                        theme === 'dark'
                          ? 'rgba(255, 255, 255, 0.7)'
                          : 'rgba(0, 0, 0, 0.45)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Hover Info for Desktop */}
                <div
                  className={`absolute inset-0 bg-black bg-opacity-60 text-white opacity-0 hover:opacity-100 transition-opacity duration-300
                    hidden sm:flex flex-col justify-center items-center p-4 text-center rounded-lg`}
                  style={{ backdropFilter: 'blur(4px)' }}
                >
                  <h3 className="text-lg font-semibold mb-1">ویدیو {index + 1}</h3>
                  <h3 className="text-lg font-semibold mb-1">{video.title}</h3>
                  <p className="text-sm opacity-90">{video.summary}</p>
                  <p className="text-sm opacity-70 mt-2">⏱ زمان: {video.duration}</p>
                  {!video.accessible && (
                    <div className="mt-3 flex items-center space-x-1 text-red-400">
                      <LockOutlined />
                      <span>شما به این ویدیو دسترسی ندارید.</span>
                    </div>
                  )}
                </div>

                {/* Always visible info for Mobile */}
                <div
                  className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white p-2 text-xs flex flex-col sm:hidden"
                  style={{ backdropFilter: 'blur(2px)' }}
                >
                  <span className="font-bold">{video.title}</span>
                  <span className="truncate">{video.summary}</span>
                  <span className="opacity-80 mt-1">⏱ زمان: {video.duration}</span>
                  {!video.accessible && (
                    <span className="text-red-400 flex items-center mt-1">
                      <LockOutlined style={{ marginLeft: '4px' }} />
                      شما به این ویدیو دسترسی ندارید.
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
