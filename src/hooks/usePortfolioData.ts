import { useState, useEffect } from 'react';
import { supabase, isPlaceholder } from '../lib/supabase';
import type { BlogCategory } from '../types/admin';

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

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  gallery_images?: string[] | null;
  published: boolean;
  created_at?: string;
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
  name: 'Alex Developer',
  title: 'Software Developer',
  bio: 'Building reliable, scalable web & mobile applications — turning ideas into clean, high-performance software.',
  avatar_url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex',
  social_links: { github: "https://github.com" }
};

export const dummyBlogs: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Pengalaman Membangun Aplikasi Web dari Nol Sampai Production',
    slug: 'pengalaman-membangun-aplikasi-web',
    category: 'Pengalaman',
    excerpt: 'Catatan perjalanan, tantangan teknis, dan pelajaran penting saat merilis aplikasi web pertama yang dipakai banyak pengguna.',
    content: `Memulai sebuah proyek dari halaman kosong selalu terasa seru sekaligus menantang. Di awal, fokus utamanya adalah memastikan arsitektur kode tetap rapi agar mudah dikembangkan di masa depan.

Beberapa hal yang paling banyak saya pelajari selama proses ini adalah pentingnya komunikasi yang jelas, iterasi cepat berdasarkan feedback pengguna, serta menjaga performa tetap ringan di perangkat mobile.

Setelah masuk tahap production, monitoring error dan kecepatan loading menjadi prioritas harian. Dari sini saya sadar bahwa merilis fitur hanyalah awal—merawatnya agar tetap stabil justru bagian yang paling berharga.`,
    cover_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000',
    gallery_images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900'
    ],
    published: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'blog-2',
    title: 'Cerita di Balik Meja Kerja & Rutinitas Ngoding Malam Hari',
    slug: 'cerita-meja-kerja-dan-ngoding-malam',
    category: 'Cerita',
    excerpt: 'Sedikit cerita santai soal setup meja kerja, secangkir kopi, dan kenapa ide desain terbaik sering muncul di jam-jam tenang.',
    content: `Banyak orang bertanya kapan waktu paling produktif untuk menulis kode atau merancang antarmuka. Buat saya pribadi, suasana malam yang tenang selalu punya daya tarik tersendiri.

Dengan pencahayaan hangat, playlist instrumental pelan, dan catatan kecil di samping laptop, fokus biasanya jauh lebih mudah terjaga. Bukan soal begadang, melainkan memberi ruang tenang untuk berpikir jernih tanpa banyak distraksi.

Setup meja kerja pun saya buat sesimpel mungkin—hanya barang yang benar-benar dipakai setiap hari supaya pikiran ikut terasa lega.`,
    cover_image: null,
    gallery_images: [],
    published: true,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'blog-3',
    title: 'Tanya Jawab: Mulai Belajar Frontend & Memilih Tech Stack',
    slug: 'tanya-jawab-mulai-belajar-frontend',
    category: 'Tanya Jawab',
    excerpt: 'Kumpulan pertanyaan yang paling sering ditanyakan teman-teman seputar belajar coding, React, Flutter, hingga membangun portofolio.',
    content: `Q: Mulai belajar web development sebaiknya dari mana dulu?
A: Kuasai fondasi HTML, CSS, dan JavaScript terlebih dahulu. Setelah nyaman membuat halaman statis dan paham logika dasar JS, baru lanjut ke framework seperti React atau Vue.

Q: Lebih baik fokus satu stack atau belajar banyak teknologi sekaligus?
A: Fokus kuasai satu stack utama sampai bisa bikin proyek nyata dari awal sampai selesai. Setelah fondasinya kuat, berpindah atau mencoba teknologi lain seperti Flutter atau Laravel akan jauh lebih cepat.

Q: Berapa banyak proyek yang ideal untuk ditampilkan di portofolio?
A: Cukup 3 sampai 5 proyek terbaik yang benar-benar kamu pahami proses pembuatannya. Kualitas, tampilan rapi, dan cerita di balik proyek jauh lebih berarti daripada sekadar jumlah.`,
    cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
    gallery_images: [],
    published: true,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  }
];

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
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
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
            setBlogs(dummyBlogs);
            setLoading(false);
          }, 800); // Simulasi network delay
          return;
        }

        // Fetch profile
        try {
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
        } catch (profileErr) {
          console.error('Profile fetch failed:', profileErr);
        }

        // Fetch projects (fallback ke dummyProjects jika Supabase gagal/paused)
        try {
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

          if (!projectsError && projectsData) {
            setProjects(projectsData as Project[]);
          } else {
            console.error('Error fetching projects:', projectsError);
            setProjects(dummyProjects);
          }
        } catch (projErr) {
          console.error('Projects fetch failed:', projErr);
          setProjects(dummyProjects);
        }

        // Fetch blogs (fallback ke dummyBlogs jika tabel blogs belum dibuat / offline)
        try {
          const { data: blogsData, error: blogsError } = await supabase
            .from('blogs')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });

          if (!blogsError && blogsData) {
            setBlogs(blogsData as BlogPost[]);
          } else {
            setBlogs(dummyBlogs);
          }
        } catch {
          setBlogs(dummyBlogs);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to load portfolio data.');
      } finally {
        if (!isPlaceholder) setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { profile, projects, blogs, loading, error };
};
