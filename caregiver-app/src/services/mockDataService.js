export const THRESHOLDS = {
  heartRate: { min: 50, max: 120 },
  bodyTemp: { max: 38.0 },
  airQuality: { max: 100 },
};

export const DANGER_LEVELS = {
  HEART_RATE_HIGH: 'heartRateHigh',
  HEART_RATE_LOW: 'heartRateLow',
  BODY_TEMP: 'bodyTemp',
  AIR_QUALITY: 'airQuality',
  FALL_DETECTED: 'fallDetected',
};

export function checkThresholds(vitals) {
  const dangers = [];

  if (vitals.heartRate < THRESHOLDS.heartRate.min) {
    dangers.push(DANGER_LEVELS.HEART_RATE_LOW);
  } else if (vitals.heartRate > THRESHOLDS.heartRate.max) {
    dangers.push(DANGER_LEVELS.HEART_RATE_HIGH);
  }

  if (vitals.bodyTemp > THRESHOLDS.bodyTemp.max) {
    dangers.push(DANGER_LEVELS.BODY_TEMP);
  }

  if (vitals.airQuality > THRESHOLDS.airQuality.max) {
    dangers.push(DANGER_LEVELS.AIR_QUALITY);
  }

  if (vitals.gyroStatus === 'FALL_DETECTED') {
    dangers.push(DANGER_LEVELS.FALL_DETECTED);
  }

  return dangers;
}

export function getMostSevereDanger(dangers) {
  if (dangers.includes(DANGER_LEVELS.FALL_DETECTED)) return DANGER_LEVELS.FALL_DETECTED;
  if (dangers.includes(DANGER_LEVELS.HEART_RATE_HIGH) || dangers.includes(DANGER_LEVELS.HEART_RATE_LOW)) return dangers[0];
  if (dangers.includes(DANGER_LEVELS.BODY_TEMP)) return DANGER_LEVELS.BODY_TEMP;
  if (dangers.includes(DANGER_LEVELS.AIR_QUALITY)) return DANGER_LEVELS.AIR_QUALITY;
  return null;
}

function getDangerDescriptionId(level, vitals) {
  switch (level) {
    case DANGER_LEVELS.FALL_DETECTED:
      return 'Pasien jatuh terdeteksi!';
    case DANGER_LEVELS.HEART_RATE_HIGH:
      return `Detak jantung pasien > ${THRESHOLDS.heartRate.max} BPM!`;
    case DANGER_LEVELS.HEART_RATE_LOW:
      return `Detak jantung pasien < ${THRESHOLDS.heartRate.min} BPM!`;
    case DANGER_LEVELS.BODY_TEMP:
      return `Suhu tubuh pasien > ${THRESHOLDS.bodyTemp.max}°C!`;
    case DANGER_LEVELS.AIR_QUALITY:
      return `Kualitas udara > ${THRESHOLDS.airQuality.max} AQI!`;
    default:
      return 'Peringatan darurat aktif!';
  }
}

function getDangerDescriptionEn(level, vitals) {
  switch (level) {
    case DANGER_LEVELS.FALL_DETECTED:
      return 'Fall detected for patient!';
    case DANGER_LEVELS.HEART_RATE_HIGH:
      return `Patient heart rate > ${THRESHOLDS.heartRate.max} BPM!`;
    case DANGER_LEVELS.HEART_RATE_LOW:
      return `Patient heart rate < ${THRESHOLDS.heartRate.min} BPM!`;
    case DANGER_LEVELS.BODY_TEMP:
      return `Patient body temperature > ${THRESHOLDS.bodyTemp.max}°C!`;
    case DANGER_LEVELS.AIR_QUALITY:
      return `Air quality > ${THRESHOLDS.airQuality.max} AQI!`;
    default:
      return 'Emergency warning active!';
  }
}

function logAudit(stateRef, type, descriptionId, descriptionEn) {
  const entry = {
    id: stateRef.nextAuditId++,
    type,
    time: new Date(),
    descriptionId,
    descriptionEn,
  };
  stateRef.auditLog = [entry, ...stateRef.auditLog];
}

