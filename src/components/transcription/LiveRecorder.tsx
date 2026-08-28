import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Pause, 
  Play, 
  UploadCloud, 
  FileAudio, 
  CheckSquare, 
  FileText,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { audioEngine } from '../../services/audioEngine';
import { generateMeetingSummary, extractCodeSwitchedTerms } from '../../services/aiProcessingService';
import { LanguageCode, TranscriptSegment, MeetingSession } from '../../types';
import { TranscriptViewer } from './TranscriptViewer';
import { SummaryPanel } from '../summary/SummaryPanel';
import { LanguageSelector } from '../common/LanguageSelector';
import confetti from 'canvas-confetti';

const mockLivePhrases = [
  { text: "Assalam-o-Alaikum team. Aaj ka main agenda hai microservices latency fix karna.", lang: "code-switched", speaker: "Hamza Farooq (Lead)" },
  { text: "Thanks Hamza. The response time in Dubai during peak hours is currently 2.8 seconds.", lang: "en", speaker: "David Miller (Product)" },
  { text: "Maine Redis cache verify kiya hai. Database connection pool exhaust ho raha tha.", lang: "code-switched", speaker: "Salman Ahmed (DevOps)" },
  { text: "فرنٹ اینڈ پر ہم نے نستعلیق فونٹس اور آر ٹی ایل ڈائریکشن کی سپورٹ شامل کر دی ہے۔", lang: "ur", speaker: "Sara Khan (Frontend)" },
  { text: "Zabardast! Load test run karein 500 concurrent users k sath and update the client.", lang: "code-switched", speaker: "Hamza Farooq (Lead)" }
];

