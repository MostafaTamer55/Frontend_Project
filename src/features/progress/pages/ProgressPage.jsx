import React, { useState } from 'react';
import ProgressSummary from '../components/ProgressSummary';
import LecturesProgressBreakdown from '../components/LecturesProgressBreakdown';

/**
 * Dedicated Progress Page (/progress) supporting 2 views:
 * 1. Progress Overview (Overview Analytics + 3 progress columns: Lectures, Sections, Exams)
 * 2. Lectures Progress Breakdown (Shown when clicking on the Lectures Progress card)
 */
export const ProgressPage = () => {
  const [currentView, setCurrentView] = useState('overview'); // 'overview' | 'lectures_breakdown'

  return (
    <div className="space-y-8 pb-12">
      {currentView === 'lectures_breakdown' ? (
        <LecturesProgressBreakdown onBack={() => setCurrentView('overview')} />
      ) : (
        <ProgressSummary onSelectLectures={() => setCurrentView('lectures_breakdown')} />
      )}
    </div>
  );
};

export default ProgressPage;
