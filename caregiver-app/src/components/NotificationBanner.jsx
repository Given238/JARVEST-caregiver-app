import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Volume2, VolumeX, Phone, X, Clock } from 'lucide-react';
import { mockDataService, DANGER_LEVELS } from '../services/mockDataService';
import { playEmergencySound, stopEmergencySound } from '../utils/soundService';

const EMERGENCY_NUMBER = '112';
const FALLBACK_NUMBER = '119';

function DesktopFallbackModal({ open, onClose, number }) {
  const labelId = `Tel: Dialing Emergency Service ${number}...`;
  const msgId = `Memanggil Layanan Darurat ${number}...`;
  const msgEn = `Dialing Emergency Service ${number}...`;
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-rose-500">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="text-rose-600" size={28} />
          <div>
            <p className="text-rose-600 font-bold text-base">{labelId}</p>
            <p className="text-slate-500 text-sm">{language === 'id' ? msgId : msgEn}</p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-5">
          {language === 'id'
            ? `Buka aplikasi telepon di perangkat mobile Anda dan hubungi:`
            : `Open the phone app on your mobile device and dial:`}
        </p>
        <div className="bg-rose-50 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-700 rounded-xl p-4 text-center mb-5">
          <a
            href={`tel:${number}`}
            className="text-3xl font-black text-rose-600 hover:text-rose-700 underline decoration-2"
          >
            {number}
          </a>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
        >
          {language === 'id' ? 'Tutup' : 'Close'}
        </button>
      </div>
    </div>
  );
}

let language = 'id';

export default function NotificationBanner({ state }) {
  const { activeNotification, patient, theme } = state;
  const isDark = theme === 'dark';
  const audioStartedRef = useRef(false);
  const [showFallback, setShowFallback] = useState(false);

  language = state.language;

  useEffect(() => {
    if (activeNotification && !audioStartedRef.current) {
      playEmergencySound();
      audioStartedRef.current = true;
    } else if (!activeNotification && audioStartedRef.current) {
      stopEmergencySound();
      audioStartedRef.current = false;
    }

    return () => {
      stopEmergencySound();
      audioStartedRef.current = false;
    };
  }, [activeNotification]);

  if (!activeNotification) return null;

  const handleAcknowledge = () => {
    stopEmergencySound();
    audioStartedRef.current = false;
    mockDataService.clearNotification();
  };

  const handleMute = () => {
    stopEmergencySound();
    audioStartedRef.current = false;
  };

  const handleCallEmergency = (fallback = false) => {
    const msgId = `Panggilan darurat dibuat — ${EMERGENCY_NUMBER}!`;
    const msgEn = `Emergency call initiated — ${EMERGENCY_NUMBER}!`;
    mockDataService.logAudit('incident', msgId, msgEn);

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${EMERGENCY_NUMBER}`;
    } else {
      setShowFallback(true);
    }
  };

  const handleFallbackDial = (number) => {
    setShowFallback(false);
    window.location.href = `tel:${number}`;
  };

  const getSeverityLabel = () => {
    switch (activeNotification.level) {
      case DANGER_LEVELS.FALL_DETECTED:
        return language === 'id' ? 'KRITIS' : 'CRITICAL';
      case DANGER_LEVELS.HEART_RATE_HIGH:
      case DANGER_LEVELS.HEART_RATE_LOW:
        return language === 'id' ? 'BAHAYA' : 'DANGER';
      case DANGER_LEVELS.BODY_TEMP:
        return language === 'id' ? 'PERINGATAN' : 'WARNING';
      case DANGER_LEVELS.AIR_QUALITY:
        return language === 'id' ? 'WASPADA' : 'ALERT';
      default:
        return language === 'id' ? 'PERINGATAN' : 'WARNING';
    }
  };

  const getSeverityColor = () => {
    switch (activeNotification.level) {
      case DANGER_LEVELS.FALL_DETECTED:
        return 'bg-rose-600';
      case DANGER_LEVELS.HEART_RATE_HIGH:
      case DANGER_LEVELS.HEART_RATE_LOW:
        return 'bg-red-600';
      case DANGER_LEVELS.BODY_TEMP:
        return 'bg-orange-500';
      case DANGER_LEVELS.AIR_QUALITY:
        return 'bg-amber-500';
      default:
        return 'bg-rose-500';
    }
  };

  const description = language === 'id' ? activeNotification.descriptionId : activeNotification.descriptionEn;
  const acknowledgeText = language === 'id' ? 'Tutup' : 'Acknowledge';
  const muteText = language === 'id' ? 'Bisukan' : 'Mute';
  const emergencyText = language === 'id' ? 'Hubungi Darurat' : 'Call Emergency';
  const warningText = language === 'id' ? 'PERINGATAN!' : 'WARNING!';

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <>
      <DesktopFallbackModal
        open={showFallback}
        onClose={() => setShowFallback(false)}
        number={EMERGENCY_NUMBER}
      />
      <div className="w-[92%] sm:w-full max-w-lg fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4">
      <div
        className={`relative rounded-2xl border-2 ${isDark ? 'bg-slate-800 border-rose-500' : 'bg-white border-rose-600'} shadow-2xl overflow-hidden`}
      >
        {/* Pulsing ring effect */}
        <div className="absolute inset-0 animate-pulse pointer-events-none">
          <div className={`absolute inset-0 ${isDark ? 'bg-rose-500/5' : 'bg-rose-500/10'} rounded-2xl`} />
        </div>

        {/* Header */}
        <div className={`${getSeverityColor()} px-4 py-2 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-white" />
            <span className="text-white font-bold text-sm tracking-wide">{warningText}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-xs">{formatTime(activeNotification.timestamp)}</span>
            <button
              onClick={handleAcknowledge}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Patient info */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${isDark ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
              B
            </div>

            <div className="flex-1 min-w-0">
              {/* Severity badge */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getSeverityColor()} text-white`}>
                  {getSeverityLabel()}
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {patient.name} (74) - {patient.gender}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {description}
              </p>

              {/* Timestamp */}
              <div className={`flex items-center gap-1 mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'} text-xs`}>
                <Clock size={10} />
                <span>{formatTime(activeNotification.timestamp)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col xs:flex-row items-stretch gap-2 mt-4">
            <button
              onClick={handleAcknowledge}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg min-h-11 text-sm font-semibold transition-colors ${
                isDark
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <VolumeX size={14} />
              {muteText}
            </button>
            <button
              onClick={handleAcknowledge}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg min-h-11 text-sm font-semibold transition-colors ${
                isDark
                  ? 'bg-rose-900/50 text-rose-300 hover:bg-rose-900/70 border border-rose-700'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Volume2 size={14} />
              {acknowledgeText}
            </button>
            <a
              href={`tel:${EMERGENCY_NUMBER}`}
              onClick={(e) => {
                e.preventDefault();
                handleCallEmergency();
              }}
              className="flex-[1.5] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg min-h-11 text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-lg"
            >
              <Phone size={14} />
              {emergencyText}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
