import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../../types/blog';
import { BLOG_POSTS } from '../../data/mockBlogs';
import { BlogCard } from './BlogCard';
import { BlogModal } from './BlogModal';

export const BlogSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const categories: BlogCategory[] = [
    'All',
    'Urdu & NLP',
    'Speech AI & STT',
    'Remote Productivity',
    'Security & Privacy'
  ];

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  // Filter posts based on category and search query
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesQuery = 
      searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  return (
    <section id="blog" className="py-20 border-t border-theme bg-card-subtle-theme/30 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <BookOpen className="h-3.5 w-3.5" />
              LinguTrack Engineering & Research
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-primary tracking-tight">
              Latest Insights, Guides & Research
            </h2>
            <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
              Explore speech AI architectures, bilingual South Asian NLP benchmarks, low-latency live interpretation, and remote team workflows.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, Urdu, WebSockets..."
              className="w-full rounded-2xl border border-theme bg-card-theme pl-10 pr-4 py-2.5 text-xs text-theme-primary placeholder-theme-muted focus:border-indigo-500 focus:outline-none shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'border border-theme bg-card-theme text-theme-secondary hover:text-theme-primary hover:bg-card-subtle-theme'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Display */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-theme bg-card-theme p-12 text-center space-y-3">
            <p className="text-sm text-theme-muted">No articles found matching your query.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Clear filters and view all articles
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Hero Blog Post (if available) */}
            {featuredPost && (
              <BlogCard 
                post={featuredPost} 
                onReadMore={handleOpenPost} 
                featured={true} 
              />
            )}

            {/* Remaining Grid of Blog Posts (3-column) */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridPosts.map((post) => (
                  <BlogCard 
                    key={post.id} 
                    post={post} 
                    onReadMore={handleOpenPost} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Newsletter Subscription Box */}
        <div className="rounded-3xl border border-theme bg-card-theme p-6 sm:p-10 shadow-lg relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="h-4 w-4" />
              <span>Stay Ahead of Speech AI</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-primary">
              Subscribe to the LinguTrack Research Newsletter
            </h3>
            <p className="text-xs text-theme-muted leading-relaxed">
              Get bi-weekly technical breakdowns on code-switching acoustic tokenizers, low-latency live interpretation architectures, and productivity playbooks.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {isSubscribed ? (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-6 py-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>You're subscribed! We'll notify you on the next publication.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your work email"
                    className="w-full sm:w-72 rounded-2xl border border-theme bg-card-subtle-theme pl-10 pr-4 py-3 text-xs text-theme-primary placeholder-theme-muted focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Global Interactive Blog Article Modal */}
      <BlogModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectPost={(post) => setSelectedPost(post)}
      />
    </section>
  );
};
