import axiosInstance from '../services/axiosInstance';
import { useAuth } from '../contexts/AuthContext';



export const usePracticeApi = () => {
  const { user } = useAuth(); 

  return {
    getPractices: () => axiosInstance.post('api/practices/', {
      'userId': user.username
    }),
    getPracticeById: (practiceId) => axiosInstance.post(`api/practices/${practiceId}`, {
      'userId': user.username
    }),
    startPractice: (practiceId) => axiosInstance.post(`api/practices/${practiceId}/start`, {
      'userId': user.username
    }),
    // submitPractice: (practiceId, answers) => axiosInstance.post(`api/practices/${practiceId}/submit`, { answers }),
    downloadAnswerSheet: (practiceId) =>
      axiosInstance.get(`api/practices/${practiceId}/answersheet`, { responseType: 'blob' }),
    getPracticeQuestions: (practiceId) => axiosInstance.post(`api/practices/${practiceId}/questions`, {
      'userId': user.username
    }),

uploadAnswer: (practiceId, formData, onUploadProgress = null) =>
      axiosInstance.post(
        `api/practices/${practiceId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress,
        }
      ),
    finalizePractice: (practiceId, formData) =>
      axiosInstance.post(`api/practices/${practiceId}/finalize`, formData),
  };
};

// mock
// export const usePracticeApi = () => {
//   const practiceData = [
//     {
//       id: 1,
//       name: 'تمرین الف',
//       startTime: '2025-07-20T12:00:00Z',
//       endTime: '2025-07-25T12:00:00Z',
//       expectedTime: 60,
//       totalScore: 20,
//       userScore: null,
//       startedAt: null,
//       answerSheetUrl: null,
//     },
//     {
//       id: 2,
//       name: 'تمرین ب',
//       startTime: '2025-07-10T12:00:00Z',
//       endTime: '2025-07-30T12:00:00Z',
//       expectedTime: 10,
//       totalScore: 30,
//       userScore: null,
//       startedAt: null,
//       answerSheetUrl: null,
//     },
//     {
//       id: 3,
//       name: 'تمرین ج',
//       startTime: '2025-07-10T12:00:00Z',
//       endTime: '2025-07-30T12:00:00Z',
//       expectedTime: 160,
//       totalScore: 15,
//       userScore: null,
//       startedAt: '2025-07-20T12:00:00Z',
//       answerSheetUrl: null,
//     },
//     {
//       id: 4,
//       name: 'تمرین د',
//       startTime: '2025-07-10T12:00:00Z',
//       endTime: '2025-07-30T12:00:00Z',
//       expectedTime: 30,
//       totalScore: 25,
//       userScore: 20,
//       startedAt: '2025-07-14T07:00:00Z',
//       answerSheetUrl: null,
//     },
//     {
//       id: 5,
//       name: 'تمرین ه',
//       startTime: '2025-06-01T12:00:00Z',
//       endTime: '2025-06-10T12:00:00Z',
//       expectedTime: 60,
//       totalScore: 20,
//       userScore: 18,
//       startedAt: '2025-06-01T13:00:00Z',
//       answerSheetUrl: 'https://example.com/answersheet5.pdf',
//     },
//   ];

//   const mockQuestions = {
//     1: [
//       { id: 101, imageUrl: 'https://i.ibb.co/cSjGJ6vG/Screenshot-2025-07-15-223103.png' },
//       { id: 102, imageUrl: 'https://i.ibb.co/cSjGJ6vG/Screenshot-2025-07-15-223103.png' },
//       { id: 103, imageUrl: 'https://i.ibb.co/cSjGJ6vG/Screenshot-2025-07-15-223103.png' },
//     ],
//     2: [
//       { id: 201, imageUrl: 'https://i.ibb.co/cSjGJ6vG/Screenshot-2025-07-15-223103.png' },
//       { id: 202, imageUrl: 'https://i.ibb.co/cSjGJ6vG/Screenshot-2025-07-15-223103.png' },
//     ],
//     3: [
//       { id: 301, imageUrl: 'https://i.ibb.co/cSjGJ6vG/Screenshot-2025-07-15-223103.png' },
//     ],
//   };

//   const answerStorage = {};

//   return {
//     getPractices: () =>
//       new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({ data: practiceData });
//         }, 500);
//       }),

//     getPracticeById: (practiceId) =>
//       new Promise((resolve, reject) => {
//         setTimeout(() => {
//           const practice = practiceData.find((p) => p.id === Number(practiceId));
//           if (practice) {
//             resolve({ data: practice });
//           } else {
//             reject(new Error('تمرین پیدا نشد'));
//           }
//         }, 400);
//       }),

//     startPractice: (practiceId) =>
//       new Promise((resolve, reject) => {
//         setTimeout(() => {
//           const practice = practiceData.find((p) => p.id === Number(practiceId));
//           if (!practice) return reject(new Error('تمرین پیدا نشد'));
          
//           const now = new Date().toISOString();
//           practice.startedAt = now;

//           resolve({ data: { startedAt: now } });
//         }, 300);
//       }),

//     submitPractice: (practiceId, answers) =>
//       new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({
//             data: { success: true, score: Math.floor(Math.random() * 20) + 10 },
//           });
//         }, 800);
//       }),

//     downloadAnswerSheet: (practiceId) =>
//       new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({
//             data: new Blob(['این پاسخنامه تمرین است'], { type: 'application/pdf' }),
//           });
//         }, 400);
//       }),

//     getPracticeQuestions: (practiceId) =>
//       new Promise((resolve, reject) => {
//         setTimeout(() => {
//           const questions = mockQuestions[practiceId];
//           if (!questions) return reject(new Error('سوالی برای این تمرین موجود نیست'));

//           const lastAnswers = answerStorage[practiceId] || {};
//           const answeredIds = Object.keys(lastAnswers);
//           const lastIndex = answeredIds.length
//             ? questions.findIndex(q => q.id === Number(answeredIds[answeredIds.length - 1]))
//             : 0;

//           resolve({
//             data: {
//               questions,
//               lastQuestionIndex: lastIndex >= 0 ? lastIndex : 0,
//             },
//           });
//         }, 500);
//       }),

//     uploadAnswer: (practiceId, formData) =>
//       new Promise((resolve) => {
//         setTimeout(() => {
//           const questionId = formData.get('questionId');
//           const file = formData.get('file');

//           if (!answerStorage[practiceId]) answerStorage[practiceId] = {};
//           answerStorage[practiceId][questionId] = file.name;

//           resolve({ data: { success: true } });
//         }, 500);
//       }),

//     finalizePractice: (practiceId) =>
//       new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({ data: { success: true } });
//         }, 500);
//       }),
//   };
// };
