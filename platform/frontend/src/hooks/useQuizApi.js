import axiosInstance from '../services/axiosInstance';
import { useAuth } from '../contexts/AuthContext';



export const useQuizApi = () => {
  const { user } = useAuth(); 

  return {
    getQuiz: () => axiosInstance.post('api/quizzes/', {
      'userId': user.username
    }),
    getQuizById: (practiceId) => axiosInstance.post(`api/quizzes/${practiceId}`, {
      'userId': user.username
    }),
    startQuiz: (practiceId) => axiosInstance.post(`api/quizzes/${practiceId}/start`, {
      'userId': user.username
    }),
    // submitPractice: (practiceId, answers) => axiosInstance.post(`api/practices/${practiceId}/submit`, { answers }),
    downloadAnswerSheet: (practiceId) =>
      axiosInstance.get(`api/quizzes/${practiceId}/answersheet`, { responseType: 'blob' }),
    getPracticeQuestions: (practiceId) => axiosInstance.get(`api/quizzes/${practiceId}/questions`,  { responseType: 'blob' }),
    uploadAnswer: (practiceId, formData) =>
      axiosInstance.post(`api/quizzes/${practiceId}/upload`, formData),
    finalizeQuiz: (practiceId, formData) =>
      axiosInstance.post(`api/quizzes/${practiceId}/finalize`, formData),
  };
};
