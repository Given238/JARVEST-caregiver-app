import { useState } from 'react';
import { Calendar, Users, Pencil, X } from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { t } from '../services/i18n';

export default function ContextManager({ state }) {
  const { dailyContext, familyTree, language, theme } = state;
  const isDark = theme === 'dark';
  const T = (path) => t(language, path);

  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showPermanentModal, setShowPermanentModal] = useState(false);
  const [dailyForm, setDailyForm] = useState(dailyContext);
  const [familyForm, setFamilyForm] = useState(
    familyTree.map((f) => ({ ...f }))
  );

  const cardClass = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-800';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';
  const bgSubtle = isDark ? 'bg-slate-700/50' : 'bg-slate-50';
  const bgSubtle2 = isDark ? 'bg-slate-700' : 'bg-slate-100';

  const handleSaveDaily = () => {
    mockDataService.setDailyContext(dailyForm);
    setShowDailyModal(false);
    const msg = language === 'id' ? 'Konteks harian diperbarui' : 'Daily context updated';
    mockDataService.logAudit('routine', msg, msg);
  };

  const handleSavePermanent = () => {
    mockDataService.setFamilyTree(familyForm);
    setShowPermanentModal(false);
    const msg = language === 'id' ? 'Konteks permanen diperbarui' : 'Permanent context updated';
    mockDataService.logAudit('routine', msg, msg);
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...familyForm];
    updated[index] = { ...updated[index], [field]: value };
    setFamilyForm(updated);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Daily Context */}
      <div className={`rounded-2xl border p-5 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-sky-500" />
          <h2 className={`text-base font-bold ${textPrimary}`}>{T('context.dailyHeading')}</h2>
        </div>
        <div className={`rounded-xl p-4 text-sm leading-relaxed min-h-20 ${bgSubtle} ${textSecondary}`}>
          {dailyContext}
        </div>
        <button
          onClick={() => { setDailyForm(dailyContext); setShowDailyModal(true); }}
          className={`mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          <Pencil size={12} />
          {T('context.edit')}
        </button>
      </div>

      {/* Permanent Context */}
      <div className={`rounded-2xl border p-5 ${cardClass}`}>
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-sky-500" />
          <h2 className={`text-base font-bold ${textPrimary}`}>{T('context.permanentHeading')}</h2>
        </div>
        <div className={`rounded-xl p-4 min-h-20 ${bgSubtle}`}>
          <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${textSecondary}`}>
            {T('context.familyStatus')}
          </div>
          <div className="space-y-1">
            {familyTree.map((member, i) => (
              <div key={i} className={`text-sm ${textSecondary}`}>
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {language === 'id' ? member.label : member.name}:
                </span>{' '}
                <span className={textPrimary}>{member.person}</span>{' '}
                <span className={`text-xs ${member.status === 'deceased' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ({member.status === 'deceased' ? T('context.deceased') : T('context.alive')})
                </span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => { setFamilyForm(familyTree.map((f) => ({ ...f }))); setShowPermanentModal(true); }}
          className={`mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          <Pencil size={12} />
          {T('context.edit')}
        </button>
      </div>

      {/* Daily Context Modal */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowDailyModal(false)}>
          <div
            className={`rounded-2xl border p-6 w-full max-w-md ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold ${textPrimary}`}>{T('context.editModal.dailyTitle')}</h3>
              <button onClick={() => setShowDailyModal(false)} className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X size={16} />
              </button>
            </div>
            <textarea
              value={dailyForm}
              onChange={(e) => setDailyForm(e.target.value)}
              rows={5}
              className={`w-full rounded-xl border px-3 py-2 text-sm resize-none ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
            />
            <div className="flex gap-2 pt-3">
              <button
                onClick={() => setShowDailyModal(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                {T('context.editModal.cancel')}
              </button>
              <button
                onClick={handleSaveDaily}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-colors"
              >
                {T('context.editModal.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Context Modal */}
      {showPermanentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowPermanentModal(false)}>
          <div
            className={`rounded-2xl border p-6 w-full max-w-md ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold ${textPrimary}`}>{T('context.editModal.permanentTitle')}</h3>
              <button onClick={() => setShowPermanentModal(false)} className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X size={16} />
              </button>
            </div>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${textSecondary}`}>
              {T('context.editModal.familyTree')}
            </div>
            <div className="space-y-3">
              {familyForm.map((member, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={member.person}
                    onChange={(e) => handleFamilyChange(i, 'person', e.target.value)}
                    className={`flex-1 rounded-lg border px-3 py-1.5 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                    placeholder={language === 'id' ? 'Nama' : 'Name'}
                  />
                  <select
                    value={member.status}
                    onChange={(e) => handleFamilyChange(i, 'status', e.target.value)}
                    className={`rounded-lg border px-2 py-1.5 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  >
                    <option value="deceased">{T('context.deceased')}</option>
                    <option value="alive">{T('context.alive')}</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowPermanentModal(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                {T('context.editModal.cancel')}
              </button>
              <button
                onClick={handleSavePermanent}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-colors"
              >
                {T('context.editModal.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
