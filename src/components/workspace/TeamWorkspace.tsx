import React, { useState, useEffect, useRef } from 'react';
import { 
  Users2, 
  UserPlus, 
  ShieldCheck, 
  Crown, 
  Building2, 
  MessageSquare, 
  Send, 
  Check, 
  Trash2, 
  Plus, 
  Lock, 
  Sparkles, 
  FileText, 
  RefreshCw,
  HardDrive,
  UserCheck,
  Share2,
  Mic,
  Globe2,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export const TeamWorkspace: React.FC = () => {
  const { 
    userProfile, 
    setIsUpgradeModalOpen, 
    workspaces, 
    activeWorkspace, 
    setActiveWorkspace, 
    workspaceMembers, 
    workspaceMessages, 
    createWorkspace, 
    inviteMemberToWorkspace, 
    removeMemberFromWorkspace, 
    joinWorkspaceWithCode, 
    sendWorkspaceMessage,
    meetings,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'members' | 'settings'>('chat');
  
  // Modals state
  const [showCreateWsModal, setShowCreateWsModal] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');
  const [isCreatingWs, setIsCreatingWs] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Member' | 'Translator' | 'Viewer'>('Member');
  const [isInviting, setIsInviting] = useState(false);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinInviteCode, setJoinInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Chat message state
  const [chatInput, setChatInput] = useState('');
  const [selectedMeetingAttachment, setSelectedMeetingAttachment] = useState<string>('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [workspaceMessages]);

  const isSoloMode = activeWorkspace?.id === 'personal-solo';
  const isOwner = activeWorkspace?.ownerEmail === userProfile.email;
  const isAdminOrOwner = isOwner || workspaceMembers.some(m => m.userEmail === userProfile.email && (m.role === 'Admin' || m.role === 'Owner'));

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setIsCreatingWs(true);
    const created = await createWorkspace(newWsName, newCompanyName, newWsDesc);
    setIsCreatingWs(false);
    if (created) {
      setShowCreateWsModal(false);
      setNewWsName('');
      setNewCompanyName('');
      setNewWsDesc('');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    const ok = await inviteMemberToWorkspace(inviteEmail, inviteRole, inviteName);
    setIsInviting(false);
    if (ok) {
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteName('');
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinInviteCode.trim()) return;
    setIsJoining(true);
    setJoinError(null);
    const ok = await joinWorkspaceWithCode(joinInviteCode);
    setIsJoining(false);
    if (ok) {
      setShowJoinModal(false);
      setJoinInviteCode('');
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      setJoinError('Invalid or expired workspace invite code. Please check with your workspace owner.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && !selectedMeetingAttachment) return;
    setIsSendingMsg(true);
    
    let meetingAttach: { id: string; title: string } | undefined = undefined;
    if (selectedMeetingAttachment) {
      const found = meetings.find(m => m.id === selectedMeetingAttachment);
      if (found) {
        meetingAttach = { id: found.id, title: found.title };
      }
    }

    await sendWorkspaceMessage(chatInput, meetingAttach);
    setChatInput('');
    setSelectedMeetingAttachment('');
    setIsSendingMsg(false);
  };

  const handleCopyInviteLink = () => {
    if (!activeWorkspace?.inviteCode || isSoloMode) return;
    const inviteUrl = `${window.location.origin}/?join=${activeWorkspace.inviteCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Top Workspace Switcher Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-theme pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-2xl">{isSoloMode ? '👤' : (activeWorkspace?.icon || '🏢')}</span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-theme-primary flex items-center gap-2">
              {activeWorkspace ? activeWorkspace.name : 'Workspace Hub'}
            </h1>
            {activeWorkspace && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isSoloMode 
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : isOwner 
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
              }`}>
                {isSoloMode ? <User className="h-3 w-3" /> : <Crown className="h-3 w-3" />}
                <span>{isSoloMode ? 'Solo Mode' : (isOwner ? 'Workspace Owner' : 'Invited Team Member')}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-theme-muted">
            {isSoloMode 
              ? 'Private Freelancer Space • Your personal meetings and recordings are completely private.'
              : `${activeWorkspace?.companyName || activeWorkspace?.name} • Strict Invite-Only Company Team Space`}
          </p>
        </div>

        {/* Action Controls & Workspace Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Workspace Switcher Dropdown */}
          <div className="relative">
            <select
              value={activeWorkspace?.id || 'personal-solo'}
              onChange={(e) => {
                const found = workspaces.find(w => w.id === e.target.value);
                if (found) setActiveWorkspace(found);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-theme bg-card-theme text-theme-primary focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer"
            >
              {workspaces.map(w => (
                <option key={w.id} value={w.id}>
                  {w.id === 'personal-solo' ? '👤 Solo Workspace (Personal)' : `🏢 ${w.name} (${w.ownerEmail === userProfile.email ? 'Owner' : 'Team'})`}
                </option>
              ))}
            </select>
          </div>

          {!isSoloMode && activeWorkspace && (
            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-theme bg-card-subtle-theme hover:bg-card-theme text-theme-primary transition-all cursor-pointer shadow-sm"
              title="Copy Invite Link"
            >
              {copiedInvite ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5 text-indigo-500" />}
              <span>{copiedInvite ? 'Link Copied!' : 'Invite Link'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-theme bg-card-theme hover:bg-card-subtle-theme text-theme-primary transition-all cursor-pointer shadow-sm"
            title="Join an Organization"
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Join Team</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateWsModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Company Workspace</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PERSONAL SOLO WORKSPACE VIEW */}
      {isSoloMode ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Solo Mode Hero Card */}
          <div className="rounded-3xl border border-theme bg-gradient-to-br from-indigo-500/5 via-card-theme to-emerald-500/5 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <Sparkles className="h-3 w-3" />
                  <span>Personal Solo Mode Active</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-theme-primary">
                  Welcome to your Private Workspace, {userProfile.name}!
                </h2>
                <p className="text-xs text-theme-muted max-w-xl leading-relaxed">
                  In Solo Mode, all your recorded meetings, speech transcriptions, and Urdu translations remain completely private to your account.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Change Plan (Free Beta)
                </button>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div 
                onClick={() => setActiveTab('record-upload')}
                className="p-5 rounded-2xl border border-theme bg-card-theme hover:border-indigo-500/60 shadow-sm transition-all cursor-pointer group"
              >
                <Mic className="h-8 w-8 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-theme-primary">Solo Speech Studio</h3>
                <p className="text-xs text-theme-muted mt-1">Record or upload personal audio calls.</p>
              </div>

              <div 
                onClick={() => setActiveTab('live-interpretation')}
                className="p-5 rounded-2xl border border-theme bg-card-theme hover:border-emerald-500/60 shadow-sm transition-all cursor-pointer group"
              >
                <Globe2 className="h-8 w-8 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-theme-primary">Live Interpretation</h3>
                <p className="text-xs text-theme-muted mt-1">Real-time English ⇄ Urdu speech translation.</p>
              </div>

              <div 
                onClick={() => setShowCreateWsModal(true)}
                className="p-5 rounded-2xl border border-theme bg-card-theme hover:border-violet-500/60 shadow-sm transition-all cursor-pointer group"
              >
                <Building2 className="h-8 w-8 text-violet-500 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-theme-primary">Create Company Team</h3>
                <p className="text-xs text-theme-muted mt-1">Spin up a company workspace & invite teammates.</p>
              </div>
            </div>
          </div>

          {/* User's Organization Workspaces Summary */}
          <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-primary">
                Your Connected Company Workspaces ({workspaces.filter(w => w.id !== 'personal-solo').length})
              </h3>
              <button
                onClick={() => setShowCreateWsModal(true)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                + Create Another Workspace
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {workspaces.filter(w => w.id !== 'personal-solo').map(ws => (
                <div 
                  key={ws.id} 
                  onClick={() => setActiveWorkspace(ws)}
                  className="p-4 rounded-xl border border-theme bg-card-subtle-theme hover:bg-card-theme hover:border-indigo-500 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏢</span>
                    <div>
                      <h4 className="text-xs font-bold text-theme-primary">{ws.name}</h4>
                      <p className="text-[11px] text-theme-muted">{ws.companyName || 'Company Team'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Switch →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: COMPANY WORKSPACE (WITH CHAT, INVITES & ARCHIVE) */
        <div className="space-y-6 animate-fadeIn">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-theme pb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveSubTab('chat')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'chat'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-theme-secondary hover:bg-card-subtle-theme hover:text-theme-primary'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Team Chat Room ({workspaceMessages.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('members')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'members'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-theme-secondary hover:bg-card-subtle-theme hover:text-theme-primary'
                }`}
              >
                <Users2 className="h-4 w-4" />
                <span>Team Members ({workspaceMembers.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('settings')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'settings'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-theme-secondary hover:bg-card-subtle-theme hover:text-theme-primary'
                }`}
              >
                <HardDrive className="h-4 w-4" />
                <span>Pooled Usage & Info</span>
              </button>
            </div>

            {isAdminOrOwner && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Invite Teammate</span>
              </button>
            )}
          </div>

          {/* TAB 1: REAL-TIME TEAM CHAT ROOM */}
          {activeSubTab === 'chat' && (
            <div className="rounded-2xl border border-theme bg-card-theme flex flex-col h-[580px] shadow-sm overflow-hidden animate-fadeIn">
              {/* Chat Header */}
              <div className="p-3.5 border-b border-theme bg-card-subtle-theme/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-theme-primary">
                    #{activeWorkspace?.name ? activeWorkspace.name.toLowerCase().replace(/\s+/g, '-') : 'general'}-chat
                  </span>
                  <span className="text-[11px] text-theme-muted">
                    ({workspaceMembers.length} team members connected)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-theme-muted">
                  <Lock className="h-3 w-3 text-emerald-500" />
                  <span>Private Team Encrypted Channel</span>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {workspaceMessages.length === 0 ? (
                  <div className="text-center py-16 space-y-3 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center mx-auto">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-theme-primary">Welcome to #{activeWorkspace?.name || 'Team'} Chat!</h3>
                    <p className="text-xs text-theme-muted">
                      No messages yet. Send a message to collaborate with your team in English, Urdu Nastaliq, or Roman Urdu.
                    </p>
                  </div>
                ) : (
                  workspaceMessages.map((msg) => {
                    const isMe = msg.senderEmail === userProfile.email;
                    return (
                      <div 
                        key={msg.id}
                        className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {msg.senderAvatar ? (
                          <img
                            src={msg.senderAvatar}
                            alt={msg.senderName}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                            {msg.senderName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className={`space-y-1 max-w-lg ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                          <div className="flex items-center gap-1.5 text-[11px] text-theme-muted">
                            <span className="font-bold text-theme-primary">{msg.senderName}</span>
                            {msg.senderRole && (
                              <span className="rounded bg-card-subtle-theme border border-theme px-1.5 py-0.2 text-[9px] font-semibold text-theme-secondary">
                                {msg.senderRole}
                              </span>
                            )}
                            <span>•</span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div 
                            className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              isMe 
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm' 
                                : 'bg-card-subtle-theme border border-theme text-theme-primary rounded-tl-none'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>

                            {msg.meetingAttachmentTitle && (
                              <div className={`mt-2 p-2 rounded-xl border flex items-center gap-2 text-[11px] ${
                                isMe ? 'bg-indigo-700/60 border-indigo-400/40 text-white' : 'bg-card-theme border-theme text-theme-primary'
                              }`}>
                                <FileText className="h-4 w-4 shrink-0 text-amber-400" />
                                <div className="truncate">
                                  <span className="font-semibold">Attached Meeting: </span>
                                  <span>{msg.meetingAttachmentTitle}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-theme bg-card-subtle-theme/40 space-y-2">
                {selectedMeetingAttachment && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-lg text-xs border border-indigo-500/20 w-fit">
                    <FileText className="h-3 w-3" />
                    <span>Attached: {meetings.find(m => m.id === selectedMeetingAttachment)?.title || 'Meeting'}</span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedMeetingAttachment('')}
                      className="ml-1 hover:text-rose-500"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {meetings.length > 0 && (
                    <select
                      value={selectedMeetingAttachment}
                      onChange={e => setSelectedMeetingAttachment(e.target.value)}
                      aria-label="Attach meeting transcript to chat message"
                      className="px-2.5 py-2 text-[11px] rounded-xl border border-theme bg-card-theme text-theme-secondary focus:outline-none focus:border-indigo-500"
                      title="Attach Meeting Transcript"
                    >
                      <option value="">📎 Attach Meeting...</option>
                      {meetings.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type a team message in English, Urdu, or Roman Urdu (Press Enter)..."
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-theme bg-input-theme text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 transition-all"
                  />

                  <button
                    type="submit"
                    disabled={isSendingMsg || (!chatInput.trim() && !selectedMeetingAttachment)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    {isSendingMsg ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Send</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: INVITE-ONLY TEAM MEMBERS MANAGEMENT */}
          {activeSubTab === 'members' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 flex items-start gap-3 text-xs text-theme-secondary">
                <ShieldCheck className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-theme-primary">Strict Invite-Only Privacy Enforced</h4>
                  <p className="mt-0.5 text-theme-muted">
                    Only teammates explicitly invited by the workspace Owner (<strong>{activeWorkspace?.ownerEmail}</strong>) can view, record, and chat in this workspace.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-theme bg-card-theme overflow-hidden shadow-sm">
                <div className="p-4 border-b border-theme flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-theme-primary">
                    Active & Invited Members ({workspaceMembers.length})
                  </h3>
                  <div className="text-xs text-theme-muted font-mono">
                    Invite Code: <strong>{activeWorkspace?.inviteCode}</strong>
                  </div>
                </div>

                <div className="divide-y divide-theme">
                  {workspaceMembers.map((member) => (
                    <div key={member.id} className="p-4 flex items-center justify-between gap-3 hover:bg-card-subtle-theme/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.userName}
                            referrerPolicy="no-referrer"
                            className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {member.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-theme-primary">{member.userName}</span>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-semibold border ${
                              member.role === 'Owner' 
                                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                                : member.role === 'Admin'
                                  ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                                  : 'bg-card-subtle-theme text-theme-secondary border-theme'
                            }`}>
                              {member.role}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                              member.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                            }`}>
                              {member.status === 'active' ? 'Active' : 'Invited'}
                            </span>
                          </div>
                          <span className="text-[11px] text-theme-muted">{member.userEmail}</span>
                        </div>
                      </div>

                      {isAdminOrOwner && member.role !== 'Owner' && member.userEmail !== userProfile.email && (
                        <button
                          type="button"
                          onClick={() => removeMemberFromWorkspace(member.id)}
                          className="p-1.5 rounded-lg text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Remove Member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POOLED USAGE & WORKSPACE SETTINGS */}
          {activeSubTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-theme-primary">Pooled Workspace Minutes</h3>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-500/20 capitalize">
                    {userProfile.plan} Tier
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-theme-muted">
                    <span>Usage This Cycle</span>
                    <span className="font-mono font-bold text-theme-primary">
                      {userProfile.monthlyMinutesUsed} / {userProfile.monthlyMinutesLimit} mins
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-card-subtle-theme">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${Math.min(100, (userProfile.monthlyMinutesUsed / userProfile.monthlyMinutesLimit) * 100)}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Change Plan (Free Beta)
                </button>
              </div>

              <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-theme-primary">Workspace Information</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-theme-muted">
                    <span>Organization:</span>
                    <strong className="text-theme-primary">{activeWorkspace?.companyName || activeWorkspace?.name}</strong>
                  </div>
                  <div className="flex justify-between text-theme-muted">
                    <span>Owner Contact:</span>
                    <strong className="text-theme-primary">{activeWorkspace?.ownerEmail}</strong>
                  </div>
                  <div className="flex justify-between text-theme-muted">
                    <span>Workspace ID:</span>
                    <span className="font-mono text-theme-secondary">{activeWorkspace?.id}</span>
                  </div>
                  <div className="flex justify-between text-theme-muted">
                    <span>Direct Invite Code:</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{activeWorkspace?.inviteCode}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE WORKSPACE MODAL */}
      {showCreateWsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-theme bg-card-theme p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-theme-primary">Create Company Workspace</h3>
              <p className="text-xs text-theme-muted">
                Create a private, invite-only workspace for your company or distributed team.
              </p>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                  Workspace Name *
                </label>
                <input
                  type="text"
                  required
                  value={newWsName}
                  onChange={e => setNewWsName(e.target.value)}
                  placeholder="e.g. Nexus Tech Core"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-theme bg-card-subtle-theme text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Nexus Solutions Ltd"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-theme bg-card-subtle-theme text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newWsDesc}
                  onChange={e => setNewWsDesc(e.target.value)}
                  placeholder="Brief description of this workspace's purpose..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-theme bg-card-subtle-theme text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateWsModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-theme text-xs font-semibold text-theme-secondary hover:bg-card-subtle-theme transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingWs || !newWsName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isCreatingWs ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <span>Create Workspace</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVITE TEAMMATE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-theme bg-card-theme p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-theme-primary">Invite Teammate to Workspace</h3>
              <p className="text-xs text-theme-muted">
                Only invited members can access <strong>{activeWorkspace?.name}</strong>.
              </p>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                  Teammate Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-theme bg-card-subtle-theme text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                  Teammate Name (Optional)
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. Sara Khan"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-theme bg-card-subtle-theme text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                  Role & Permissions
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-theme bg-card-subtle-theme text-theme-primary focus:outline-none focus:border-indigo-500"
                >
                  <option value="Member">Member (Can record, chat, and view meetings)</option>
                  <option value="Admin">Admin (Can invite members and manage settings)</option>
                  <option value="Translator">Translator (Specialized translation editing)</option>
                  <option value="Viewer">Viewer (Read-only access)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-theme text-xs font-semibold text-theme-secondary hover:bg-card-subtle-theme transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting || !inviteEmail.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isInviting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <span>Send Invitation</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOIN WORKSPACE VIA CODE MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-theme bg-card-theme p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-theme-primary">Join Company Workspace</h3>
              <p className="text-xs text-theme-muted">
                Enter the unique invite code provided by your workspace owner.
              </p>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                  Workspace Invite Code *
                </label>
                <input
                  type="text"
                  required
                  value={joinInviteCode}
                  onChange={e => setJoinInviteCode(e.target.value.toUpperCase())}
                  placeholder="e.g. 7X9K2M"
                  className="w-full px-3.5 py-2 text-xs uppercase font-mono rounded-xl border border-theme bg-card-subtle-theme text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500"
                />
              </div>

              {joinError && (
                <p className="text-xs font-medium text-rose-500">{joinError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinError(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-theme text-xs font-semibold text-theme-secondary hover:bg-card-subtle-theme transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isJoining || !joinInviteCode.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isJoining ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <span>Join Workspace</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamWorkspace;
