import { useState } from 'react';
import { Heart, Thermometer, Cloud, Activity, AlertTriangle, Settings } from 'lucide-react';
import { mockDataService } from '../services/mockDataService';
import { t } from '../services/i18n';

export default function PatientVitals({ state }) {
  const { patient, vitals, language, theme } = state;
  const isDark = theme === 'dark';
  const T = (path) => t(language, path);

  const [showDebug, setShowDebug] = useState(false);
  const [debugVitals, setDebugVitals] = useState({
    heartRate: vitals.heartRate,
    bodyTemp: vitals.bodyTemp,
    airQuality: vitals.airQuality,
    gyroStatus: vitals.gyroStatus,
  });

  const heartStatusLabel = vitals.heartRate > 100 || vitals.heartRate < 50
    ? T('patient.warning')
    : T('patient.normal');

  const airStatusLabel = vitals.airQuality > 100
    ? T('patient.warning')
    : T('patient.safe');

  const isInDanger = vitals.dangerLevels && vitals.dangerLevels.length > 0;

  const cardClass = isDark
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-200';

  const textPrimary = isDark ? 'text-white' : 'text-slate-800';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';
  const textAccent = 'text-sky-500';
  const textNormal = 'text-emerald-500';
  const textWarn = 'text-rose-500';

  const statCardClass = isDark ? 'bg-slate-800/60' : 'bg-slate-50';
  const dangerCardClass = isDark ? 'bg-rose-900/30 border-rose-700' : 'bg-rose-50 border-rose-300';

  const gyroOkay = vitals.gyroUpper === 'ok' && vitals.gyroWaist === 'ok';
  const isFallDetected = vitals.gyroStatus === 'FALL_DETECTED';

  const handleSimulateFall = () => {
    mockDataService.triggerFallAlert();
  };

  const handleApplyDebug = () => {
    mockDataService.setVitals({
      heartRate: debugVitals.heartRate,
      bodyTemp: debugVitals.bodyTemp,
      airQuality: debugVitals.airQuality,
      gyroStatus: debugVitals.gyroStatus,
      gyroUpper: debugVitals.gyroStatus === 'FALL_DETECTED' ? 'ok' : vitals.gyroUpper,
      gyroWaist: debugVitals.gyroStatus === 'FALL_DETECTED' ? 'ok' : vitals.gyroWaist,
    });
  };

  const handleDebugChange = (key, value) => {
    setDebugVitals((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Patient Profile Card */}
        <div className={`rounded-2xl border p-5 ${cardClass} ${isInDanger ? dangerCardClass : ''}`}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#38bdf8' }}>
            {T('patient.profile')}
          </div>
          <div className="flex items-center gap-4">
            <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${isDark ? 'bg-slate-700 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
              B
              {isInDanger && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <div className={`text-lg font-bold ${textPrimary}`}>{patient.name}({patient.age})</div>
              <div className={`text-sm ${textSecondary}`}>{patient.gender} - {patient.dob}</div>
            </div>
          </div>
        </div>

        {/* Live Vitals Grid */}
        <div className={`rounded-2xl border p-5 lg:col-span-3 ${cardClass} ${isInDanger ? dangerCardClass : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#38bdf8' }}>
              {T('patient.vitals')}
            </div>
            {isInDanger && (
              <div className="flex items-center gap-1 text-xs font-bold text-rose-500">
                <AlertTriangle size={12} />
                <span>{language === 'id' ? 'BAHAYA' : 'DANGER'}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Heart Rate */}
            <div className={`rounded-xl p-4 ${statCardClass} ${vitals.heartRate > 120 || vitals.heartRate < 50 ? dangerCardClass : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <Heart size={20} className="text-rose-500" />
                <span className={`text-xs font-medium ${textSecondary}`}>{T('patient.heartRate')}</span>
              </div>
              <div className={`text-2xl font-bold ${textPrimary}`}>{vitals.heartRate} <span className={`text-sm font-normal ${textSecondary}`}>{T('patient.bpm')}</span></div>
              <div className={`text-xs mt-1 ${vitals.heartRate > 120 || vitals.heartRate < 50 ? textWarn : textNormal}`}>
                Status: {heartStatusLabel}
              </div>
            </div>

            {/* Body Temperature */}
            <div className={`rounded-xl p-4 ${statCardClass} ${vitals.bodyTemp > 38.0 ? dangerCardClass : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <Thermometer size={20} className="text-orange-500" />
                <span className={`text-xs font-medium ${textSecondary}`}>{T('patient.bodyTemp')}</span>
              </div>
              <div className={`text-2xl font-bold ${textPrimary}`}>{vitals.bodyTemp} <span className={`text-sm font-normal ${textSecondary}`}>{T('patient.celsius')}</span></div>
              <div className={`text-xs mt-1 ${vitals.heatOn || vitals.bodyTemp > 38.0 ? textWarn : textNormal}`}>
                {vitals.heatOn ? T('patient.heatOn') : T('patient.heatOff')}
              </div>
            </div>

            {/* Air Quality */}
            <div className={`rounded-xl p-4 ${statCardClass} ${vitals.airQuality > 100 ? dangerCardClass : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <Cloud size={20} className="text-teal-500" />
                <span className={`text-xs font-medium ${textSecondary}`}>{T('patient.airQuality')}</span>
              </div>
              <div className={`text-2xl font-bold ${textPrimary}`}>{vitals.airQuality} <span className={`text-sm font-normal ${textSecondary}`}>{T('patient.aqi')}</span></div>
              <div className={`text-xs mt-1 ${vitals.airQuality > 100 ? textWarn : textNormal}`}>
                Status: {airStatusLabel}
              </div>
            </div>

            {/* Dual Gyro */}
            <div className={`rounded-xl p-4 ${statCardClass} ${isFallDetected ? dangerCardClass : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={20} className={`${isFallDetected ? 'text-rose-500 animate-pulse' : 'text-violet-500'}`} />
                <span className={`text-xs font-medium ${textSecondary}`}>{T('patient.dualGyro')}</span>
              </div>
              <div className={`text-2xl font-bold ${gyroOkay && !isFallDetected ? textNormal : textWarn}`}>{vitals.gyroStatus}</div>
              <div className={`text-xs mt-1 ${textSecondary}`}>
                {T('patient.upper')}: {T('patient.okay')} | {T('patient.waist')}: {T('patient.okay')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Controls */}
      <div className={`rounded-2xl border p-5 ${cardClass}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-slate-400" />
            <span className={`text-sm font-semibold ${textPrimary}`}>{T('debug.heading')}</span>
          </div>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showDebug ? (language === 'id' ? 'Sembunyikan' : 'Hide') : (language === 'id' ? 'Tampilkan' : 'Show')}
          </button>
        </div>

        {showDebug && (
          <div className="space-y-4">
            {/* Simulate Fall Alert Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSimulateFall}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 transition-colors shadow-lg"
              >
                <AlertTriangle size={16} />
                {T('debug.simulateFall')}
              </button>
            </div>

            {/* Vitals Control Sliders */}
            <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#38bdf8' }}>
                {T('debug.vitalsControl')}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Heart Rate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${textSecondary}`}>{T('debug.heartRate')}</span>
                    <span className={`text-sm font-bold ${textPrimary}`}>{debugVitals.heartRate} BPM</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    value={debugVitals.heartRate}
                    onChange={(e) => handleDebugChange('heartRate', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs ${textSecondary}`}>30</span>
                    <span className={`text-xs ${textSecondary}`}>180</span>
                  </div>
                </div>

                {/* Body Temperature */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${textSecondary}`}>{T('debug.bodyTemp')}</span>
                    <span className={`text-sm font-bold ${textPrimary}`}>{debugVitals.bodyTemp.toFixed(1)} C</span>
                  </div>
                  <input
                    type="range"
                    min="350"
                    max="420"
                    value={debugVitals.bodyTemp * 10}
                    onChange={(e) => handleDebugChange('bodyTemp', parseInt(e.target.value) / 10)}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs ${textSecondary}`}>35.0</span>
                    <span className={`text-xs ${textSecondary}`}>42.0</span>
                  </div>
                </div>

                {/* Air Quality */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${textSecondary}`}>{T('debug.airQuality')}</span>
                    <span className={`text-sm font-bold ${textPrimary}`}>{debugVitals.airQuality} AQI</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={debugVitals.airQuality}
                    onChange={(e) => handleDebugChange('airQuality', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs ${textSecondary}`}>0</span>
                    <span className={`text-xs ${textSecondary}`}>200</span>
                  </div>
                </div>

                {/* Gyro Status */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${textSecondary}`}>{T('debug.gyroStatus')}</span>
                    <span className={`text-sm font-bold ${debugVitals.gyroStatus === 'FALL_DETECTED' ? textWarn : textNormal}`}>
                      {debugVitals.gyroStatus === 'FALL_DETECTED' ? T('debug.fallDetected') : T('debug.normal')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDebugChange('gyroStatus', 'NORMAL')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                        debugVitals.gyroStatus === 'NORMAL'
                          ? 'bg-emerald-500 text-white'
                          : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {T('debug.normal')}
                    </button>
                    <button
                      onClick={() => handleDebugChange('gyroStatus', 'FALL_DETECTED')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                        debugVitals.gyroStatus === 'FALL_DETECTED'
                          ? 'bg-rose-500 text-white'
                          : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {T('debug.fallDetected')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleApplyDebug}
                  className="w-full py-2 px-4 rounded-lg bg-sky-500 text-white font-semibold text-sm hover:bg-sky-600 transition-colors"
                >
                  {language === 'id' ? 'Terapkan Perubahan' : 'Apply Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
