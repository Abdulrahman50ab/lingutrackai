import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  Zap, 
  ShieldCheck, 
  X, 
  CreditCard, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Tag, 
  Building2, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

interface PlanDetails {
  id: 'solo' | 'team' | 'enterprise';
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  minutesLimit: number;
  badge?: string;
  description: string;
  features: string[];
}

const PLANS: PlanDetails[] = [
  {
    id: 'solo',
    name: 'Solo Freelancer',
    monthlyPrice: 19,
    annualPrice: 15,
    minutesLimit: 300,
    badge: 'Popular',
    description: 'Ideal for solo consultants and freelancers managing cross-language client calls.',
    features: [
      '300 minutes transcription / mo',
      'Live Interpretation (Text Captions)',
      'Code-switching Roman Urdu tags',
      'Unlimited PDF & Markdown exports',
      'Standard AI Meeting Summaries'
    ]
  },
  {
    id: 'team',
    name: 'Team Workspace',
    monthlyPrice: 49,
    annualPrice: 39,
    minutesLimit: 1200,
    badge: 'Most Popular',
    description: 'Built for distributed English & Urdu teams running daily standups and sprint reviews.',
    features: [
      '1,200 pooled minutes / mo',
      'Voice Mode TTS Live Interpretation',
      'Up to 15 Team Collaborators',
      'Action Items Hub with Assignees',
      'Role-based permissions & shared archives',
      'Custom Urdu / Roman Urdu glossary'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Custom',
    monthlyPrice: 199,
    annualPrice: 159,
    minutesLimit: 99999,
    badge: 'Custom STT',
    description: 'Custom fine-tuned Roman Urdu models, dedicated SLA, and SSO enterprise security.',
    features: [
      'Unlimited transcription & translation',
      'Custom Roman Urdu domain fine-tuning',
      'SAML / SSO & Audit compliance logs',
      'Dedicated Account Manager & 99.9% SLA',
      'On-premise / Private VPC deployment'
    ]
  }
];

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, updateUserProfile, userProfile } = useApp();

  const [step, setStep] = useState<'plans' | 'checkout' | 'success'>('plans');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails>(PLANS[1]);
  
  // Checkout Form State
  const [cardName, setCardName] = useState(userProfile.name || 'Abdulrahman');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txnId, setTxnId] = useState('');

  if (!isUpgradeModalOpen) return null;

  const currentPricePerMonth = billingCycle === 'annual' ? selectedPlan.annualPrice : selectedPlan.monthlyPrice;
  const baseSubtotal = billingCycle === 'annual' ? currentPricePerMonth * 12 : currentPricePerMonth;
  const promoDiscountAmount = Math.round((baseSubtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, baseSubtotal - promoDiscountAmount);

  const handleSelectPlan = (plan: PlanDetails) => {
    setSelectedPlan(plan);
    setStep('checkout');
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'LAUNCH50' || clean === 'SPECIAL50') {
      setDiscountPercent(50);
      setPromoMessage('🎉 50% Special Launch Discount Applied!');
    } else if (clean === 'WELCOME20') {
      setDiscountPercent(20);
      setPromoMessage('🎉 20% Welcome Discount Applied!');
    } else if (clean) {
      setDiscountPercent(0);
      setPromoMessage('❌ Invalid promo code. Try "LAUNCH50" for 50% off.');
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate SSL encrypted payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 1400));

    const generatedTxn = `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    setTxnId(generatedTxn);

    // Update profile in state and Supabase database
    updateUserProfile({
      plan: selectedPlan.id,
      monthlyMinutesLimit: selectedPlan.minutesLimit,
    });

    setIsProcessing(false);
    setStep('success');

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch {
      // Confetti fallback
    }
  };

  const handleClose = () => {
    setIsUpgradeModalOpen(false);
    setTimeout(() => {
      setStep('plans');
      setIsProcessing(false);
    }, 300);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-4xl rounded-3xl border border-theme bg-card-theme p-5 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close Upgrade Modal"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full bg-card-subtle-theme p-2 text-theme-muted hover:text-theme-primary transition-colors border border-theme cursor-pointer z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* STEP 1: PLAN SELECTION VIEW */}
        {step === 'plans' && (
          <>
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
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all flex items-center gap-1 cursor-pointer ${
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
              {PLANS.map((plan) => {
                const isCurrent = userProfile.plan === plan.id;
                const isTeam = plan.id === 'team';
                const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

                return (
                  <div 
                    key={plan.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                      isTeam 
                        ? 'border-2 border-indigo-500 bg-card-theme shadow-xl relative pt-6' 
                        : 'border-theme bg-card-theme hover:border-indigo-400/50 shadow-sm'
                    }`}
                  >
                    {isTeam && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 px-3.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md z-10 pointer-events-none">
                        Most Popular
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-theme-primary flex items-center gap-1.5">
                          {isTeam && <Crown className="h-4 w-4 text-amber-500" />}
                          <span>{plan.name}</span>
                        </h3>
                        {plan.badge && !isTeam && (
                          <span className="rounded bg-card-subtle-theme border border-theme px-2 py-0.5 text-[10px] font-semibold text-theme-secondary">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-theme-primary">
                          ${price}
                        </span>
                        <span className="text-xs text-theme-muted">/ month</span>
                      </div>

                      <p className="text-xs text-theme-muted min-h-[32px]">
                        {plan.description}
                      </p>

                      <ul className="space-y-2 pt-2 text-xs text-theme-secondary border-t border-theme">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrent}
                      className={`mt-6 w-full rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 cursor-default'
                          : isTeam
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.02]'
                            : 'bg-card-subtle-theme border border-theme text-theme-primary hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      {isCurrent ? 'Current Active Plan' : `Select ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Security Assurance */}
            <div className="flex items-center justify-center gap-2 text-xs text-theme-muted pt-2 border-t border-theme">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>30-Day Money-Back Guarantee • Cancel Anytime • AES-256 Cloud Security</span>
            </div>
          </>
        )}

        {/* STEP 2: CHECKOUT & PAYMENT CONFIRMATION VIEW */}
        {step === 'checkout' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Navigation */}
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <button
                type="button"
                onClick={() => setStep('plans')}
                className="flex items-center gap-1.5 text-xs font-semibold text-theme-secondary hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Plans</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <Lock className="h-3.5 w-3.5" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Payment Form */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-theme-primary">Payment Information</h3>
                  <p className="text-xs text-theme-muted">Select payment method and complete your subscription.</p>
                </div>

                {/* 1-Click Pay Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-theme bg-card-subtle-theme hover:bg-card-theme text-xs font-semibold text-theme-primary transition-all shadow-sm cursor-pointer"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 8.9 5 12 5z"/>
                    </svg>
                    <span>Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-theme bg-card-subtle-theme hover:bg-card-theme text-xs font-semibold text-theme-primary transition-all shadow-sm cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4 text-indigo-500" />
                    <span>Stripe 1-Click</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-theme" />
                  <span className="absolute bg-card-theme px-3 text-[10px] uppercase font-bold text-theme-muted tracking-wider">
                    Or pay with credit card
                  </span>
                </div>

                {/* Credit Card Form */}
                <form onSubmit={handleConfirmPayment} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      placeholder="e.g. Sarah Khan"
                      className="w-full px-3.5 py-2 text-xs bg-card-subtle-theme border border-theme rounded-xl text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• 4242"
                        className="w-full pl-10 pr-4 py-2 text-xs bg-card-subtle-theme border border-theme rounded-xl text-theme-primary font-mono placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2 text-xs bg-card-subtle-theme border border-theme rounded-xl text-theme-primary font-mono placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2 text-xs bg-card-subtle-theme border border-theme rounded-xl text-theme-primary font-mono placeholder:text-theme-muted focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Promo Code Form */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-theme-secondary mb-1">
                      Discount Code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-theme-muted" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={e => setPromoCode(e.target.value)}
                          placeholder="e.g. LAUNCH50"
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-card-subtle-theme border border-theme rounded-xl text-theme-primary uppercase placeholder:text-theme-muted focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-3 py-1.5 rounded-xl border border-theme bg-card-subtle-theme hover:bg-card-theme text-xs font-semibold text-theme-primary transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoMessage && (
                      <p className={`text-[11px] mt-1 font-medium ${discountPercent > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {promoMessage}
                      </p>
                    )}
                  </div>

                  {/* Submit Payment Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-60 mt-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Processing with Stripe 256-Bit SSL...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Pay ${finalTotal}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 rounded-2xl border border-theme bg-card-subtle-theme/70 p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-theme pb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-theme-primary">Order Summary</h4>
                    <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {selectedPlan.name}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-theme-secondary">
                      <span>Subscription Tier</span>
                      <strong className="text-theme-primary">{selectedPlan.name}</strong>
                    </div>
                    <div className="flex justify-between text-theme-secondary">
                      <span>Billing Cadence</span>
                      <span className="capitalize">{billingCycle} ({billingCycle === 'annual' ? 'Save 20%' : 'Standard'})</span>
                    </div>
                    <div className="flex justify-between text-theme-secondary">
                      <span>Included Minutes</span>
                      <span className="font-bold text-emerald-500">{selectedPlan.minutesLimit.toLocaleString()} mins / mo</span>
                    </div>
                    <div className="flex justify-between text-theme-secondary">
                      <span>Subtotal</span>
                      <span>${baseSubtotal}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Promo Discount ({discountPercent}%)</span>
                        <span>-${promoDiscountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-theme-secondary">
                      <span>Taxes & Processing</span>
                      <span className="text-emerald-500 font-medium">$0.00 (Included)</span>
                    </div>
                  </div>

                  <div className="border-t border-theme pt-3 flex items-baseline justify-between">
                    <span className="text-sm font-bold text-theme-primary">Total Due Today</span>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                        ${finalTotal}
                      </span>
                      <div className="text-[10px] text-theme-muted">
                        renews {billingCycle === 'annual' ? 'annually' : 'monthly'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-theme text-[11px] text-theme-muted">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Instant activation in your workspace</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span>Cancel or switch plans anytime in Settings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION VIEW */}
        {step === 'success' && (
          <div className="text-center py-8 px-4 space-y-5 animate-fadeIn max-w-lg mx-auto">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-xl">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <Sparkles className="h-3 w-3" />
                <span>Subscription Active</span>
              </div>
              <h2 className="text-2xl font-extrabold text-theme-primary">
                Welcome to {selectedPlan.name}!
              </h2>
              <p className="text-xs text-theme-muted max-w-sm mx-auto">
                Your workspace has been upgraded with <strong>{selectedPlan.minutesLimit.toLocaleString()} monthly minutes</strong> and premium voice interpretation features.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="rounded-2xl border border-theme bg-card-subtle-theme p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between text-theme-muted">
                <span>Transaction Ref:</span>
                <span className="font-mono text-theme-primary">{txnId}</span>
              </div>
              <div className="flex justify-between text-theme-muted">
                <span>Total Charged:</span>
                <span className="font-bold text-theme-primary">${finalTotal}</span>
              </div>
              <div className="flex justify-between text-theme-muted">
                <span>Billing Interval:</span>
                <span className="capitalize text-theme-primary">{billingCycle}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Enter Upgraded Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeModal;
