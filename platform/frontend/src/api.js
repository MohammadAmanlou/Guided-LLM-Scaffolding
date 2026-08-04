import axios from 'axios';

const API = axios.create({
  baseURL: 'https://sample.com/api',
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getQuizzes = () => axios.get('http://localhost:5000/api/quizzes');

export const getQuizById = async (id) => {
  const userId = localStorage.getItem('userId');

  const response = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId, // ارسال به عنوان هدر سفارشی
    },
  });

  const data = await response.json();
  return { data };
};

export const getQuizAnswersById = async (id) => {
  const response = await fetch(`http://localhost:5000/api/quizzes/${id}/answers`);
  const data = await response.json();
  return { data };
};

export const submitQuiz = async (id, payload) => {
  const response = await fetch(`http://localhost:5000/api/quizzes/${id}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Submit error status:', response.status);
    console.error('Submit error body:', result);
    throw new Error('Submit failed');
  }

  return result;
};


export const savePartialQuiz = async (quizId, answers) => {
  const userId = localStorage.getItem('userId');

  const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}/save-partial`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId, 
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    console.error('خطا در ذخیره پاسخ جزئی');
  }

  const data = await response.json();
  return data;
};

export const registerQuizStart = async (quizId) => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('userId not found');

  const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Start quiz error:', data);
    throw new Error(data.error || 'Failed to register quiz start');
  }

  return { data };
};

