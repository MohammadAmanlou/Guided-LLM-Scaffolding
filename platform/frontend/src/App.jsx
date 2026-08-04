import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import faIR from 'antd/es/locale/fa_IR';

import { AuthProvider } from './contexts/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Videos from './pages/Videos.jsx';
import Video from './pages/Video.jsx';
import PracticeList from './pages/PracticeListPage.jsx';
import PracticeInfo from './pages/PracticeInfoPage.jsx';
import PracticeAttend from './pages/PracticeAttendPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './layouts/Layout.jsx';
import ChatPage from './pages/ChatPage.jsx';
import { ChatUIProvider } from './contexts/ChatUIContext.jsx';
import { PracticeProvider } from './contexts/PracticeContext.jsx';
import PracticeReviewPage from './pages/PracticeReview.jsx';
import QuizListPage from './pages/QuizListPage.jsx';
import QuizInfoPage from './pages/QuizInfoPage.jsx';
import QuizAttendPage from './pages/QuizAttendPage.jsx';
import { QuizProvider } from './contexts/QuizContext';
import ChangePassword from './pages/ChangePassword.jsx';
import ChangePasswordRoute from './components/ChangePasswordRoute.jsx';
import AboutUs from './pages/AboutUs.jsx';
export default function App() {
  return (
    <ConfigProvider direction="rtl" locale={faIR}>
      <AuthProvider>
        <ChatUIProvider>
          <PracticeProvider>
            <BrowserRouter>
              {' '}
              <QuizProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route element={<Layout />}>
                    <Route
                      path="/videos"
                      element={
                        <ProtectedRoute>
                          <Videos />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/video/:id"
                      element={
                        <ProtectedRoute>
                          <Video />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/PracticeList"
                      element={
                        <ProtectedRoute>
                          <PracticeList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/PracticeInfo/:id"
                      element={
                        <ProtectedRoute>
                          <PracticeInfo />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/practice/:id"
                      element={
                        <ProtectedRoute>
                          <PracticeAttend />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/practice/review"
                      element={
                        <ProtectedRoute>
                          <PracticeReviewPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/quizzes"
                      element={
                        <ProtectedRoute>
                          <QuizListPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quizzes/:id"
                      element={
                        <ProtectedRoute>
                          <QuizInfoPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quizzes/:id/attend"
                      element={
                        <ProtectedRoute>
                          <QuizAttendPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/about-us"
                      element={
                        <ProtectedRoute>
                          <AboutUs />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                  <Route
                    path="/change-password"
                    element={
                      <ChangePasswordRoute>
                        <ChangePassword />
                      </ChangePasswordRoute>
                    }>
                  </Route>
                  <Route path="*" element={<Navigate to="/videos" replace />} />
                </Routes>{' '}
              </QuizProvider>
            </BrowserRouter>
          </PracticeProvider>
        </ChatUIProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}
