import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

        // Fetch profile (ambil yang pertama kali ditemukan jika ada)
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
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { profile, projects, loading, error };
};
