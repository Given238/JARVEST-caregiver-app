import { useEffect, useState } from 'react';
import { mockDataService } from './services/mockDataService';
import Header from './components/Header';
import PatientVitals from './components/PatientVitals';
import RoutineTriggers from './components/RoutineTriggers';
import ContextManager from './components/ContextManager';
import AuditTimeline from './components/AuditTimeline';
import NotificationBanner from './components/NotificationBanner';
import './index.css';

export default function App() {
  const [state, setState] = useState(mockDataService.getState());

  useEffect(() => {
    const unsubscribe = mockDataService.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  const isDark = state.theme === 'dark';

  const bgClass = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-800';
  const textMuted = isDark ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={`min-h-screen transition-colors ${bgClass}`}>
      <NotificationBanner state={state} />
      <Header state={state} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Patient Profile & Vitals */}
        <PatientVitals state={state} />

        {/* Routine Triggers */}
        <RoutineTriggers state={state} />

        {/* Context Manager */}
        <ContextManager state={state} />

        {/* Audit Timeline */}
        <AuditTimeline state={state} />

        {/* Footer */}
        <div className={`text-center text-xs py-4 ${textMuted}`}>
          JARVEST Caregiver Companion &copy; {new Date().getFullYear()} &mdash;{' '}
          {state.language === 'id' ? 'Semua hak dilindungi' : 'All rights reserved'}
        </div>
      </main>
    </div>
  );
}