let state = {
  theme: 'light',
  language: 'id',
  vestOn: true,
  patient: {
    name: 'Budi',
    age: 74,
    gender: 'L',
    dob: '1952/06/30',
  },
  vitals: {
    heartRate: 72,
    bodyTemp: 36.5,
    airQuality: 35,
    gyroUpper: 'ok',
    gyroWaist: 'ok',
    gyroStatus: 'NORMAL',
    heatOn: false,
    dangerLevels: [],
  },
  activeNotification: null,
  routines: [
    {
      id: 1,
      name: 'Morning Walk',
      times: ['07:00'],
    },
    {
      id: 2,
      name: 'Hydration Check',
      times: ['12:00', '13:00'],
    },
    {
      id: 3,
      name: 'Medication Time',
      times: ['10:00', '22:00'],
    },
  ],
  nextRoutineId: 4,
  dailyContext: 'Hari ini adalah hari Rabu, Sarah menjenguk pukul 2 sore. Minum air sudah dilakukan.',
  familyTree: [
    { name: 'Father', label: 'Ayah', person: 'Michael', status: 'deceased' },
    { name: 'Mother', label: 'Ibu', person: 'June', status: 'deceased' },
    { name: 'Brother', label: 'Saudara laki-laki', person: 'Matthew', status: 'alive' },
  ],
  auditLog: [
    {
      id: 1,
      type: 'incident',
      time: new Date(Date.now() - 3 * 60000),
      descriptionId: 'Pasien jatuh terdeteksi!',
      descriptionEn: 'Fall detected for patient!',
    },
    {
      id: 2,
      type: 'routine',
      time: new Date(Date.now() - 15 * 60000),
      descriptionId: 'Rutinitas Morning Walk dieksekusi',
      descriptionEn: 'Morning Walk routine executed',
    },
    {
      id: 3,
      type: 'routine',
      time: new Date(Date.now() - 4 * 60 * 60000),
      descriptionId: 'Rutinitas Medication Time dieksekusi',
      descriptionEn: 'Medication Time routine executed',
    },
  ],
  nextAuditId: 4,
  subscribers: new Set(),
};

function notify() {
  state.subscribers.forEach((cb) => cb(state));
}

export const mockDataService = {
  getState: () => state,

  subscribe: (cb) => {
    state.subscribers.add(cb);
    return () => state.subscribers.delete(cb);
  },

  setTheme: (theme) => {
    state = { ...state, theme };
    notify();
  },

  setLanguage: (language) => {
    state = { ...state, language };
    notify();
  },

  setVestOn: (on) => {
    state = { ...state, vestOn: on };
    notify();
  },

  setVitals: (vitals) => {
    const mergedVitals = { ...state.vitals, ...vitals };
    const dangers = checkThresholds(mergedVitals);
    mergedVitals.dangerLevels = dangers;

    const mostSevere = getMostSevereDanger(dangers);

    if (mostSevere && !state.activeNotification) {
      const descId = getDangerDescriptionId(mostSevere, mergedVitals);
      const descEn = getDangerDescriptionEn(mostSevere, mergedVitals);
      const notification = {
        id: Date.now(),
        level: mostSevere,
        dangers,
        descriptionId: descId,
        descriptionEn: descEn,
        timestamp: new Date(),
      };
      state = {
        ...state,
        vitals: mergedVitals,
        activeNotification: notification,
      };
      notify();

      logAudit(state, 'incident', descId, descEn);
    } else {
      state = { ...state, vitals: mergedVitals };
      notify();
    }
  },

  triggerFallAlert: () => {
    const mergedVitals = { ...state.vitals, gyroStatus: 'FALL_DETECTED', dangerLevels: [DANGER_LEVELS.FALL_DETECTED] };
    const descId = 'Pasien jatuh terdeteksi!';
    const descEn = 'Fall detected for patient!';
    const notification = {
      id: Date.now(),
      level: DANGER_LEVELS.FALL_DETECTED,
      dangers: [DANGER_LEVELS.FALL_DETECTED],
      descriptionId: descId,
      descriptionEn: descEn,
      timestamp: new Date(),
    };
    state = { ...state, vitals: mergedVitals, activeNotification: notification };
    notify();
    logAudit(state, 'incident', descId, descEn);
  },

  clearNotification: () => {
    state = { ...state, activeNotification: null };
    notify();
  },

  addRoutine: (name, times) => {
    const routine = { id: state.nextRoutineId++, name, times };
    state = { ...state, routines: [...state.routines, routine] };
    notify();
    return routine;
  },

  updateRoutine: (id, updates) => {
    state = {
      ...state,
      routines: state.routines.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    };
    notify();
  },

  removeRoutine: (id) => {
    state = { ...state, routines: state.routines.filter((r) => r.id !== id) };
    notify();
  },

  setDailyContext: (text) => {
    state = { ...state, dailyContext: text };
    notify();
  },

  setFamilyTree: (familyTree) => {
    state = { ...state, familyTree };
    notify();
  },

  logAudit: (type, descriptionId, descriptionEn) => {
    const entry = {
      id: state.nextAuditId++,
      type,
      time: new Date(),
      descriptionId,
      descriptionEn,
    };
    state = { ...state, auditLog: [entry, ...state.auditLog] };
    notify();
  },
};