export const LiveRecorder: React.FC = () => {
  const { createNewMeeting, activeMeeting, setActiveMeeting } = useApp();

  const [mode, setMode] = useState<'mic' | 'upload'>('mic');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | 'auto'>('auto');
  const [selectedSpeaker, setSelectedSpeaker] = useState('Hamza Farooq (Lead)');
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(32).fill(10));
  const [liveSegments, setLiveSegments] = useState<TranscriptSegment[]>([]);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [sessionTitle, setSessionTitle] = useState('Live Standup & Urdu Localization Review');
  const [activeSubTab, setActiveSubTab] = useState<'transcript' | 'summary'>('transcript');

  const timerRef = useRef<number | null>(null);
  const phraseIndexRef = useRef(0);

  // Timer interval for recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Simulate incoming live transcript segments during live recording
  useEffect(() => {
    let interval: number | null = null;
    if (isRecording && !isPaused) {
      interval = window.setInterval(() => {
        if (phraseIndexRef.current < mockLivePhrases.length) {
          const item = mockLivePhrases[phraseIndexRef.current];
          const newSegment: TranscriptSegment = {
            id: `live-seg-${Date.now()}`,
            speakerId: `spk-${phraseIndexRef.current + 1}`,
            speakerName: item.speaker,
            speakerColor: phraseIndexRef.current % 2 === 0 ? 'indigo' : 'emerald',
            startTime: Math.max(0, recordingSeconds - 4),
            endTime: recordingSeconds,
            language: (selectedLanguage === 'auto' ? item.lang : selectedLanguage) as LanguageCode,
            text: item.text,
            confidence: 0.96,
            codeSwitchedWords: extractCodeSwitchedTerms(item.text),
          };

          setLiveSegments(prev => [...prev, newSegment]);
          phraseIndexRef.current += 1;
        }
      }, 6000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused, recordingSeconds, selectedLanguage]);

  const handleStartRecording = async () => {
    setLiveSegments([]);
    setRecordingSeconds(0);
    phraseIndexRef.current = 0;
    setIsRecording(true);
    setIsPaused(false);

    await audioEngine.startRecording((buffer) => {
      const heights = Array.from(buffer.slice(0, 32)).map(v => Math.max(8, Math.min(100, Math.round((v / 255) * 100))));
      setFrequencyData(heights);
    });
  };

  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
  };

  const handleStopAndSave = async () => {
    audioEngine.stopRecording();
    setIsRecording(false);
    setIsPaused(false);

    const segmentsToUse = liveSegments.length > 0 ? liveSegments : activeMeeting?.transcript || [];
    const { summary, actionItems } = await generateMeetingSummary(segmentsToUse);

    const newMeeting: MeetingSession = {
      id: `meet-${Date.now()}`,
      title: sessionTitle || `Session on ${new Date().toLocaleDateString()}`,
      description: 'Recorded live transcription with English, Urdu Nastaliq and Roman Urdu code-switching diarization.',
      date: new Date().toISOString(),
      duration: Math.max(15, recordingSeconds),
      primaryLanguage: 'code-switched',
      tags: ['#LiveRecording', '#UrduLocalization', '#RemoteTeam'],
      clientOrProject: 'Client Sprint Alpha',
      transcript: segmentsToUse,
      summary,
      actionItems,
      starred: true,
      werScore: 6.2,
      createdAt: new Date().toISOString(),
      participants: [
        { id: 'spk-1', name: 'Hamza Farooq (Lead)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', color: 'indigo' },
        { id: 'spk-2', name: 'Salman Ahmed (DevOps)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', color: 'emerald' },
        { id: 'spk-3', name: 'Sara Khan (Frontend)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', color: 'cyan' },
      ]
    };

    createNewMeeting(newMeeting);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } catch {
      // Confetti fallback
    }
  };

  const handleTriggerDemoAudio = async (_demoKey: string) => {
    setIsProcessingUpload(true);
    setUploadProgress(10);
    setUploadStage('Extracting audio frequencies & analyzing audio codec...');

    await new Promise(r => setTimeout(r, 600));
    setUploadProgress(35);
    setUploadStage('Executing Multi-Language STT & Speaker Diarization...');

    await new Promise(r => setTimeout(r, 800));
    setUploadProgress(70);
    setUploadStage('Tokenizing Roman Urdu & English code-switched phrases...');

    await new Promise(r => setTimeout(r, 700));
    setUploadProgress(95);
    setUploadStage('Synthesizing AI Executive Summary & Action Items...');

    await new Promise(r => setTimeout(r, 500));
    setUploadProgress(100);
    setIsProcessingUpload(false);

    if (activeMeeting) {
      setActiveMeeting(activeMeeting);
    }
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner / Hero Controls */}
      <div className="rounded-2xl border border-theme bg-card-theme p-5 shadow-sm relative overflow-hidden transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                <Mic className="h-3 w-3" /> Speech Studio
              </span>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Urdu RTL & Roman Support
              </span>
            </div>
            <h1 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-theme-primary">
              Multi-Language Audio Transcription & Notes
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-theme-muted max-w-2xl">
              Record microphone streams or upload meeting recordings in English, Urdu (اردو), and Roman Urdu. Get speaker diarization, code-switched token highlights, and instant AI action items.
            </p>
          </div>

          {/* Mode Switcher: Mic vs Upload */}
          <div className="flex items-center rounded-xl bg-card-subtle-theme p-1 border border-theme self-start lg:self-auto">
            <button
              onClick={() => setMode('mic')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                mode === 'mic'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>Live Mic Studio</span>
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                mode === 'upload'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload Audio</span>
            </button>
          </div>
        </div>

        {/* Live Microphone Recording Panel */}
        {mode === 'mic' && (
          <div className="mt-6 pt-5 border-t border-theme">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Session Title input & Controls */}
              <div className="md:col-span-4 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-theme-muted">Session Name</label>
                  <input
                    type="text"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary placeholder:text-theme-muted focus:border-indigo-500 focus:outline-none shadow-sm"
                    placeholder="E.g. Q3 Sprint Planning"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <LanguageSelector
                      label="Language Mode"
                      selectedCode={selectedLanguage}
                      onChange={(code) => setSelectedLanguage(code as LanguageCode)}
                      compact
                      buttonClassName="w-full mt-1 bg-input-theme"
                    />
                  </div>
                  <div>
                    <label htmlFor="select-active-speaker" className="text-[10px] font-medium text-theme-muted">Active Speaker</label>
                    <select
                      id="select-active-speaker"
                      aria-label="Active Speaker Selection"
                      value={selectedSpeaker}
                      onChange={(e) => setSelectedSpeaker(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-theme bg-input-theme px-2 py-1.5 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
                    >
                      <option value="Hamza Farooq (Lead)">Hamza Farooq</option>
                      <option value="Salman Ahmed (DevOps)">Salman Ahmed</option>
                      <option value="Sara Khan (Frontend)">Sara Khan</option>
                      <option value="David Miller (Product)">David Miller</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Real-time Frequency Waveform Visualizer */}
              <div className="md:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-theme bg-card-subtle-theme p-4 min-h-[110px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${isRecording ? (isPaused ? 'bg-amber-500' : 'bg-rose-500 animate-pulse') : 'bg-slate-400'}`} />
                  <span className="font-mono text-sm font-bold text-theme-primary tracking-widest">
                    {formatTimer(recordingSeconds)}
                  </span>
                  <span className="text-[10px] text-theme-muted">
                    {isRecording ? (isPaused ? '(Paused)' : 'Recording Live') : 'Ready to record'}
                  </span>
                </div>

                {/* Animated Waveform Bars */}
                <div className="flex items-end justify-center gap-1 h-12 w-full px-2">
                  {frequencyData.map((val, idx) => (
                    <div
                      key={idx}
                      className="sound-wave-bar bg-gradient-to-t from-indigo-600 via-indigo-400 to-emerald-500"
                      style={{
                        height: isRecording && !isPaused ? `${val}%` : '15%',
                        opacity: isRecording ? (isPaused ? 0.4 : 0.9) : 0.25,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-3 flex flex-col gap-2">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-rose-900/20 hover:from-rose-500 hover:to-indigo-500 transition-all hover:scale-[1.02]"
                  >
                    <Mic className="h-4 w-4" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={handlePauseResume}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-theme bg-card-theme px-3 py-2.5 text-xs font-semibold text-theme-primary hover:bg-card-subtle-theme transition-all shadow-sm"
                      >
                        {isPaused ? <Play className="h-3.5 w-3.5 text-emerald-600" /> : <Pause className="h-3.5 w-3.5 text-amber-500" />}
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </button>
                      <button
                        onClick={handleStopAndSave}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-all"
                      >
                        <Square className="h-3.5 w-3.5" />
                        <span>Finish & Save</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-theme-muted px-1">
                  <span>Microphone: Default Input</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">96kHz / 24-bit</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audio File Upload Dropzone & Demo Selector */}
        {mode === 'upload' && (
          <div className="mt-6 pt-5 border-t border-theme space-y-4">
            <div className="border-2 border-dashed border-theme hover:border-indigo-500/60 rounded-2xl p-6 bg-card-subtle-theme text-center transition-all cursor-pointer">
              <UploadCloud className="h-10 w-10 text-indigo-500 mx-auto mb-2 animate-bounce" style={{ animationDuration: '3s' }} />
              <h3 className="text-sm font-semibold text-theme-primary">Drag & drop your meeting audio file here</h3>
              <p className="text-xs text-theme-muted mt-1">Supports MP3, WAV, M4A, AAC, OGG up to 200MB</p>
            </div>

            {/* Quick Demo Pre-loaded Audio Files */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-theme-muted mb-2">
                Or test with sample multilingual meeting audio:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleTriggerDemoAudio('demo-1')}
                  disabled={isProcessingUpload}
                  className="flex items-start gap-2.5 rounded-xl border border-theme bg-card-theme p-3 text-left hover:border-indigo-500 transition-all shadow-sm"
                >
                  <FileAudio className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-theme-primary">Code-Switched Standup</div>
                    <div className="text-[10px] text-theme-muted">Urdu & English mixed (23 mins)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleTriggerDemoAudio('demo-2')}
                  disabled={isProcessingUpload}
                  className="flex items-start gap-2.5 rounded-xl border border-theme bg-card-theme p-3 text-left hover:border-indigo-500 transition-all shadow-sm"
                >
                  <FileAudio className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-theme-primary">Cross-Border Legal Call</div>
                    <div className="text-[10px] text-theme-muted">London & Lahore (16 mins)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleTriggerDemoAudio('demo-3')}
                  disabled={isProcessingUpload}
                  className="flex items-start gap-2.5 rounded-xl border border-theme bg-card-theme p-3 text-left hover:border-indigo-500 transition-all shadow-sm"
                >
                  <FileAudio className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-theme-primary">Roman Urdu Ad Review</div>
                    <div className="text-[10px] text-theme-muted">Marketing & Reels (14 mins)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Processing Progress Bar */}
            {isProcessingUpload && (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                    {uploadStage}
                  </span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-300 font-bold">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-card-subtle-theme">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Segment / Subtab Selector: Transcript vs AI Summary */}
      <div className="flex items-center justify-between border-b border-theme pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('transcript')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeSubTab === 'transcript'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-theme-secondary hover:bg-card-subtle-theme hover:text-theme-primary'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Interactive Transcript ({activeMeeting?.transcript.length || liveSegments.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('summary')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeSubTab === 'summary'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-theme-secondary hover:bg-card-subtle-theme hover:text-theme-primary'
            }`}
          >
            <CheckSquare className="h-4 w-4 text-emerald-400" />
            <span>AI Executive Notes & Action Items</span>
          </button>
        </div>

        {activeMeeting && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-theme-muted">
            <span>Project: <strong className="text-theme-primary">{activeMeeting.clientOrProject}</strong></span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">WER: {activeMeeting.werScore}% (Ultra Accurate)</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'transcript' ? (
        <TranscriptViewer 
          segments={isRecording && liveSegments.length > 0 ? liveSegments : activeMeeting?.transcript || []} 
        />
      ) : (
        <SummaryPanel 
          meeting={activeMeeting} 
        />
      )}
    </div>
  );
};

export default LiveRecorder;
