export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url?: string | null;
  tags?: string[] | null;
  demo_url?: string | null;
  github_url?: string | null;
  featured: boolean;
  weight: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileItem {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url?: string | null;
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    [key: string]: string | undefined;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export type AdminTab = 'dashboard' | 'projects' | 'messages' | 'profile' | 'database';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
