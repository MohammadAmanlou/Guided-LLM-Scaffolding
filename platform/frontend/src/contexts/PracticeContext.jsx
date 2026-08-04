import React, { createContext, useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { convertUtcToJalali } from '../utils/persianDate';

const PracticeContext = createContext();

export const PracticeStates = {
  NOT_STARTED_YET: 'NOT_STARTED_YET',
  READY_TO_START: 'READY_TO_START',
  IN_PROGRESS: 'IN_PROGRESS',
  ATTENDED: 'ATTENDED',
  TIME_OVER: 'TIME_OVER',
};

const getPracticeState = (practice, startedAtContext = null) => {
  const now = dayjs();
  const startTime = dayjs(practice.startTime);
  const endTime = dayjs(practice.endTime);
  const startedAt = startedAtContext
    ? dayjs(startedAtContext)
    : practice.startedAt
      ? dayjs(practice.startedAt)
      : null;
  const expectedEnd = startedAt ? startedAt.add(practice.expectedTime, 'minute') : null;

  if (now.isBefore(startTime)) return PracticeStates.NOT_STARTED_YET;
  if (now.isAfter(endTime)) return PracticeStates.TIME_OVER;
  if (!startedAt) return PracticeStates.READY_TO_START;
  if (practice.finalized) return PracticeStates.ATTENDED;
  if (now.isBefore(expectedEnd)) return PracticeStates.IN_PROGRESS;
  if (now.isAfter(expectedEnd)) return PracticeStates.ATTENDED;
};


export function PracticeProvider({ children }) {
  const [practice, setPractice] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const savedPractice = localStorage.getItem('practice');
    const savedStartedAt = localStorage.getItem('startedAt');
    const savedAnswers = localStorage.getItem('answers');
    const savedQuestions = localStorage.getItem('questions');
    const savedIndex = localStorage.getItem('currentIndex');

    const parsedPractice = savedPractice ? JSON.parse(savedPractice) : null;
    const parsedStartedAt = savedStartedAt ? dayjs(savedStartedAt) : null;

    if (
      parsedPractice &&
      [PracticeStates.TIME_OVER, PracticeStates.ATTENDED].includes(
        getPracticeState(parsedPractice, parsedStartedAt)
      )
    ) {
      resetPracticeState();
      return;
    }

    if (parsedPractice) setPractice(parsedPractice);
    if (parsedStartedAt) setStartedAt(parsedStartedAt);
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    if (savedIndex) setCurrentIndex(Number(savedIndex));

    if (parsedPractice && parsedStartedAt) {
      const expectedEnd = parsedStartedAt.add(parsedPractice.expectedTime, 'minute');


      const diff = expectedEnd.diff(dayjs(), 'second');

      if (diff <= 0) {
        resetPracticeState();
      }
    }
  }, []);


  useEffect(() => {
    if (practice) localStorage.setItem('practice', JSON.stringify(practice));
  }, [practice]);
  useEffect(() => {
    if (startedAt) localStorage.setItem('startedAt', startedAt.toISOString());
  }, [startedAt]);
  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);
  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);
  useEffect(() => {
    localStorage.setItem('currentIndex', currentIndex.toString());
  }, [currentIndex]);

  const registerAnswer = (questionId, file) => {
    setAnswers((prev) => ({ ...prev, [questionId]: file.name }));
  };

  const resetPracticeState = () => {
    setPractice(null);
    setStartedAt(null);
    setAnswers({});
    setQuestions([]);
    setCurrentIndex(0);
    localStorage.removeItem('practice');
    localStorage.removeItem('startedAt');
    localStorage.removeItem('answers');
    localStorage.removeItem('questions');
    localStorage.removeItem('currentIndex');
  };

  return (
    <PracticeContext.Provider
      value={{
        practice,
        setPractice,
        startedAt,
        setStartedAt,
        answers,
        registerAnswer,
        questions,
        setQuestions,
        currentIndex,
        setCurrentIndex,
        resetPracticeState,
        getPracticeState,
        PracticeStates,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
}

export function usePracticeContext() {
  return useContext(PracticeContext);
}

