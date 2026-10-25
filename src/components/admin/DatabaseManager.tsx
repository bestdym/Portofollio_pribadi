import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, Shield, Server, RefreshCw } from 'lucide-react';

interface DatabaseManagerProps {
  supabaseUrl: string;
  isPlaceholder: boolean;
  projectCount: number;
  messageCount: number;
  isMessagesReady: boolean;
  onRefresh: () => void;
}

export const DatabaseManager: React.FC<DatabaseManagerProps> = ({
  supabaseUrl,
  isPlaceholder,
  projectCount,
  messageCount,
  isMessagesReady,
  onRefresh,
}) => {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const fullSchemaSql = `-- ==========================================
-- SKRIP SETUP SUPABASE LENGKAP - PORTOFOLIO
-- ==========================================

-- 1. Tabel Profil (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Proyek (projects)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  weight NUMERIC DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Pesan Masuk (messages)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Publik bisa melihat profil & proyek
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public profiles all" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public projects read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public projects all" ON public.projects FOR ALL USING (true);

-- Publik bisa kirim pesan kontak, dan admin bisa baca/kelola
CREATE POLICY "Public messages insert" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public messages read" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Public messages delete" ON public.messages FOR DELETE USING (true);
`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(label);
    setTimeout(() => setCopiedScript(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Connection Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Informasi Supabase Backend
              </h3>
              <p className="text-xs text-slate-500">
                Parameter koneksi database PostgreSQL & Supabase API
              </p>
            </div>
          </div>

          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Uji Ulang Koneksi
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-500 font-medium">Supabase URL</span>
            <p className="font-mono text-slate-900 font-semibold break-all">
              {supabaseUrl || 'https://placeholder.supabase.co'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-500 font-medium">Status Kunci Anonim</span>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${!isPlaceholder ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-semibold text-slate-800">
                {!isPlaceholder ? 'Varian Anon Key Terkonfigurasi' : 'Menggunakan Kunci Dummy / Demo'}
              </span>
            </div>
          </div>
        </div>

        {/* Tables Health Grid */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-600" />
            Status Tabel Database
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-white">
              <div>
                <p className="font-mono text-xs font-semibold text-slate-800">projects</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{projectCount} baris data</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-white">
              <div>
                <p className="font-mono text-xs font-semibold text-slate-800">profiles</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Terkonfigurasi</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-white">
              <div>
                <p className="font-mono text-xs font-semibold text-slate-800">messages</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isMessagesReady ? `${messageCount} pesan` : 'Belum dibuat'}
                </p>
              </div>
              {isMessagesReady ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SQL Script Generator Card */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Skrip SQL Struktur Database Lengkap
            </h3>
            <p className="text-xs text-slate-400">
              Salin dan jalankan di SQL Editor Supabase untuk memastikan semua tabel dan RLS aktif sempurna
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(fullSchemaSql, 'all')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-xs"
            >
              {copiedScript === 'all' ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Salin Skrip SQL
                </>
              )}
            </button>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Buka Supabase Dashboard"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="relative rounded-xl bg-slate-950 p-4 font-mono text-xs overflow-x-auto max-h-72 text-slate-300 border border-slate-800">
          <pre>{fullSchemaSql}</pre>
        </div>
      </div>
    </div>
  );
};
