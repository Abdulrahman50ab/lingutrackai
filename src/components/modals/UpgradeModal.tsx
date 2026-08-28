import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  Zap, 
  ShieldCheck, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, updateUserProfile } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isUpgradeModalOpen) return null;

  const handleUpgrade = (planName: 'solo' | 'team' | 'enterprise', limit: number) => {
    updateUserProfile({
      plan: planName,
      monthlyMinutesLimit: limit,
    });
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      setIsUpgradeModalOpen(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-theme bg-card-theme p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close Upgrade Modal"
          onClick={() => setIsUpgradeModalOpen(false)}
          className="absolute right-5 top-5 rounded-full bg-card-subtle-theme p-2 text-theme-muted hover:text-theme-primary transition-colors border border-theme"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Scale Your Multilingual Collaboration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-primary tracking-tight">
            Upgrade Your LinguTrack AI Plan
          </h2>
          <p className="text-xs sm:text-sm text-theme-muted">
            Unlock unlimited English ↔ Urdu real-time interpretation, voice mode synthesis, and collaborative team archives.
          </p>

          {/* Billing Cycle Switch */}
          <div className="inline-flex items-center rounded-xl border border-theme bg-card-subtle-theme p-1 text-xs mt-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all flex items-center gap-1 ${
                billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Solo Plan */}
          <div className="rounded-2xl border border-theme bg-card-theme p-5 flex flex-col justify-between hover:border-indigo-400/50 shadow-sm transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-theme-primary">Solo Freelancer</h3>
                <span className="rounded bg-card-subtle-theme border border-theme px-2 py-0.5 text-[10px] font-semibold text-theme-secondary">Popular</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-theme-primary">
                  ${billingCycle === 'annual' ? '15' : '19'}
                </span>
                <span className="text-xs text-theme-muted">/ month</span>
              </div>
              <p className="text-xs text-theme-muted">
                Ideal for solo consultants and freelancers managing cross-language client calls.
              </p>

              <ul className="space-y-2 pt-2 text-xs text-theme-secondary border-t border-theme">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span><strong>300 minutes</strong> transcription / mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Live Interpretation (Text Captions)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Code-switching Roman Urdu tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Unlimited PDF / Markdown exports</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade('solo', 300)}
              className="mt-6 w-full rounded-xl bg-card-subtle-theme border border-theme py-2.5 text-xs font-bold text-theme-primary hover:bg-indigo-600 hover:text-white transition-all"
            >
              Select Solo Plan
            </button>
          </div>

          {/* Team Plan (Recommended) */}
          <div className="rounded-2xl border-2 border-indigo-500 bg-card-theme p-5 pt-6 flex flex-col justify-between shadow-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 px-3.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md z-10 pointer-events-none">
              Most Popular
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-theme-primary flex items-center gap-1.5">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span>Team Workspace</span>
                </h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-theme-primary">
                  ${billingCycle === 'annual' ? '39' : '49'}
                </span>
                <span className="text-xs text-theme-muted">/ month</span>
              </div>
              <p className="text-xs text-theme-muted">
                Built for distributed English & Urdu teams running daily standups and sprint reviews.
              </p>

              <ul className="space-y-2 pt-2 text-xs text-theme-secondary border-t border-theme">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span><strong>1,200 pooled minutes</strong> / mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span><strong>Voice Mode TTS</strong> Live Interpretation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Up to 15 Team Collaborators</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Action Items Hub with Assignees</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Role-based permissions & shared archives</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade('team', 1200)}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white shadow-md hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02]"
            >
              Upgrade to Team
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl border border-theme bg-card-theme p-5 flex flex-col justify-between hover:border-indigo-400/50 shadow-sm transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-theme-primary">Enterprise</h3>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Custom STT</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-theme-primary">
                  ${billingCycle === 'annual' ? '159' : '199'}
                </span>
                <span className="text-xs text-theme-muted">/ month</span>
              </div>
              <p className="text-xs text-theme-muted">
                Custom fine-tuned Roman Urdu models, dedicated SLA, and SSO security.
              </p>

              <ul className="space-y-2 pt-2 text-xs text-theme-secondary border-t border-theme">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span><strong>Unlimited</strong> transcription & translation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Custom Roman Urdu domain fine-tuning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>SAML / SSO & Audit logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Dedicated Account Manager & 99.9% SLA</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade('enterprise', 99999)}
              className="mt-6 w-full rounded-xl bg-card-subtle-theme border border-theme py-2.5 text-xs font-bold text-theme-primary hover:bg-indigo-600 hover:text-white transition-all"
            >
              Contact Enterprise
            </button>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="flex items-center justify-center gap-2 text-xs text-theme-muted pt-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>30-Day Money-Back Guarantee • Cancel Anytime • AES-256 Cloud Security</span>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
