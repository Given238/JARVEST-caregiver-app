let audioContext = null;
let oscillator = null;
let gainNode = null;
let isPlaying = false;
let intervalId = null;

export function playEmergencySound() {
  if (isPlaying) return;
  isPlaying = true;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.connect(audioContext.destination);

    const playChime = () => {
      if (!audioContext || !isPlaying) return;

      oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.connect(gainNode);
      oscillator.start();

      oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.15);
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.45);

      oscillator.stop(audioContext.currentTime + 0.6);
      oscillator.onended = () => {
        oscillator = null;
      };
    };

    playChime();
    intervalId = setInterval(playChime, 2000);
  } catch (e) {
    console.warn('Web Audio API not supported:', e);
    isPlaying = false;
  }
}

export function stopEmergencySound() {
  isPlaying = false;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (oscillator) {
    try {
      oscillator.stop();
    } catch (e) {
      // already stopped
    }
    oscillator = null;
  }

  if (audioContext) {
    try {
      audioContext.close();
    } catch (e) {
      // already closed
    }
    audioContext = null;
  }

  gainNode = null;
}
