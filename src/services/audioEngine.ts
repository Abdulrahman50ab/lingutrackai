export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private isRecording = false;

  /**
   * Initializes audio context and requests user microphone stream
   */
  async startRecording(onFrequencyData?: (data: Uint8Array) => void): Promise<boolean> {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
      
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64; // Produces 32 frequency bins
      
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);
      this.isRecording = true;

      if (onFrequencyData) {
        this.pollFrequencyData(onFrequencyData);
      }
      return true;
    } catch (err) {
      console.warn('Microphone access unavailable or denied, falling back to synthetic waveform:', err);
      this.isRecording = true;
      if (onFrequencyData) {
        this.simulateFrequencyData(onFrequencyData);
      }
      return false;
    }
  }

  private pollFrequencyData(callback: (data: Uint8Array) => void) {
    if (!this.isRecording || !this.analyser) return;
    const buffer = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(buffer);
    callback(buffer);

    requestAnimationFrame(() => this.pollFrequencyData(callback));
  }

  private simulateFrequencyData(callback: (data: Uint8Array) => void) {
    if (!this.isRecording) return;
    const simulated = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      simulated[i] = Math.floor(Math.random() * 180) + 40;
    }
    callback(simulated);
    setTimeout(() => this.simulateFrequencyData(callback), 80);
  }

  stopRecording() {
    this.isRecording = false;
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  /**
   * Generates a pleasant synthesized confirmation tone for live interpretation turn
   */
  playNotificationChime(frequency = 587.33) {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Ignore audio synthesis errors on strict autoplay policies
    }
  }
}

export const audioEngine = new AudioEngine();
