import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Route Guards
import ProtectedRoute from './ProtectedRoute';

// Layouts
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import ExamLayout from '../layouts/ExamLayout';

// Auth Pages (Figma 04)
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import VerifyOtpPage from '../features/auth/pages/VerifyOtpPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';

// Dashboard (Figma 05)
import DashboardPage from '../features/dashboard/pages/DashboardPage';

// Lectures (Figma 06)
import LecturesListPage from '../features/lectures/pages/LecturesListPage';
import LecturePlayerPage from '../features/lectures/pages/LecturePlayerPage';
import LectureVideoPage from '../features/lectures/pages/LectureVideoPage';
import LecturePdfPage from '../features/lectures/pages/LecturePdfPage';

// Sections (Figma 07)
import SectionsListPage from '../features/sections/pages/SectionsListPage';
import SectionDetailPage from '../features/sections/pages/SectionDetailPage';

// Exam Bank (Figma 08)
import ExamBankPage from '../features/exams/pages/ExamBankPage';
import ExamRunnerPage from '../features/exams/pages/ExamRunnerPage';
import ExamResultsPage from '../features/exams/pages/ExamResultsPage';

// Progress (Figma 09)
import ProgressPage from '../features/progress/pages/ProgressPage';

// Settings (Figma 10)
import SettingsPage from '../features/settings/pages/SettingsPage';

// 404
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect to Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 1. Public Authentication Routes (Figma Page 04) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* 2. Protected Application Routes (Restricted to Authenticated Users) */}
      <Route element={<ProtectedRoute />}>
        {/* Main Application Layout (Figma Pages 05–10) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Lectures */}
          <Route path="/lectures" element={<LecturesListPage />} />
          <Route path="/lectures/:lectureId" element={<LecturePlayerPage />} />
          <Route path="/lectures/:lectureId/video" element={<LectureVideoPage />} />
          <Route path="/lectures/:lectureId/pdf" element={<LecturePdfPage />} />

          {/* Practical Sections */}
          <Route path="/sections" element={<SectionsListPage />} />
          <Route path="/sections/:sectionId" element={<SectionDetailPage />} />

          {/* Exam Bank & Review */}
          <Route path="/exams" element={<ExamBankPage />} />
          <Route path="/exams/:examId/results" element={<ExamResultsPage />} />

          {/* Progress & Analytics */}
          <Route path="/progress" element={<ProgressPage />} />

          {/* Profile & Settings */}
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Distraction-Free Exam Runner (Figma Page 08 Full-Screen Assessment) */}
        <Route element={<ExamLayout />}>
          <Route path="/exams/:examId" element={<ExamRunnerPage />} />
        </Route>
      </Route>

      {/* 3. Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
