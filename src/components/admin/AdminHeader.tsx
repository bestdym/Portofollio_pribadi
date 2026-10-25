import React from 'react';
import { Menu, RefreshCw, Plus, ExternalLink } from 'lucide-react';
import type { AdminTab } from '../../types/admin';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onToggleSidebar: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenAddProjectModal: () => void;
}

const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Ringkasan Dashboard',
    subtitle: 'Gambaran umum performa, statistik portofolio, dan aktivitas terkini',
  },
  projects: {
    title: 'Manajemen Project',
    subtitle: 'Kelola seluruh daftar proyek, thumbnail, tag, dan link demo Anda',
  },
  messages: {
    title: 'Kotak Masuk Pesan',
    subtitle: 'Pesan dan pertanyaan yang dikirim oleh pengunjung melalui formulir kontak',
  },
  profile: {
    title: 'Profil & Bio Pengembang',
    subtitle: 'Perbarui nama, jabatan, biografi, avatar, dan tautan sosial media',
  },
  database: {
    title: 'Status Database & SQL Tool',
    subtitle: 'Koneksi Supabase, status tabel, dan skrip SQL pembantu',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onToggleSidebar,
  onRefresh,
  isRefreshing,
  onOpenAddProjectModal,
}) => {
  const info = tabTitles[currentTab] || {
    title: 'Admin Dashboard',
    subtitle: 'Kelola website portofolio Anda',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Buka navigasi menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {info.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
              {info.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-all disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Quick Add Project Button */}
          <button
            onClick={onOpenAddProjectModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Project</span>
          </button>

          {/* View Website */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors"
            title="Buka Website Portofolio"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
