import { useState } from 'react';
import { Pencil, X, Play, Plus } from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { t, formatTemplate } from '../services/i18n';

export default function RoutineTriggers({ state }) {
  const { routines, language, theme } = state;
  const isDark = theme === 'dark';
  const T = (path) => t(language, path);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [addForm, setAddForm] = useState({ name: '', times: '' });
  const [editForm, setEditForm] = useState({ name: '', times: '' });

  const cardClass = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-800';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';
  const textAccent = 'text-sky-500';

  const handleAddSave = () => {
    if (!addForm.name.trim()) return;
    const times = addForm.times
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    mockDataService.addRoutine(addForm.name.trim(), times);
    setAddForm({ name: '', times: '' });
    setShowAddModal(false);
    const msg = language === 'id' ? 'Rutinitas ditambahkan' : 'Routine added';
    mockDataService.logAudit('routine', msg, msg);
  };

  const handleEditOpen = (routine) => {
    setEditingRoutine(routine);
    setEditForm({ name: routine.name, times: routine.times.join(', ') });
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (!editForm.name.trim() || !editingRoutine) return;
    const times = editForm.times
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    mockDataService.updateRoutine(editingRoutine.id, { name: editForm.name.trim(), times });
    setShowEditModal(false);
    setEditingRoutine(null);
  };

  const handleRemove = (id) => {
    mockDataService.removeRoutine(id);
    const msg = language === 'id' ? 'Rutinitas dihapus' : 'Routine removed';
    mockDataService.logAudit('routine', msg, msg);
  };

  const handlePlay = (routine) => {
    const playedId = language === 'id'
      ? `Rutinitas ${routine.name} diputar di ESP32-S3`
      : `Routine ${routine.name} played on ESP32-S3`;
    const playedEn = `Routine ${routine.name} played on ESP32-S3`;
    mockDataService.logAudit('routine', playedId, playedEn);
  };

  return (
    <div className={`rounded-2xl border p-5 ${cardClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-base font-bold ${textPrimary}`}>{T('routines.heading')}</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
        >
          <Plus size={14} />
          {T('routines.addNew')}
        </button>
      </div>

      <div className="space-y-3">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className={`flex items-center justify-between rounded-xl px-4 py-3 ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePlay(routine)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
                title={T('routines.playSimulate')}
              >
                <Play size={14} fill="currentColor" />
              </button>
              <div>
                <div className={`font-semibold text-sm ${textPrimary}`}>{routine.name}</div>
                <div className={`text-xs ${textSecondary}`}>
                  {T('routines.time')}: {routine.times.join(', ')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditOpen(routine)}
                className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-200 text-slate-500'} transition-colors`}
                title={T('routines.edit')}
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleRemove(routine.id)}
                className="text-xs font-medium px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
              >
                {T('routines.remove')}
              </button>
            </div>
          </div>
        ))}

        {routines.length === 0 && (
          <div className={`text-center py-8 ${textSecondary}`}>
            {language === 'id' ? 'Belum ada rutinitas.' : 'No routines yet.'}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAddModal(false)}>
          <div
            className={`rounded-2xl border p-6 w-full max-w-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold ${textPrimary}`}>{T('routines.addModal.title')}</h3>
              <button onClick={() => setShowAddModal(false)} className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className={`text-xs font-medium ${textSecondary} block mb-1`}>{T('routines.addModal.name')}</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  placeholder={language === 'id' ? 'Contoh: Morning Walk' : 'e.g. Morning Walk'}
                />
              </div>
              <div>
                <label className={`text-xs font-medium ${textSecondary} block mb-1`}>{T('routines.addModal.times')}</label>
                <input
                  type="text"
                  value={addForm.times}
                  onChange={(e) => setAddForm({ ...addForm, times: e.target.value })}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  placeholder="07:00, 12:00"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  {T('routines.addModal.cancel')}
                </button>
                <button
                  onClick={handleAddSave}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                >
                  {T('routines.addModal.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowEditModal(false)}>
          <div
            className={`rounded-2xl border p-6 w-full max-w-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold ${textPrimary}`}>{T('routines.editModal.title')}</h3>
              <button onClick={() => setShowEditModal(false)} className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className={`text-xs font-medium ${textSecondary} block mb-1`}>{T('routines.addModal.name')}</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
              <div>
                <label className={`text-xs font-medium ${textSecondary} block mb-1`}>{T('routines.addModal.times')}</label>
                <input
                  type="text"
                  value={editForm.times}
                  onChange={(e) => setEditForm({ ...editForm, times: e.target.value })}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  {T('routines.addModal.cancel')}
                </button>
                <button
                  onClick={handleEditSave}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                >
                  {T('routines.editModal.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
