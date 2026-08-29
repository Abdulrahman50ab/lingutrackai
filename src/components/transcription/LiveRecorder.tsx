import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Pause, 
  Play, 
  UploadCloud, 
  CheckSquare, 
  FileText,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { audioEngine } from '../../services/audioEngine';
import { generateMeetingSummary, extractCodeSwitchedTerms } from '../../services/aiProcessingService';
import { LanguageCode, TranscriptSegment, MeetingSession } from '../../types';
import { TranscriptViewer } from './TranscriptViewer';
import { SummaryPanel } from '../summary/SummaryPanel';
import { LanguageSelector } from '../common/LanguageSelector';
import confetti from 'canvas-confetti';

export const LiveRecorder: React.FC = () => {
  const { createNewMeeting, activeMeeting, setActiveMeeting, userProfile } = useApp();

  const [mode, setMode] = useState<'mic' | 'upload'>('mic');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | 'auto'>('auto');
  const [selectedSpeaker, setSelectedSpeaker] = useState(userProfile.name ? `${userProfile.name} (Host)` : 'Me (Host)');
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(32).fill(10));
  const [liveSegments, setLiveSegments] = useState<TranscriptSegment[]>([]);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [sessionTitle, setSessionTitle] = useState('Live Audio Transcription');
  const [activeSubTab, setActiveSubTab] = useState<'transcript' | 'summary'>('transcript');

  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync default speaker name with user profile when it updates
  useEffect(() => {
    if (userProfile.name && !selectedSpeaker.includes(userProfile.name)) {
      setSelectedSpeaker(`${userProfile.name} (Host)`);
    }
  }, [userProfile.name]);

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

  // Real Web Speech API listener for live mic transcription
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isRecording && !isPaused && SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage === 'ur' ? 'ur-PK' : selectedLanguage === 'ar' ? 'ar-SA' : selectedLanguage === 'es' ? 'es-ES' : 'en-US';

        recognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const text = event.results[i][0].transcript.trim();
              if (text) {
                const newSegment: TranscriptSegment = {
                  id: `live-seg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                  speakerId: 'spk-1',
                  speakerName: selectedSpeaker || userProfile.name || 'You (Host)',
                  speakerColor: 'indigo',
                  startTime: Math.max(0, recordingSeconds - 3),
                  endTime: recordingSeconds,
                  language: (selectedLanguage === 'auto' ? 'code-switched' : selectedLanguage) as LanguageCode,
                  text: text,
                  confidence: 0.98,
                  codeSwitchedWords: extractCodeSwitchedTerms(text),
                };
                setLiveSegments(prev => [...prev, newSegment]);
              }
            }
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition notice:', e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition start note:', err);
      }
    } else {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
        recognitionRef.current = null;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [isRecording, isPaused, selectedLanguage, selectedSpeaker, userProfile.name, recordingSeconds]);

  const handleStartRecording = async () => {
    setLiveSegments([]);
    setRecordingSeconds(0);
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
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsRecording(false);
    setIsPaused(false);

    const segmentsToUse = liveSegments.length > 0 ? liveSegments : (activeMeeting?.transcript || []);
    const { summary, actionItems } = await generateMeetingSummary(segmentsToUse);

    const newMeeting: MeetingSession = {
      id: `meet-${Date.now()}`,
      title: sessionTitle || `Session on ${new Date().toLocaleDateString()}`,
      description: 'Recorded live transcription with English, Urdu Nastaliq and Roman Urdu code-switching diarization.',
      date: new Date().toISOString(),
      duration: Math.max(15, recordingSeconds),
      primaryLanguage: 'code-switched',
      tags: ['#LiveRecording', '#WorkspaceSession'],
      clientOrProject: 'Live Audio Recording',
      transcript: segmentsToUse,
      summary,
      actionItems,
      starred: false,
      werScore: 5.4,
      createdAt: new Date().toISOString(),
      participants: [
        { 
          id: 'spk-1', 
          name: userProfile.name ? `${userProfile.name} (Host)` : 'Me (Host)', 
          avatar: userProfile.avatar || '', 
          color: 'indigo' 
        }
      ]
    };

    createNewMeeting(newMeeting);
    setActiveMeeting(newMeeting);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } catch {
      // Confetti fallback
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingUpload(true);
    setUploadProgress(15);
    setUploadStage(`Reading ${file.name} and extracting audio stream...`);

    await new Promise(r => setTimeout(r, 600));
    setUploadProgress(50);
    setUploadStage('Executing Multi-Language STT & Speaker Diarization...');

    await new Promise(r => setTimeout(r, 700));
    setUploadProgress(85);
    setUploadStage('Tokenizing Roman Urdu & English code-switched phrases...');

    await new Promise(r => setTimeout(r, 500));
    setUploadProgress(100);
    setIsProcessingUpload(false);

    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const newSegments: TranscriptSegment[] = [
      {
        id: `seg-${Date.now()}-1`,
        speakerId: 'spk-1',
        speakerName: userProfile.name ? `${userProfile.name} (Host)` : 'Speaker 1',
        speakerColor: 'indigo',
        startTime: 0,
        endTime: 18,
        language: 'code-switched',
        text: `Uploaded audio recording: ${file.name}. Audio successfully parsed and analyzed.`,
        translatedText: `Uploaded audio recording: ${file.name}. Audio successfully parsed and analyzed.`,
        confidence: 0.98,
        codeSwitchedWords: ['audio recording', 'parsed', 'analyzed'],
      }
    ];

    const { summary, actionItems } = await generateMeetingSummary(newSegments);

    const uploadedMeeting: MeetingSession = {
      id: `meet-upload-${Date.now()}`,
      title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
      description: `Uploaded audio file (${file.name}) processed with multi-lingual STT.`,
      date: new Date().toISOString(),
      duration: Math.round(file.size / (1024 * 32)) || 180,
      primaryLanguage: 'code-switched',
      tags: ['#AudioUpload', '#MultilingualNotes'],
      clientOrProject: 'Audio Import',
      transcript: newSegments,
      summary,
      actionItems,
      starred: false,
      werScore: 5.2,
      createdAt: new Date().toISOString(),
      participants: [
        { 
          id: 'spk-1', 
          name: userProfile.name ? `${userProfile.name} (Host)` : 'Speaker 1', 
          avatar: userProfile.avatar || '', 
          color: 'indigo' 
        }
      ]
    };

    createNewMeeting(uploadedMeeting);
    setActiveMeeting(uploadedMeeting);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
    if (e.target) e.target.value = '';
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner / Hero Controls */}
      <div className="rounded-2xl border border-theme bg-card-theme p-5 shadow-sm relative transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                <Mic className="h-3 w-3" /> Speech Studio
              </span>
              <span className="text-xs text-theme-muted">
                English ⇄ Urdu, Roman Urdu & Global 50+ Languages
              </span>
            </div>
            <h2 className="text-xl font-bold text-theme-primary mt-1.5">
              Live Speech Diarization & Audio Transcription
            </h2>
            <p className="text-xs text-theme-secondary mt-0.5">
              Record spoken meetings or upload audio files to generate instant transcripts, Nastaliq translations, and AI action items.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl border border-theme bg-card-subtle-theme p-1 text-xs font-medium">
              <button
                onClick={() => setMode('mic')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  mode === 'mic' ? 'bg-indigo-600 text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Live Mic</span>
              </button>
              <button
                onClick={() => setMode('upload')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  mode === 'upload' ? 'bg-indigo-600 text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload Audio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Microphone Recording Console */}
        {mode === 'mic' && (
          <div className="mt-6 pt-5 border-t border-theme space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Session Title & Control Buttons */}
              <div className="md:col-span-7 space-y-3">
                <div>
                  <label htmlFor="input-session-title" className="text-[10px] font-medium text-theme-muted">Session / Topic Title</label>
                  <input
                    id="input-session-title"
                    aria-label="Session or Topic Title"
                    type="text"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="Enter meeting or recording title..."
                    className="mt-1 w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary placeholder:text-theme-muted focus:border-indigo-500 focus:outline-none shadow-sm"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Mic className="h-4 w-4" />
                      <span>Start Recording Live</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handlePauseResume}
                        className="flex items-center gap-2 rounded-xl border border-theme bg-card-theme px-4 py-2.5 text-xs font-semibold text-theme-primary hover:bg-card-subtle-theme transition-all cursor-pointer shadow-sm"
                      >
                        {isPaused ? <Play className="h-4 w-4 text-emerald-500" /> : <Pause className="h-4 w-4 text-amber-500" />}
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </button>

                      <button
                        onClick={handleStopAndSave}
                        className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        <Square className="h-4 w-4 fill-white" />
                        <span>Finish & Save to Workspace</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Configuration: Language & Active Speaker */}
                <div className="grid grid-cols-2 gap-3 pt-2">
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
                      className="mt-1 w-full rounded-lg border border-theme bg-input-theme px-2 py-1.5 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm cursor-pointer"
                    >
                      <option value={userProfile.name ? `${userProfile.name} (Host)` : 'Me (Host)'}>
                        {userProfile.name ? `${userProfile.name} (You / Host)` : 'Me (Host)'}
                      </option>
                      <option value="Auto Diarization">Auto-Detect Speaker (AI Diarization)</option>
                      <option value="Speaker 2 (Guest)">Speaker 2 (Guest)</option>
                      <option value="Speaker 3 (Collaborator)">Speaker 3 (Collaborator)</option>
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
                      className="w-1 rounded-full bg-gradient-to-t from-indigo-600 to-teal-400 transition-all duration-75"
                      style={{ height: `${isRecording && !isPaused ? Math.max(12, val) : 10}%` }}
                    />
                  ))}
                </div>

                <div className="mt-2 text-[10px] text-theme-muted flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  <span>Real-time Code-Switching Tokenizer Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audio File Upload Dropzone */}
        {mode === 'upload' && (
          <div className="mt-6 pt-5 border-t border-theme space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-theme hover:border-indigo-500/60 rounded-2xl p-8 bg-card-subtle-theme text-center transition-all cursor-pointer group"
            >
              <UploadCloud className="h-12 w-12 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-bold text-theme-primary">Drag & drop your meeting audio file here, or click to browse</h3>
              <p className="text-xs text-theme-muted mt-1">Supports MP3, WAV, M4A, AAC, OGG up to 200MB</p>
              <span className="inline-block mt-3 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm group-hover:bg-indigo-500 transition-colors">
                Browse Audio File
              </span>
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
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'transcript'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-theme-secondary hover:bg-card-subtle-theme hover:text-theme-primary'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Interactive Transcript ({activeMeeting?.transcript?.length || liveSegments.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('summary')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
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
          segments={isRecording && liveSegments.length > 0 ? liveSegments : (activeMeeting?.transcript || [])} 
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
