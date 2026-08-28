import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  User, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Folder 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActionItem } from '../../types';

export const ActionItemsHub: React.FC = () => {
  const { meetings, toggleActionItem, setActiveMeeting, setActiveTab } = useApp();

  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  // Flatten all action items across meetings with parent meeting reference
  const allActionItemsWithMeeting = useMemo(() => {
    const items: Array<{ item: ActionItem; meetingId: string; meetingTitle: string; project: string }> = [];
    meetings.forEach(m => {
      m.actionItems.forEach(item => {
        items.push({
          item,
          meetingId: m.id,
          meetingTitle: m.title,
          project: m.clientOrProject
        });
      });
    });
    return items;
  }, [meetings]);

  const uniqueAssignees = useMemo(() => {
    const assignees = new Set<string>();
    allActionItemsWithMeeting.forEach(x => assignees.add(x.item.assignee));
    return Array.from(assignees);
  }, [allActionItemsWithMeeting]);

  const filteredItems = useMemo(() => {
    return allActionItemsWithMeeting.filter(({ item }) => {
      if (statusFilter === 'pending' && item.completed) return false;
      if (statusFilter === 'completed' && !item.completed) return false;
      if (assigneeFilter !== 'all' && item.assignee !== assigneeFilter) return false;
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
      return true;
    });
  }, [allActionItemsWithMeeting, statusFilter, assigneeFilter, priorityFilter]);

  const handleJumpToMeeting = (meetingId: string) => {
    const found = meetings.find(m => m.id === meetingId);
    if (found) {
      setActiveMeeting(found);
      setActiveTab('record-upload');
    }
  };

  const pendingCount = allActionItemsWithMeeting.filter(x => !x.item.completed).length;
  const completedCount = allActionItemsWithMeeting.filter(x => x.item.completed).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-theme-primary flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Action Items & Accountability Hub
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted mt-1">
            Track automated AI task extractions, cross-language assignments, and project delivery deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-2xl bg-card-theme border border-theme px-3.5 py-2 text-xs text-theme-secondary shadow-sm">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Pending: <strong className="text-theme-primary">{pendingCount}</strong></span>
            <span className="text-theme-muted">|</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Completed: <strong className="text-theme-primary">{completedCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-theme bg-card-theme p-4 shadow-sm">
        {/* Status Filter */}
        <div className="flex rounded-xl border border-theme bg-card-subtle-theme p-1 text-xs">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              statusFilter === 'pending' ? 'bg-indigo-600 text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            Pending Tasks ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              statusFilter === 'completed' ? 'bg-indigo-600 text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              statusFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            All ({allActionItemsWithMeeting.length})
          </button>
        </div>

        {/* Assignee Filter */}
        <div className="flex-1 min-w-[180px]">
          <select
            aria-label="Filter by Assignee"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
          >
            <option value="all">Filter by Assignee (All)</option>
            {uniqueAssignees.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="min-w-[140px]">
          <select
            aria-label="Filter by Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Action Items List */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-theme bg-card-theme p-12 text-center shadow-sm">
          <CheckCircle2 className="h-10 w-10 text-emerald-500/60 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-theme-primary">All Caught Up!</h3>
          <p className="text-xs text-theme-muted mt-1">No action items match the selected filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(({ item, meetingId, meetingTitle, project }) => (
            <div
              key={item.id}
              onClick={() => toggleActionItem(meetingId, item.id)}
              className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.completed
                  ? 'border-theme bg-card-subtle-theme opacity-60'
                  : 'border-theme bg-card-theme hover:border-indigo-400/50 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 rounded border-theme text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <h3 className={`text-xs sm:text-sm font-semibold ${item.completed ? 'line-through text-theme-muted' : 'text-theme-primary'}`}>
                    {item.task}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-theme-muted">
                    <span className="flex items-center gap-1 font-medium text-theme-secondary">
                      <User className="h-3 w-3 text-indigo-500" />
                      <span>{item.assignee}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{item.dueDate}</span>
                    </span>
                    <span className="flex items-center gap-1 text-theme-muted">
                      <Folder className="h-3 w-3" />
                      <span>{project}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-theme">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                  item.priority === 'high'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    : item.priority === 'medium'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-card-subtle-theme text-theme-muted border-theme'
                }`}>
                  {item.priority}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJumpToMeeting(meetingId);
                  }}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold p-1"
                  title="Jump to source meeting notes"
                >
                  <span className="hidden md:inline">{meetingTitle}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionItemsHub;
