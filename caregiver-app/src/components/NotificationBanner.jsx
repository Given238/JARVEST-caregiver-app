import { useEffect, useRef } from 'react';
import { AlertTriangle, Volume2, VolumeX, Phone, X, Clock } from 'lucide-react';
import { mockDataService, DANGER_LEVELS } from '../services/mockDataService';
import { playEmergencySound, stopEmergencySound } from '../utils/soundService';

export default function NotificationBanner({ state }) {
  const { activeNotification, patient, language, theme } = state;
  const isDark = theme === 'dark';
  const audioStartedRef = useRef(false);

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

  const handleCallEmergency = () => {
    const msgId = 'Panggilan darurat dibuat!';
    const msgEn = 'Emergency call initiated!';
    mockDataService.logAudit('incident', msgId, msgEn);
    alert(language === 'id' ? 'Panggilan darurat terhubung...' : 'Emergency call connected...');
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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
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
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleAcknowledge}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
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
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                isDark
                  ? 'bg-rose-900/50 text-rose-300 hover:bg-rose-900/70 border border-rose-700'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Volume2 size={14} />
              {acknowledgeText}
            </button>
            <button
              onClick={handleCallEmergency}
              className="flex-[1.5] flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-lg"
            >
              <Phone size={14} />
              {emergencyText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
