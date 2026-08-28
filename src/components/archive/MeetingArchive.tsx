import React, { useMemo } from 'react';
import { 
  MeetingSession, 
} from '../../types';
import { 
  Search, 
  Clock, 
  Star, 
  Trash2, 
  FolderArchive, 
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MeetingArchive: React.FC = () => {
  const { 
    meetings, 
    activeMeeting, 
    setActiveMeeting, 
    setActiveTab, 
    deleteMeeting, 
    toggleStarMeeting,
    searchQuery,
    setSearchQuery,
    languageFilter,
    setLanguageFilter,
    tagFilter,
    setTagFilter
  } = useApp();

  // Filter meetings by query, language, tag
  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = meeting.title.toLowerCase().includes(q);
        const matchesClient = meeting.clientOrProject.toLowerCase().includes(q);
        const matchesOverview = meeting.summary.overview.toLowerCase().includes(q);
        const matchesTags = meeting.tags.some(t => t.toLowerCase().includes(q));
        const matchesTranscript = meeting.transcript.some(t => 
          t.text.toLowerCase().includes(q) || 
          (t.romanUrduText && t.romanUrduText.toLowerCase().includes(q)) ||
          (t.translatedText && t.translatedText.toLowerCase().includes(q))
        );
        if (!matchesTitle && !matchesClient && !matchesOverview && !matchesTags && !matchesTranscript) {
          return false;
        }
      }

      if (languageFilter !== 'all') {
        if (meeting.primaryLanguage !== languageFilter) return false;
      }

      if (tagFilter !== 'all') {
        if (!meeting.tags.includes(tagFilter)) return false;
      }

      return true;
    });
  }, [meetings, searchQuery, languageFilter, tagFilter]);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    meetings.forEach(m => m.tags.forEach(t => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [meetings]);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s > 0 ? `${s}s` : ''}`;
  };

  const handleSelectMeeting = (meeting: MeetingSession) => {
    setActiveMeeting(meeting);
    setActiveTab('record-upload');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-theme-primary flex items-center gap-2">
            <FolderArchive className="h-6 w-6 text-indigo-500" />
            Meeting Archive & Multilingual Search
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted mt-1">
            Search full transcripts, Roman Urdu keywords, action items, and summaries across your team's conversations.
          </p>
        </div>

        <div className="text-xs text-theme-muted flex items-center gap-2 bg-card-theme px-3 py-1.5 rounded-xl border border-theme self-start shadow-sm">
          <span>Total Records: <strong className="text-theme-primary">{meetings.length}</strong></span>
          <span>•</span>
          <span>Filtered: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredMeetings.length}</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="rounded-2xl border border-theme bg-card-theme p-4 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword in English, Urdu, or Roman Urdu..."
              className="w-full rounded-xl border border-theme bg-input-theme py-2 pl-9 pr-4 text-xs text-theme-primary placeholder:text-theme-muted focus:border-indigo-500 focus:outline-none shadow-sm"
            />
          </div>

          {/* Language Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              aria-label="Filter by Language and Script"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
            >
              <option value="all">All Languages & Scripts (50+)</option>
              <option value="en">English (US / UK)</option>
              <option value="ur">Urdu Native (اردو نستعلیق)</option>
              <option value="ur-Latn">Roman Urdu (Latin Script)</option>
              <option value="code-switched">Code-Switched (Mixed)</option>
              <option value="ar">Arabic (العربية)</option>
              <option value="es">Spanish (Español)</option>
              <option value="fr">French (Français)</option>
              <option value="de">German (Deutsch)</option>
              <option value="zh">Chinese (中文)</option>
              <option value="ja">Japanese (日本語)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="pt">Portuguese (Português)</option>
              <option value="ru">Russian (Русский)</option>
              <option value="tr">Turkish (Türkçe)</option>
            </select>
          </div>

          {/* Tag Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              aria-label="Filter by Project Tag"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
            >
              <option value="all">All Project Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-theme-muted mr-1">Quick Filters:</span>
          {allTags.slice(0, 5).map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? 'all' : tag)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                tagFilter === tag
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-card-subtle-theme text-theme-secondary hover:text-theme-primary border border-theme'
              }`}
            >
              {tag}
            </button>
          ))}
          {tagFilter !== 'all' && (
            <button
              onClick={() => setTagFilter('all')}
              className="text-[11px] text-rose-500 hover:underline ml-2"
            >
              Clear Tag
            </button>
          )}
        </div>
      </div>

      {/* Meeting Cards Grid */}
      {filteredMeetings.length === 0 ? (
        <div className="rounded-2xl border border-theme bg-card-theme p-12 text-center shadow-sm">
          <Search className="h-10 w-10 text-theme-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold text-theme-primary">No Meetings Found</h3>
          <p className="text-xs text-theme-muted mt-1">Try adjusting your search terms or filter selections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeetings.map((meeting) => {
            const isSelected = activeMeeting?.id === meeting.id;

            return (
              <div
                key={meeting.id}
                className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all glass-card-hover ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/5 shadow-md ring-1 ring-indigo-500/20'
                    : 'border-theme bg-card-theme hover:border-indigo-400/50 shadow-sm'
                }`}
              >
                <div>
                  {/* Top Bar: Project & Star */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      {meeting.clientOrProject}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStarMeeting(meeting.id);
                        }}
                        className="text-theme-muted hover:text-amber-500 p-1"
                      >
                        <Star className={`h-4 w-4 ${meeting.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMeeting(meeting.id);
                        }}
                        className="text-theme-muted hover:text-rose-500 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => handleSelectMeeting(meeting)}
                    className="text-sm font-bold text-theme-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {meeting.title}
                  </h3>

                  {/* Summary Snippet */}
                  <p className="text-xs text-theme-muted mt-2 line-clamp-2 leading-relaxed">
                    {meeting.summary.overview}
                  </p>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {meeting.tags.map(t => (
                      <span key={t} className="text-[10px] text-theme-secondary bg-card-subtle-theme px-1.5 py-0.5 rounded border border-theme">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-4 pt-3 border-t border-theme flex items-center justify-between text-[11px] text-theme-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(meeting.duration)}</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>{meeting.actionItems.length} tasks</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectMeeting(meeting)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Open Note</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MeetingArchive;
