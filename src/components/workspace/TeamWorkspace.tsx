import React, { useState } from 'react';
import { 
  Users2, 
  UserPlus, 
  ShieldCheck, 
  HardDrive, 
  Crown, 
  MoreVertical,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  avatar: string;
  status: 'active' | 'invited';
  languages: string[];
}

export const TeamWorkspace: React.FC = () => {
  const { userProfile, setIsUpgradeModalOpen } = useApp();

  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'tm-1',
      name: 'Hamza Farooq',
      email: 'hamza.farooq@techpulse.io',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      languages: ['English', 'Urdu', 'Roman Urdu'],
    },
    {
      id: 'tm-2',
      name: 'Salman Ahmed',
      email: 'salman.ahmed@techpulse.io',
      role: 'Editor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      languages: ['English', 'Urdu'],
    },
    {
      id: 'tm-3',
      name: 'Sara Khan',
      email: 'sara.k@freelance.org',
      role: 'Editor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      languages: ['English', 'Urdu (Nastaliq)'],
    },
    {
      id: 'tm-4',
      name: 'David Miller',
      email: 'david.m@clientapex.co.uk',
      role: 'Viewer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      languages: ['English'],
    }
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      status: 'invited',
      languages: ['English', 'Urdu'],
    };

    setMembers(prev => [...prev, newMember]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-theme-primary flex items-center gap-2">
            <Users2 className="h-6 w-6 text-indigo-500" />
            Team & Organization Workspace
          </h1>
          <p className="text-xs sm:text-sm text-theme-muted mt-1">
            Manage your cross-border distributed team, permission roles, and shared client transcription archives.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-all self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          <span>Invite Teammate</span>
        </button>
      </div>

      {/* Workspace Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Plan Usage */}
        <div className="rounded-2xl border border-theme bg-card-theme p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted">
            <span className="font-semibold text-theme-primary">Pooled Monthly Minutes</span>
            <span className="text-amber-500 font-mono font-bold">18 / 30 mins</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-card-subtle-theme">
            <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: '60%' }} />
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-theme-muted">Free Tier Limit</span>
            <button 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Upgrade to Team (Unlimited)
            </button>
          </div>
        </div>

        {/* Cloud Storage */}
        <div className="rounded-2xl border border-theme bg-card-theme p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted">
            <span className="font-semibold text-theme-primary flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5 text-indigo-500" />
              Secure Audio Storage
            </span>
            <span className="text-indigo-600 dark:text-indigo-300 font-mono font-bold">4.2 GB / 50 GB</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-card-subtle-theme">
            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: '8.4%' }} />
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-theme-muted">AES-256 Encrypted</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">91.6% Available</span>
          </div>
        </div>

        {/* Security & Access */}
        <div className="rounded-2xl border border-theme bg-card-theme p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-theme-muted">
            <span className="font-semibold text-theme-primary flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Role-Based Access
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Enabled</span>
          </div>
          <p className="text-[11px] text-theme-muted leading-relaxed pt-1">
            Viewers cannot export or delete raw audio recordings. Transcripts protected via transient secure compute.
          </p>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="rounded-2xl border border-theme bg-card-theme p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-theme pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-theme-primary">
            Active Workspace Collaborators ({members.length})
          </h2>
          <span className="text-xs text-theme-muted font-mono">{userProfile.organization}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-theme text-[11px] uppercase tracking-wider text-theme-muted">
                <th className="pb-3 pl-2">Member</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Language Focus</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-card-subtle-theme transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-theme-primary flex items-center gap-1.5">
                          {member.name}
                          {member.role === 'Admin' && (
                            <Crown className="h-3 w-3 text-amber-500" />
                          )}
                        </div>
                        <div className="text-[11px] text-theme-muted font-mono">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                      member.role === 'Admin'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : member.role === 'Editor'
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                        : 'bg-card-subtle-theme text-theme-muted border-theme'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {member.languages.map((l, i) => (
                        <span key={i} className="rounded bg-card-subtle-theme px-1.5 py-0.5 text-[10px] text-theme-secondary border border-theme">
                          {l}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {member.status === 'active' ? 'Active' : 'Invitation Sent'}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <button className="text-theme-muted hover:text-theme-primary p-1">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-theme bg-card-theme p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-theme-primary flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-500" />
                Invite Team Member
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-theme-muted hover:text-theme-primary">
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-theme-secondary">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="mt-1 w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary placeholder:text-theme-muted focus:border-indigo-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-secondary">Role Permission</label>
                <select
                  aria-label="Role Permission Selection"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'Admin' | 'Editor' | 'Viewer')}
                  className="mt-1 w-full rounded-xl border border-theme bg-input-theme px-3 py-2 text-xs text-theme-primary focus:border-indigo-500 focus:outline-none shadow-sm"
                >
                  <option value="Editor">Editor (Transcribe, Edit & Add Notes)</option>
                  <option value="Viewer">Viewer (Read-Only Transcripts)</option>
                  <option value="Admin">Admin (Full Access & Billing)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl px-4 py-2 text-xs text-theme-muted hover:bg-card-subtle-theme"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-sm"
                >
                  Send Invitation
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
