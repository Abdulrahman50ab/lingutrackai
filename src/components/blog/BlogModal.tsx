import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Heart, 
  Copy, 
  Check, 
  Sparkles, 
  Info, 
  AlertTriangle, 
  Quote, 
  CheckCircle2, 
  Globe2, 
  Mic
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlogPost } from '../../types/blog';
import { getRelatedBlogPosts } from '../../data/mockBlogs';
import { useApp } from '../../context/AppContext';

interface BlogModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, isOpen, onClose, onSelectPost }) => {
  const { setActiveTab, openAuthModal, isAuthenticated } = useApp();
  const [readingProgress, setReadingProgress] = useState(0);
  const [claps, setClaps] = useState<number>(0);
  const [hasClapped, setHasClapped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (post) {
      setClaps(post.claps || 0);
      setHasClapped(false);
      setIsBookmarked(false);
      setReadingProgress(0);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [post]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setReadingProgress(Math.min(100, Math.max(0, progress)));
  };

  const handleClap = (e: React.MouseEvent) => {
    setClaps(prev => prev + 1);
    setHasClapped(true);

    // Trigger confetti burst around the clap button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      disableForReducedMotion: true
    });
  };

  const handleShare = () => {
    const url = window.location.origin + '#blog-' + post.slug;
    navigator.clipboard.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const relatedPosts = getRelatedBlogPosts(post.id, 2);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-sm sm:text-base leading-relaxed';
      case 'larger':
        return 'text-base sm:text-lg leading-loose';
      default:
        return 'text-xs sm:text-sm leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-hidden animate-fadeIn">
      {/* Modal Container */}
      <div 
        className="relative flex flex-col h-full max-h-[94vh] w-full max-w-4xl rounded-3xl border border-theme bg-card-theme shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Reading Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-theme z-30">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-500 transition-all duration-150"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Modal Header Bar */}
        <div className="flex items-center justify-between border-b border-theme px-6 py-3.5 bg-card-theme/90 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {post.category}
            </span>
            <span className="text-[11px] text-theme-muted hidden sm:inline">•</span>
            <span className="text-[11px] text-theme-muted hidden sm:inline">{post.readTime}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center gap-1 rounded-xl border border-theme bg-card-subtle-theme p-1 text-[10px]">
              <button 
                onClick={() => setFontSize('normal')}
                className={`rounded px-1.5 py-0.5 font-bold ${fontSize === 'normal' ? 'bg-indigo-600 text-white' : 'text-theme-muted'}`}
                title="Normal text"
              >
                A
              </button>
              <button 
                onClick={() => setFontSize('large')}
                className={`rounded px-1.5 py-0.5 font-bold text-xs ${fontSize === 'large' ? 'bg-indigo-600 text-white' : 'text-theme-muted'}`}
                title="Large text"
              >
                A+
              </button>
              <button 
                onClick={() => setFontSize('larger')}
                className={`rounded px-1.5 py-0.5 font-bold text-sm ${fontSize === 'larger' ? 'bg-indigo-600 text-white' : 'text-theme-muted'}`}
                title="Extra large text"
              >
                A++
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 rounded-xl border border-theme bg-card-subtle-theme px-3 py-1.5 text-xs font-semibold text-theme-secondary hover:text-indigo-600 hover:border-indigo-500/30 transition-all cursor-pointer"
              title="Share Article Link"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => setIsBookmarked(prev => !prev)}
              className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isBookmarked 
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                  : 'border-theme bg-card-subtle-theme text-theme-secondary hover:text-theme-primary'
              }`}
              title="Bookmark for later"
            >
              {isBookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-xl border border-theme bg-card-subtle-theme p-1.5 text-theme-muted hover:text-theme-primary hover:bg-theme transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Share Feedback Toast Notification */}
        {shareToast && (
          <div className="absolute top-16 right-6 z-40 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xl animate-bounce">
            <Check className="h-3.5 w-3.5" />
            <span>Article Link Copied to Clipboard!</span>
          </div>
        )}

        {/* Scrollable Article Body */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 scroll-smooth"
        >
          {/* Article Header */}
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs text-theme-muted">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-emerald-500" />
                {post.readTime}
              </span>
              <span>•</span>
              <span className="text-theme-muted">{post.views.toLocaleString()} views</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-theme-primary tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-theme-muted font-normal leading-relaxed">
              {post.subtitle}
            </p>
          </div>

          {/* Author Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-theme bg-card-subtle-theme p-4">
            <div className="flex items-center gap-3.5">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="h-12 w-12 rounded-full object-cover border-2 border-indigo-500/40"
              />
              <div>
                <div className="text-sm font-bold text-theme-primary flex items-center gap-2">
                  <span>{post.author.name}</span>
                  <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Author</span>
                </div>
                <div className="text-xs text-theme-muted">{post.author.role}</div>
                {post.author.bio && (
                  <div className="text-[11px] text-theme-muted/80 mt-0.5 max-w-xl">{post.author.bio}</div>
                )}
              </div>
            </div>

            {/* Like / Clap Interaction Button */}
            <button
              onClick={handleClap}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0 ${
                hasClapped 
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30' 
                  : 'bg-card-theme border border-theme text-theme-secondary hover:text-rose-600 hover:border-rose-500/30'
              }`}
            >
              <Heart className={`h-4 w-4 ${hasClapped ? 'fill-rose-500 text-rose-500 animate-pulse' : ''}`} />
              <span>{claps} Claps</span>
            </button>
          </div>

          {/* Featured Cover Image */}
          <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden border border-theme shadow-md">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick Table of Contents Bar */}
          <div className="rounded-2xl border border-theme bg-card-subtle-theme p-4 space-y-2">
            <div className="text-xs font-bold text-theme-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>In This Article</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="rounded-lg bg-card-theme px-3 py-1.5 text-xs font-medium text-theme-secondary hover:text-indigo-600 hover:border-indigo-500/30 border border-theme transition-colors cursor-pointer text-left"
                >
                  {sec.heading}
                </button>
              ))}
            </div>
          </div>

          {/* Key Takeaways Callout Box */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Key Executive Takeaways</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {post.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-theme-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Sections Content */}
          <div className="space-y-10 max-w-3xl">
            {post.sections.map((section) => (
              <section id={section.id} key={section.id} className="space-y-4 pt-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-theme-primary tracking-tight">
                    {section.heading}
                  </h2>
                  {section.subheading && (
                    <p className="text-xs sm:text-sm text-theme-muted font-medium mt-1">
                      {section.subheading}
                    </p>
                  )}
                </div>

                {/* Paragraphs */}
                <div className={`space-y-3.5 text-theme-secondary ${getFontSizeClass()}`}>
                  {section.paragraphs.map((p, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Callout box */}
                {section.callout && (
                  <div className={`rounded-2xl border p-5 space-y-2 ${
                    section.callout.type === 'warning'
                      ? 'border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200'
                      : section.callout.type === 'tip'
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200'
                      : 'border-indigo-500/30 bg-indigo-500/5 text-indigo-900 dark:text-indigo-200'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                      {section.callout.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ) : section.callout.type === 'quote' ? (
                        <Quote className="h-4 w-4 text-indigo-500" />
                      ) : (
                        <Info className="h-4 w-4 text-indigo-500" />
                      )}
                      <span>{section.callout.title || 'Note'}</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-theme-primary font-medium">
                      {section.callout.text}
                    </p>
                  </div>
                )}

                {/* Bilingual Example Box */}
                {section.bilingualExample && (
                  <div className="rounded-2xl border border-indigo-500/30 bg-card-subtle-theme p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <span className="flex items-center gap-1.5">
                        <Globe2 className="h-4 w-4" />
                        Live Multilingual Tokenization Example
                      </span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600">Verified</span>
                    </div>

                    <div className="space-y-2">
                      <div className="rounded-xl bg-card-theme p-3 border border-theme text-xs space-y-1">
                        <div className="text-[10px] text-theme-muted font-bold">🇺🇸 English Context:</div>
                        <p className="text-theme-primary font-medium">"{section.bilingualExample.english}"</p>
                      </div>

                      <div className="rounded-xl bg-card-theme p-3 border border-cyan-500/30 text-xs space-y-1">
                        <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold font-mono">🔤 Roman Urdu Transliteration:</div>
                        <p className="text-cyan-800 dark:text-cyan-200 font-mono">"{section.bilingualExample.romanUrdu}"</p>
                      </div>

                      <div className="rounded-xl bg-card-theme p-3 border border-emerald-500/30 text-xs space-y-1">
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">🇵🇰 اردو Nastaliq Script:</div>
                        <p dir="rtl" className="urdu-text text-base text-emerald-700 dark:text-emerald-300 font-medium">
                          "{section.bilingualExample.urduNastaliq}"
                        </p>
                      </div>
                    </div>

                    {section.bilingualExample.note && (
                      <p className="text-[11px] text-theme-muted italic">
                        💡 {section.bilingualExample.note}
                      </p>
                    )}
                  </div>
                )}

                {/* Code Snippet Box */}
                {section.codeSnippet && (
                  <div className="rounded-2xl border border-theme bg-slate-950 text-slate-100 overflow-hidden shadow-md">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
                      <span className="font-mono text-slate-400">{section.codeSnippet.filename || 'snippet'}</span>
                      <button
                        onClick={() => handleCopyCode(section.codeSnippet!.code, section.id)}
                        className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        {copiedCodeId === section.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedCodeId === section.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono overflow-x-auto text-slate-200 leading-relaxed">
                      <code>{section.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Bullet Points */}
                {section.bulletPoints && (
                  <ul className="space-y-2 pt-1">
                    {section.bulletPoints.map((bp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-theme-secondary">
                        <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* In-Article Conversion Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-emerald-900 p-6 sm:p-8 text-white space-y-4 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 max-w-xl">
              <h3 className="text-lg sm:text-xl font-bold">
                Experience LinguTrack AI in Your Next Call
              </h3>
              <p className="text-xs text-indigo-100/80 leading-relaxed">
                Try real-time speech transcription and live interpretation with Urdu and 50+ languages. 30 free minutes every month.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                if (isAuthenticated) {
                  setActiveTab('record-upload');
                } else {
                  openAuthModal('signup');
                }
              }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-extrabold text-indigo-900 hover:bg-slate-100 transition-all hover:scale-105 shadow-md cursor-pointer shrink-0"
            >
              <Mic className="h-4 w-4 text-indigo-600" />
              <span>Start Free Transcription</span>
            </button>
          </div>

          {/* Related Articles Section */}
          <div className="space-y-4 pt-6 border-t border-theme">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-theme-primary">
                Related Articles
              </h3>
              <span className="text-xs text-theme-muted">More from LinguTrack Engineering</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectPost(rel)}
                  className="rounded-2xl border border-theme bg-card-subtle-theme p-4 space-y-2 hover:border-indigo-500/50 transition-all cursor-pointer group flex gap-3 items-center"
                >
                  <img 
                    src={rel.coverImage} 
                    alt={rel.title} 
                    className="h-16 w-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1 truncate">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold text-theme-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {rel.title}
                    </h4>
                    <div className="text-[10px] text-theme-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{rel.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
