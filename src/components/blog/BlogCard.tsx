import React from 'react';
import { Clock, Calendar, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { BlogPost } from '../../types/blog';

interface BlogCardProps {
  post: BlogPost;
  onReadMore: (post: BlogPost) => void;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore, featured = false }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Urdu & NLP':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Speech AI & STT':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'Remote Productivity':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Security & Privacy':
        return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    }
  };

  if (featured) {
    return (
      <div 
        onClick={() => onReadMore(post)}
        className="group relative rounded-3xl border border-theme bg-card-theme p-6 sm:p-8 shadow-xl hover:border-indigo-500/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col lg:flex-row gap-8 items-center"
      >
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

        {/* Cover Image */}
        <div className="w-full lg:w-1/2 h-64 sm:h-80 rounded-2xl overflow-hidden relative shrink-0">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Featured Article</span>
          </div>
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] text-white flex items-center gap-1">
            <Clock className="h-3 w-3 text-indigo-400" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-1/2 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-lg border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-theme-muted">
                <Calendar className="h-3 w-3" />
                {post.date}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-theme-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
              {post.title}
            </h3>

            <p className="text-xs sm:text-sm text-theme-muted leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, 4).map(tag => (
              <span key={tag} className="rounded-md bg-card-subtle-theme px-2 py-0.5 text-[10px] font-medium text-theme-muted border border-theme">
                #{tag}
              </span>
            ))}
          </div>

          {/* Author & CTA Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-theme">
            <div className="flex items-center gap-3">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="h-9 w-9 rounded-full object-cover border border-theme" 
              />
              <div>
                <div className="text-xs font-bold text-theme-primary">{post.author.name}</div>
                <div className="text-[10px] text-theme-muted">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Read Full Article</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onReadMore(post)}
      className="group rounded-3xl border border-theme bg-card-theme p-5 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      <div className="space-y-4">
        {/* Cover image */}
        <div className="h-44 w-full rounded-2xl overflow-hidden relative">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute top-2.5 left-2.5">
            <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-card-theme/90 ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>
          <div className="absolute bottom-2.5 right-2.5 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] text-white flex items-center gap-1">
            <Clock className="h-3 w-3 text-indigo-400" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-theme-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
              {post.claps}
            </span>
          </div>

          <h3 className="text-base font-bold text-theme-primary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h3>

          <p className="text-xs text-theme-muted leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="rounded-md bg-card-subtle-theme px-1.5 py-0.5 text-[9px] font-medium text-theme-muted border border-theme">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Author & Action */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-theme">
        <div className="flex items-center gap-2">
          <img 
            src={post.author.avatar} 
            alt={post.author.name} 
            className="h-7 w-7 rounded-full object-cover border border-theme" 
          />
          <span className="text-[11px] font-semibold text-theme-secondary truncate max-w-[120px]">
            {post.author.name}
          </span>
        </div>

        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          <span>Read</span>
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
};
