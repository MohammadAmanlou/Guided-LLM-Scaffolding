import React, { createContext, useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';

const QuizContext = createContext();

export const QuizStates = {
  NOT_STARTED_YET: 'NOT_STARTED_YET',
  READY_TO_START: 'READY_TO_START',
  IN_PROGRESS: 'IN_PROGRESS',
  ATTENDED: 'ATTENDED',
  TIME_OVER: 'TIME_OVER',
};

const getPQuizState = (quiz, startedAtContext = null) => {
  const now = dayjs();
  const startTime = dayjs(quiz.startTime);
  const endTime = dayjs(quiz.endTime);
  const startedAt = startedAtContext
    ? dayjs(startedAtContext)
    : quiz.startedAt
      ? dayjs(quiz.startedAt)
      : null;
  const expectedEnd = startedAt ? startedAt.add(quiz.expectedTime, 'minute') : null;

  if (now.isBefore(startTime)) return QuizStates.NOT_STARTED_YET;
  if (now.isAfter(endTime)) return QuizStates.TIME_OVER;
  if (!startedAt) return QuizStates.READY_TO_START;
  if (quiz.finalized) return QuizStates.ATTENDED;
  if (now.isBefore(expectedEnd)) return QuizStates.IN_PROGRESS;
  if (now.isAfter(expectedEnd)) return QuizStates.ATTENDED;
};


export function QuizProvider({ children }) {
  const [quiz, setQuiz] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [question, setQuestion] = useState(null);

useEffect(() => {
  const savedQuiz = localStorage.getItem('quiz');
  const savedStartedAt = localStorage.getItem('startedAt2');
  const savedAnswer = localStorage.getItem('answer');
  const savedQuestion = localStorage.getItem('question');

  const parsedQuiz = savedQuiz ? JSON.parse(savedQuiz) : null;
  const parsedStartedAt = savedStartedAt ? dayjs(savedStartedAt) : null;

  if (
    parsedQuiz &&
    [QuizStates.TIME_OVER, QuizStates.ATTENDED].includes(
      getPQuizState(parsedQuiz, parsedStartedAt)
    )
  ) {
    resetQuizState();
    return;
  }

  if (parsedQuiz) setQuiz(parsedQuiz);
  if (parsedStartedAt) setStartedAt(parsedStartedAt);

  if (savedAnswer && savedAnswer !== 'null') {
    setAnswer(savedAnswer);
  }

  if (savedQuestion) setQuestion(JSON.parse(savedQuestion));

  if (parsedQuiz && parsedStartedAt) {
    const expectedEnd = parsedStartedAt.add(parsedQuiz.expectedTime, 'minute');
    const diff = expectedEnd.diff(dayjs(), 'second');
    if (diff <= 0) {
      resetQuizState();
    }
  }
}, []);



  useEffect(() => {
    if (quiz) localStorage.setItem('quiz', JSON.stringify(quiz));
  }, [quiz]);
  useEffect(() => {
    if (startedAt) localStorage.setItem('startedAt2', startedAt.toISOString());
  }, [startedAt]);
  useEffect(() => {
  if (answer !== null) {
    localStorage.setItem('answer', answer);
  } else {
    localStorage.removeItem('answer');
  }
}, [answer]);

  useEffect(() => {
    localStorage.setItem('question', JSON.stringify(question));
  }, [question]);


  const registerAnswer = (file) => {
    setAnswer( file.name );
  };

  const resetQuizState = () => {
    setQuiz(null);
    setStartedAt(null);
    setAnswer(null);
    setQuestion(null);
    localStorage.removeItem('quiz');
    localStorage.removeItem('startedAt2');
    localStorage.removeItem('answer');
    localStorage.removeItem('question');
  };

  return (
    <QuizContext.Provider
      value={{
        quiz: quiz,
        setQuiz: setQuiz,
        startedAt,
        setStartedAt,
        answer: answer,
        registerAnswer,
        question,
        setQuestion,
        resetQuizState: resetQuizState,
        getQuizState: getPQuizState,
        QuizStates: QuizStates,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizContext() {
  return useContext(QuizContext);
}
