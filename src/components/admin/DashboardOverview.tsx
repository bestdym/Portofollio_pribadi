import React from 'react';
import { 
  FolderKanban, 
  Star, 
  Code, 
  Mail, 
  Plus, 
  ArrowRight, 
  Database, 
  CheckCircle2, 
  ExternalLink,
  Edit3,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import type { ProjectItem, ProfileItem, ContactMessageItem, AdminTab } from '../../types/admin';

interface DashboardOverviewProps {
  projects: ProjectItem[];
  profile: ProfileItem | null;
  messages: ContactMessageItem[];
  isMessagesTableReady: boolean;
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (project: ProjectItem) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  projects,
  profile,
  messages,
  isMessagesTableReady,
  onNavigateTab,
  onOpenAddModal,
  onOpenEditModal,
}) => {
  // Statistics calculations
  const totalProjects = projects.length;
  const featuredProjects = projects.filter(p => p.featured);
  const featuredCount = featuredProjects.length;
  
  // Extract all unique tags
  const allTags = projects.flatMap(p => p.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const uniqueTagsList = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const recentProjects = [...projects].slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Dashboard Administrasi Portofolio
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Halo, {profile?.name || 'Developer'}! 👋
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Selamat datang di pusat kendali portofolio Anda. Kelola karya proyek, perbarui profil publik, dan pantau pesan masuk dari pengunjung secara real-time.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Tambah Project Baru
            </button>
            <button
              onClick={() => onNavigateTab('profile')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition-all"
            >
              <Edit3 className="w-4 h-4 text-slate-400" />
              Edit Profil Portofolio
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs sm:text-sm font-medium backdrop-blur-sm transition-all"
            >
              <span>Kunjungi Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </a>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Proyek */}
        <div 
          onClick={() => onNavigateTab('projects')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Proyek
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalProjects}
            </span>
            <span className="text-xs text-slate-500">item terdaftar</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-blue-600 font-medium">
            <span>Kelola semua proyek</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Proyek Unggulan */}
        <div 
          onClick={() => onNavigateTab('projects')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Proyek Unggulan
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {featuredCount}
            </span>
            <span className="text-xs text-slate-500">ditampilkan di hero</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-amber-600 font-medium">
            <span>{Math.round((featuredCount / (totalProjects || 1)) * 100)}% dari total proyek</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Tech Stacks */}
        <div 
          onClick={() => onNavigateTab('projects')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tech Stack
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Code className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {uniqueTagsList.length}
            </span>
            <span className="text-xs text-slate-500">teknologi unik</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-purple-600 font-medium">
            <span>Tags & keterampilan aktif</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Pesan Masuk */}
        <div 
          onClick={() => onNavigateTab('messages')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pesan Masuk
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {messages.length}
            </span>
            <span className="text-xs text-slate-500">
              {isMessagesTableReady ? 'inquiry diterima' : 'siap diaktifkan'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-emerald-600 font-medium">
            <span>Lihat kotak masuk</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Content Split: Recent Projects & Tech Stack distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column (2 cols): Proyek Terbaru */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Proyek Terbaru
                </h3>
                <p className="text-xs text-slate-500">
                  Proyek yang saat ini tersimpan di database Anda
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
                <button
                  onClick={() => onNavigateTab('projects')}
                  className="text-xs font-medium text-slate-600 hover:text-blue-600 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Semua ({totalProjects})
                </button>
              </div>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl">
                <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-700">Belum ada proyek</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Mulai tambahkan proyek portofolio Anda untuk memamerkan karya terbaik kepada pengunjung.
                </p>
                <button
                  onClick={onOpenAddModal}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Proyek Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-xl border border-slate-100 hover:border-slate-300/80 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Project Thumbnail / Icon */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center border border-slate-200">
                        {project.thumbnail_url ? (
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Layers className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">
                            {project.title}
                          </h4>
                          {project.featured && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {project.description || 'Tidak ada deskripsi'}
                        </p>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {project.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 3 && (
                              <span className="text-[10px] text-slate-400">
                                +{project.tags.length - 3} lainnya
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Edit Action */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => onOpenEditModal(project)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Tech Stack Cloud & Database Status */}
        <div className="space-y-6">
          {/* Tech Stack Distribution Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-500" />
                Distribusi Tech Stack
              </h3>
              <span className="text-xs font-medium text-slate-400">
                {uniqueTagsList.length} stack
              </span>
            </div>

            {uniqueTagsList.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Belum ada tag/teknologi yang ditambahkan ke proyek.
              </p>
            ) : (
              <div className="space-y-3">
                {uniqueTagsList.map(([tag, count]) => {
                  const percentage = Math.round((count / (totalProjects || 1)) * 100);
                  return (
                    <div key={tag} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{tag}</span>
                        <span className="text-slate-400 text-[11px] font-mono">
                          {count} proyek ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Supabase Connection Health Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-lg border border-slate-700/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Status Supabase</h4>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Terhubung & Siap
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('database')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                Detail <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400">Tabel `projects`</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {totalProjects} data
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400">Tabel `profiles`</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terkonfigurasi
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400">Tabel `messages`</span>
                <span className={`font-medium flex items-center gap-1 ${isMessagesTableReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isMessagesTableReady ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {messages.length} data
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" /> Perlu Setup
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
