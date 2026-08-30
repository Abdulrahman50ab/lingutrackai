export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  twitter?: string;
  linkedin?: string;
}

export interface BilingualExample {
  english: string;
  romanUrdu: string;
  urduNastaliq: string;
  note?: string;
}

export interface BlogCallout {
  type: 'tip' | 'info' | 'quote' | 'warning';
  title?: string;
  text: string;
  author?: string;
}

export interface BlogCodeSnippet {
  language: string;
  code: string;
  filename?: string;
}

export interface BlogSection {
  id: string;
  heading: string;
  subheading?: string;
  paragraphs: string[];
  callout?: BlogCallout;
  bulletPoints?: string[];
  bilingualExample?: BilingualExample;
  codeSnippet?: BlogCodeSnippet;
}

export type BlogCategory = 
  | 'All'
  | 'Urdu & NLP'
  | 'Speech AI & STT'
  | 'Remote Productivity'
  | 'Security & Privacy';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: 'Urdu & NLP' | 'Speech AI & STT' | 'Remote Productivity' | 'Security & Privacy';
  author: BlogAuthor;
  date: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  featured?: boolean;
  sections: BlogSection[];
  keyTakeaways: string[];
  claps: number;
  views: number;
}
