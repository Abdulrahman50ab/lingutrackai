import React, { useState } from 'react';
import { 
  MeetingSession, 
  KeyTakeaway, 
} from '../../types';
import { 
  FileText, 
  CheckSquare, 
  Download, 
  Copy, 
  Check, 
  Calendar, 
  User, 
  Tag, 
  Flame, 
  Award, 
  AlertTriangle, 
  Lightbulb, 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { LanguageSelector } from '../common/LanguageSelector';
import { getLanguageByCode } from '../../services/languagesData';

interface SummaryPanelProps {
  meeting: MeetingSession | null;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ meeting }) => {
  const { toggleActionItem, addActionItem } = useApp();

  const [summaryLang, setSummaryLang] = useState<string>('en');
  const [copiedMd, setCopiedMd] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Salman Ahmed');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Tomorrow, 5:00 PM');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!meeting) {
    return (
      <div className="rounded-2xl border border-theme bg-card-theme p-12 text-center shadow-sm">
        <FileText className="h-10 w-10 text-theme-muted mx-auto mb-3" />
        <h3 className="text-base font-semibold text-theme-primary">No Meeting Summary Available</h3>
        <p className="text-xs text-theme-muted mt-1">Select a recorded session from the archive or record a new one.</p>
      </div>
    );
  }

  const { summary, actionItems } = meeting;
  const langMeta = getLanguageByCode(summaryLang);

  const getLocalizedOverviewText = () => {
    if (summaryLang === 'ur') return summary.overviewUrdu || summary.overview;
    if (summaryLang === 'ur-Latn') return summary.overviewRomanUrdu || summary.overview;
    if (summary.translations && summary.translations[summaryLang]) {
      return summary.translations[summaryLang];
    }
    return summary.overview;
  };

  const handleCopyMarkdown = () => {
    let md = `# ${meeting.title}\n**Date:** ${new Date(meeting.date).toLocaleDateString()} | **Project:** ${meeting.clientOrProject}\n\n`;
    md += `## Executive Summary (${langMeta.name})\n${getLocalizedOverviewText()}\n\n`;
    md += `## Key Takeaways\n`;
    summary.takeaways.forEach(t => {
      md += `- **${t.title}:** ${t.description}\n`;
    });
    md += `\n## Action Items\n`;
    actionItems.forEach(a => {
      md += `- [${a.completed ? 'x' : ' '}] **${a.task}** (Assigned to: ${a.assignee}, Due: ${a.dueDate})\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("LinguTrack AI — Meeting Summary & Action Items", 14, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Title: ${meeting.title}`, 14, 30);
    doc.text(`Project: ${meeting.clientOrProject} | Date: ${new Date(meeting.date).toLocaleDateString()}`, 14, 38);

    doc.setFont("helvetica", "bold");
    doc.text(`Executive Summary (${langMeta.name}):`, 14, 50);
    doc.setFont("helvetica", "normal");
    const overviewText = getLocalizedOverviewText();
    const splitOverview = doc.splitTextToSize(overviewText, 180);
    doc.text(splitOverview, 14, 58);

    let yPos = 58 + splitOverview.length * 6 + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Key Takeaways & Decisions:", 14, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    summary.takeaways.forEach((t) => {
      const takeText = doc.splitTextToSize(`• ${t.title}: ${t.description}`, 180);
      doc.text(takeText, 14, yPos);
      yPos += takeText.length * 6 + 2;
    });

    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Action Items:", 14, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    actionItems.forEach((a) => {
      const actText = doc.splitTextToSize(`[${a.completed ? 'DONE' : 'PENDING'}] ${a.task} (Assignee: ${a.assignee} | Due: ${a.dueDate})`, 180);
      doc.text(actText, 14, yPos);
      yPos += actText.length * 6 + 2;
    });

    doc.save(`${meeting.title.replace(/\s+/g, '_')}_Summary.pdf`);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const handleAddNewActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    addActionItem(meeting.id, {
      task: newTaskText,
      assignee: newTaskAssignee,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      completed: false,
    });

    setNewTaskText('');
    setShowAddForm(false);
  };

  const getCategoryIcon = (cat: KeyTakeaway['category']) => {
    switch (cat) {
      case 'decision':
        return <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'blocker':
        return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      case 'milestone':
        return <Flame className="h-4 w-4 text-amber-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-indigo-500" />;
    }
  };

  const quickSummaryLanguages = [
    { code: 'en', label: 'English' },
    { code: 'ur', label: 'اردو' },
    { code: 'ur-Latn', label: 'Roman Urdu' },
    { code: 'ar', label: 'العربية' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'zh', label: '中文' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview & Universal Language Output Selector */}
      <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-theme pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-theme-primary">
              AI Executive Summary
            </h2>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Sentiment: {summary.sentiment}
            </span>
          </div>

          {/* Universal Language Switcher for Summary output */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-theme-muted mr-1">Output Language:</span>
            
            {/* Quick Pills */}
            <div className="flex flex-wrap items-center rounded-xl border border-theme bg-card-subtle-theme p-0.5 text-xs">
              {quickSummaryLanguages.map((q) => (
                <button
                  key={q.code}
                  type="button"
                  onClick={() => setSummaryLang(q.code)}
                  className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
                    summaryLang === q.code ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-theme-muted hover:text-theme-primary'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Global Language Selector Dropdown */}
            <LanguageSelector
              selectedCode={summaryLang}
              onChange={setSummaryLang}
              compact
              buttonClassName="py-1 px-2.5 bg-card-subtle-theme border-theme text-[11px]"
            />
          </div>
        </div>

        {/* Localized Overview Content */}
        <p 
          dir={langMeta.dir}
          className={`leading-relaxed ${
            langMeta.dir === 'rtl' ? 'urdu-text text-lg text-emerald-700 dark:text-emerald-200' : 
            summaryLang === 'ur-Latn' ? 'text-sm font-mono text-cyan-700 dark:text-cyan-200' : 'text-sm text-theme-primary'
          }`}
        >
          {getLocalizedOverviewText()}
        </p>

        {/* Key Topics Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] font-semibold text-theme-muted flex items-center gap-1">
            <Tag className="h-3 w-3" /> Core Topics:
          </span>
          {summary.keyTopics.map((topic, idx) => (
            <span
              key={idx}
              className="rounded-lg bg-card-subtle-theme px-2.5 py-1 text-xs text-theme-secondary border border-theme"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Key Takeaways & Strategic Decisions Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
          Key Takeaways & Decisions ({summary.takeaways.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {summary.takeaways.map((takeaway) => (
            <div
              key={takeaway.id}
              className="rounded-2xl border border-theme bg-card-theme p-4 space-y-2 hover:border-indigo-400/50 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2">
                {getCategoryIcon(takeaway.category)}
                <h4 className="text-xs font-bold text-theme-primary">{takeaway.title}</h4>
              </div>
              <p className="text-xs text-theme-muted leading-relaxed">
                {takeaway.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items Hub with Completion Toggle */}
      <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-theme pb-3">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-theme-primary">
              Assigned Action Items ({actionItems.filter(a => !a.completed).length} Pending / {actionItems.length} Total)
            </h3>
          </div>

          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="rounded-xl bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
          >
            {showAddForm ? 'Close Form' : '+ Add Action Item'}
          </button>
        </div>

        {/* Add New Item Form */}
        {showAddForm && (
          <form onSubmit={handleAddNewActionItem} className="rounded-xl border border-theme bg-card-subtle-theme p-4 space-y-3 shadow-inner">
            <div>
              <label className="text-[11px] font-semibold text-theme-secondary">Action Item Description</label>
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="E.g. Deploy Redis cache configuration to production server"
                className="mt-1 w-full rounded-lg border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary placeholder:text-theme-muted focus:border-indigo-500 focus:outline-none shadow-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-theme-muted">Assignee</label>
                <input
                  type="text"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-theme bg-input-theme px-2 py-1.5 text-xs text-theme-primary"
                />
              </div>
              <div>
                <label className="text-[10px] text-theme-muted">Due Date</label>
                <input
                  type="text"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-theme bg-input-theme px-2 py-1.5 text-xs text-theme-primary"
                />
              </div>
              <div>
                <label className="text-[10px] text-theme-muted">Priority</label>
                <select
                  aria-label="Action Item Priority"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                  className="mt-1 w-full rounded-lg border border-theme bg-input-theme px-2 py-1.5 text-xs text-theme-primary"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-theme-muted hover:bg-card-theme"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm"
              >
                Save Action Item
              </button>
            </div>
          </form>
        )}

        {/* Action Items List */}
        <div className="space-y-2.5">
          {actionItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleActionItem(meeting.id, item.id)}
              className={`flex items-start justify-between gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                item.completed
                  ? 'border-theme bg-card-subtle-theme opacity-60'
                  : 'border-theme bg-card-theme hover:border-indigo-400/50 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  aria-label={`Mark task as ${item.completed ? 'incomplete' : 'complete'}: ${item.task}`}
                  checked={item.completed}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 rounded border-theme text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className={`text-xs sm:text-sm font-medium ${item.completed ? 'line-through text-theme-muted' : 'text-theme-primary'}`}>
                    {item.task}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-theme-muted">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-indigo-500" />
                      <strong className="text-theme-secondary">{item.assignee}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{item.dueDate}</span>
                    </span>
                  </div>
                </div>
              </div>

              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                item.priority === 'high'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  : item.priority === 'medium'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  : 'bg-card-subtle-theme text-theme-muted border-theme'
              }`}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme bg-card-theme p-4 shadow-sm">
        <div className="text-xs text-theme-muted">
          Export full summary, decisions, and action items in {langMeta.name} for external team handoff.
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 rounded-xl border border-theme bg-card-subtle-theme px-3 py-2 text-xs font-semibold text-theme-primary hover:bg-card-theme transition-all shadow-sm"
          >
            {copiedMd ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedMd ? 'Copied Markdown' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
