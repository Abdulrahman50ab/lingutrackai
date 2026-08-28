import React, { useState } from 'react';
import { 
  TranscriptSegment, 
  LanguageCode 
} from '../../types';
import { 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  Volume2, 
  FileAudio, 
  Tag,
  ArrowRightLeft
} from 'lucide-react';
import { ttsService } from '../../services/ttsService';
import { useApp } from '../../context/AppContext';

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ segments }) => {
  const { setCurrentAudioTime, updateMeeting, activeMeeting } = useApp();

  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showRomanUrduAll, setShowRomanUrduAll] = useState(true);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartEdit = (seg: TranscriptSegment) => {
    setEditingSegmentId(seg.id);
    setEditText(seg.text);
  };

  const handleSaveEdit = (segId: string) => {
    if (activeMeeting) {
      const updatedTranscript = segments.map(s => 
        s.id === segId ? { ...s, text: editText } : s
      );
      updateMeeting(activeMeeting.id, { transcript: updatedTranscript });
    }
    setEditingSegmentId(null);
  };

  const handleSpeakSegment = (seg: TranscriptSegment) => {
    if (activePlayingId === seg.id) {
      ttsService.stop();
      setActivePlayingId(null);
    } else {
      setActivePlayingId(seg.id);
      ttsService.speak(seg.text, seg.language as 'en' | 'ur' | 'ur-Latn', () => {
        setActivePlayingId(null);
      });
    }
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLanguageBadge = (lang: LanguageCode) => {
    switch (lang) {
      case 'ur':
        return { label: 'اردو (Nastaliq)', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30' };
      case 'ur-Latn':
        return { label: 'Roman Urdu', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/30' };
      case 'code-switched':
        return { label: 'Code-Switched (Mixed)', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/30' };
      default:
        return { label: 'English', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/30' };
    }
  };

  if (segments.length === 0) {
    return (
      <div className="rounded-2xl border border-theme bg-card-theme p-12 text-center shadow-sm">
        <FileAudio className="h-10 w-10 text-theme-muted mx-auto mb-3" />
        <h3 className="text-base font-semibold text-theme-primary">No Transcript Segments Available</h3>
        <p className="text-xs text-theme-muted mt-1 max-w-sm mx-auto">
          Start recording from the microphone or select a demo sample above to generate live multi-lingual transcripts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-theme bg-card-theme px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-3 text-xs text-theme-muted">
          <span className="font-semibold text-theme-primary">{segments.length} Speech Turns</span>
          <span>•</span>
          <span>Avg Confidence: <strong className="text-emerald-600 dark:text-emerald-400">96.8%</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRomanUrduAll(prev => !prev)}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium border transition-all ${
              showRomanUrduAll
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/30'
                : 'bg-card-subtle-theme text-theme-muted border-theme'
            }`}
          >
            <ArrowRightLeft className="h-3 w-3" />
            <span>Show Roman Urdu Phonetics</span>
          </button>
        </div>
      </div>

      {/* Transcript Segments Feed */}
      <div className="space-y-3">
        {segments.map((seg) => {
          const isUrduNative = seg.language === 'ur';
          const badge = getLanguageBadge(seg.language);
          const isEditing = editingSegmentId === seg.id;
          const isPlaying = activePlayingId === seg.id;

          return (
            <div
              key={seg.id}
              className={`rounded-2xl border transition-all p-4 ${
                isPlaying
                  ? 'border-indigo-500 bg-indigo-500/5 shadow-md ring-1 ring-indigo-500/20'
                  : 'border-theme bg-card-theme hover:border-indigo-400/50 shadow-sm'
              }`}
            >
              {/* Speaker Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-white/10 ${
                    seg.speakerColor === 'indigo' ? 'bg-indigo-600' :
                    seg.speakerColor === 'emerald' ? 'bg-emerald-600' :
                    seg.speakerColor === 'cyan' ? 'bg-cyan-600' : 'bg-amber-600'
                  }`}>
                    {seg.speakerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-theme-primary">{seg.speakerName}</span>
                      <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentAudioTime(seg.startTime)}
                      className="text-[10px] font-mono text-theme-muted hover:text-indigo-500 flex items-center gap-1 mt-0.5"
                    >
                      <span>{formatTimestamp(seg.startTime)} - {formatTimestamp(seg.endTime)}</span>
                    </button>
                  </div>
                </div>

                {/* Turn Actions */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleSpeakSegment(seg)}
                    className={`rounded-lg p-1.5 transition-colors ${
                      isPlaying
                        ? 'bg-indigo-600 text-white'
                        : 'text-theme-muted hover:bg-card-subtle-theme hover:text-theme-primary'
                    }`}
                    title="Audio playback via TTS"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopy(seg.id, seg.text)}
                    className="rounded-lg p-1.5 text-theme-muted hover:bg-card-subtle-theme hover:text-theme-primary transition-colors"
                    title="Copy transcript text"
                  >
                    {copiedId === seg.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => isEditing ? handleSaveEdit(seg.id) : handleStartEdit(seg)}
                    className="rounded-lg p-1.5 text-theme-muted hover:bg-card-subtle-theme hover:text-theme-primary transition-colors"
                    title="Edit segment"
                  >
                    {isEditing ? (
                      <Save className="h-3.5 w-3.5 text-indigo-500" />
                    ) : (
                      <Edit3 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Segment Text Content */}
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={`w-full rounded-xl border border-indigo-500 bg-input-theme p-3 text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm ${
                      isUrduNative ? 'urdu-text text-base' : ''
                    }`}
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingSegmentId(null)}
                      className="rounded-lg px-2.5 py-1 text-xs text-theme-muted hover:bg-card-subtle-theme"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(seg.id)}
                      className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Primary spoken text */}
                  <p className={`${
                    isUrduNative ? 'urdu-text text-base leading-relaxed text-emerald-700 dark:text-emerald-200' : 'text-xs sm:text-sm leading-relaxed text-theme-primary'
                  }`}>
                    {seg.text}
                  </p>

                  {/* Roman Urdu Phonetics Subtitle */}
                  {showRomanUrduAll && seg.romanUrduText && isUrduNative && (
                    <div className="rounded-xl bg-card-subtle-theme border border-theme px-3 py-1.5 text-xs text-cyan-700 dark:text-cyan-300 font-mono">
                      <span className="text-[10px] uppercase tracking-wider text-theme-muted block">Roman Urdu:</span>
                      {seg.romanUrduText}
                    </div>
                  )}

                  {/* English or Urdu Translation */}
                  {seg.translatedText && (
                    <div className="rounded-xl bg-card-subtle-theme border border-theme px-3 py-2 text-xs text-theme-secondary">
                      <span className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold block mb-0.5">
                        {seg.language === 'en' ? 'ترجمہ (اردو):' : 'English Translation:'}
                      </span>
                      <p className={seg.language === 'en' ? 'urdu-text text-sm text-theme-primary' : 'text-xs text-theme-secondary'}>
                        {seg.translatedText}
                      </p>
                    </div>
                  )}

                  {/* Code-switched terms chips */}
                  {seg.codeSwitchedWords && seg.codeSwitchedWords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-theme-muted flex items-center gap-1">
                        <Tag className="h-2.5 w-2.5" /> Tech Terms:
                      </span>
                      {seg.codeSwitchedWords.map((word, wIdx) => (
                        <span
                          key={wIdx}
                          className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 font-mono"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranscriptViewer;
