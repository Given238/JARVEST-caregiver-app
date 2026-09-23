import { useState } from 'react';
import { Moon, Sun, AlertTriangle, Bug } from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { t } from '../services/i18n';

export default function Header({ state }) {
  const { theme, language, vestOn } = state;
  const T = (path) => t(language, path);

  const isDark = theme === 'dark';
  const [showTestBtn, setShowTestBtn] = useState(false);

  const handleLangToggle = () => {
    mockDataService.setLanguage(language === 'id' ? 'en' : 'id');
  };

  const handleThemeToggle = () => {
    mockDataService.setTheme(isDark ? 'light' : 'dark');
  };

  const handleVestToggle = () => {
    mockDataService.setVestOn(!vestOn);
  };

  const handleSimulateFall = () => {
    mockDataService.triggerFallAlert();
  };

  return (
    <header
      className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b ${
        isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500 text-white font-bold text-sm">
          JV
        </div>
        <span
          className={`text-xl font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}
        >
          {T('header.title')}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Language Toggle */}
        <button
          onClick={handleLangToggle}
          className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors ${
            isDark
              ? 'border-slate-600 text-slate-200 hover:bg-slate-800'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className={language === 'id' ? 'text-sky-500' : 'opacity-60'}>ID</span>
          <span className="opacity-40">|</span>
          <span className={language === 'en' ? 'text-sky-500' : 'opacity-60'}>EN</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
            isDark
              ? 'border-slate-600 text-yellow-400 hover:bg-slate-800'
              : 'border-slate-300 text-slate-600 hover:bg-slate-100'
          }`}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Vest Status */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {T('header.vestStatus')}
          </span>
          <button
            onClick={handleVestToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              vestOn ? 'bg-sky-500' : isDark ? 'bg-slate-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                vestOn ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span
            className={`text-sm font-bold ${vestOn ? 'text-sky-500' : isDark ? 'text-slate-400' : 'text-slate-400'}`}
          >
            {vestOn ? T('header.vestOn') : T('header.vestOff')}
          </span>
        </div>

        {/* Test Button */}
        <button
          onClick={() => setShowTestBtn(!showTestBtn)}
          className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${
            isDark
              ? 'border-slate-600 text-slate-400 hover:bg-slate-800'
              : 'border-slate-300 text-slate-500 hover:bg-slate-100'
          }`}
          title="Test Controls"
        >
          <Bug size={16} />
        </button>

        {showTestBtn && (
          <button
            onClick={handleSimulateFall}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-lg animate-pulse"
          >
            <AlertTriangle size={14} />
            {language === 'id' ? 'Simulasi Jatuh' : 'Simulate Fall'}
          </button>
        )}
      </div>
    </header>
  );
}
