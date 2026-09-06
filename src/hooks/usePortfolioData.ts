import { useState, useEffect } from 'react';
import { supabase, isPlaceholder } from '../lib/supabase';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  tags: string[];
  demo_url: string;
  github_url: string;
  featured: boolean;
  weight: number;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
  social_links: Record<string, string>;
}

// Dummy data for fallback
const dummyProfile: Profile = {
  id: 'dummy',
  name: 'Alex Frontend',
  title: 'Senior Frontend Engineer',
  bio: 'Passionate about crafting fluid UI experiences and anti-gravity physics animations.',
  avatar_url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex',
  social_links: { github: "https://github.com" }
};

const dummyProjects: Project[] = [
  {
    id: '1', title: 'E-Commerce Dashboard', slug: 'ecommerce-dashboard',
    description: 'A modern analytics dashboard for e-commerce platforms featuring real-time data and dark mode.',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
    tags: ['React', 'Tailwind', 'Recharts'], demo_url: '#', github_url: '#', featured: true, weight: 1.5
  },
  {
    id: '2', title: 'Social Media App', slug: 'social-media-app',
    description: 'A full-stack social media application with real-time messaging and infinite scrolling.',
    thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000',
    tags: ['Next.js', 'Supabase', 'Framer Motion'], demo_url: '#', github_url: '#', featured: true, weight: 2.0
  },
  {
    id: '3', title: 'Physics Engine Sandbox', slug: 'physics-engine',
    description: 'Interactive 2D physics sandbox to experiment with gravity, collisions, and constraints.',
    thumbnail_url: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?auto=format&fit=crop&q=80&w=1000',
    tags: ['Matter.js', 'TypeScript', 'Canvas'], demo_url: '#', github_url: '#', featured: false, weight: 1.0
  },
  {
    id: '4', title: 'AI Content Generator', slug: 'ai-generator',
    description: 'Leveraging OpenAI to generate blog posts, social media captions, and product descriptions.',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
    tags: ['React', 'OpenAI', 'Tailwind'], demo_url: '#', github_url: '#', featured: false, weight: 1.2
  }
];

export const usePortfolioData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Jika belum setup Supabase, gunakan data dummy agar web tetap menarik
        if (isPlaceholder) {
          setTimeout(() => {
            setProfile(dummyProfile);
            setProjects(dummyProjects);
            setLoading(false);
          }, 800); // Simulasi network delay
          return;
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          setProfile(profileData as Profile);
        }

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (projectsError) {
          throw projectsError;
        }

        setProjects(projectsData as Project[] || []);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data portofolio.');
      } finally {
        if (!isPlaceholder) setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { profile, projects, loading, error };
};
