import { AlertTriangle, ListChecks, Phone, Clock } from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { t, formatTemplate } from '../services/i18n';

export default function AuditTimeline({ state }) {
  const { auditLog, language, theme } = state;
  const isDark = theme === 'dark';
  const T = (path) => t(language, path);

  const cardClass = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-800';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';
  const bgSubtle = isDark ? 'bg-slate-700/50' : 'bg-slate-50';

  const handleCallEmergency = () => {
    const msgId = 'Panggilan darurat dibuat!';
    const msgEn = 'Emergency call initiated!';
    mockDataService.logAudit('incident', msgId, msgEn);
    alert(language === 'id' ? 'Panggilan darurat terhubung...' : 'Emergency call connected...');
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return language === 'id' ? 'Baru saja' : 'Just now';
    if (diffMins < 60) return `${diffMins}m ago / ${diffMins}m lalu`;
    if (diffHrs < 24) return `${diffHrs}h ago / ${diffHrs}j lalu`;
    return new Date(date).toLocaleString(language === 'id' ? 'id-ID' : 'en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getEntryDescription = (entry) => {
    return language === 'id' ? entry.descriptionId : entry.descriptionEn;
  };

  return (
    <div className={`rounded-2xl border p-5 ${cardClass}`}>
      <h2 className={`text-base font-bold ${textPrimary} mb-4`}>{T('audit.heading')}</h2>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {auditLog.map((entry) => (
          <div
            key={entry.id}
            className={`flex flex-col sm:flex-row sm:items-start gap-3 rounded-xl px-4 py-3 ${entry.type === 'incident' ? (isDark ? 'bg-rose-900/20 border border-rose-800/30' : 'bg-rose-50 border border-rose-100') : bgSubtle}`}
          >
            <div className={`mt-0.5 p-1.5 rounded-lg ${entry.type === 'incident' ? 'bg-rose-500/10 text-rose-500' : 'bg-sky-500/10 text-sky-500'}`}>
              {entry.type === 'incident' ? <AlertTriangle size={14} /> : <ListChecks size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${entry.type === 'incident' ? 'text-rose-400' : 'text-sky-400'}`}>
                {entry.type === 'incident' ? T('audit.incident') : T('audit.routine')}
              </div>
              <div className={`text-sm font-medium ${textPrimary}`}>{getEntryDescription(entry)}</div>
              <div className={`flex items-center gap-1 text-xs mt-1 ${textSecondary}`}>
                <Clock size={10} />
                {formatTime(entry.time)}
              </div>
            </div>
            {entry.type === 'incident' && (
              <button
                onClick={handleCallEmergency}
                className="flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-lg min-h-11 min-w-11 bg-rose-500 text-white hover:bg-rose-600 transition-colors whitespace-nowrap"
              >
                <Phone size={11} />
                {T('audit.callEmergency')}
              </button>
            )}
          </div>
        ))}

        {auditLog.length === 0 && (
          <div className={`text-center py-8 ${textSecondary}`}>
            {language === 'id' ? 'Belum ada entri.' : 'No entries yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
