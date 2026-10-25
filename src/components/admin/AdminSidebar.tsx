import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Mail, 
  User, 
  Database, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck,
  X
} from 'lucide-react';
import type { AdminTab, ProfileItem } from '../../types/admin';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  projectCount: number;
  messageCount: number;
  profile: ProfileItem | null;
  isSupabaseConnected: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  projectCount,
  messageCount,
  profile,
  isSupabaseConnected,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Ringkasan',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'projects' as AdminTab,
      label: 'Kelola Project',
      icon: FolderKanban,
      badge: projectCount > 0 ? projectCount : null,
    },
    {
      id: 'messages' as AdminTab,
      label: 'Pesan Masuk',
      icon: Mail,
      badge: messageCount > 0 ? messageCount : null,
    },
    {
      id: 'profile' as AdminTab,
      label: 'Profil & Bio',
      icon: User,
      badge: null,
    },
    {
      id: 'database' as AdminTab,
      label: 'Database & SQL',
      icon: Database,
      badge: isSupabaseConnected ? 'Live' : 'Warning',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                Admin Studio
              </h2>
              <p className="text-xs text-slate-400">Portfolio Control Center</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Status Indicator */}
        <div className="mx-4 my-3 px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              {isSupabaseConnected ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              )}
            </span>
            <span className="text-xs font-medium text-slate-300">
              {isSupabaseConnected ? 'Supabase Terhubung' : 'Mode Offline/Demo'}
            </span>
          </div>
          <ShieldCheck className={`w-4 h-4 ${isSupabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Menu Utama
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isActive
                        ? 'bg-blue-700/80 text-white'
                        : item.badge === 'Live'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Profile & Public Site Link */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 transition-colors group"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Lihat Web Portofolio
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
          </a>

          <div className="flex items-center gap-3 px-1 pt-1">
            <img
              src={profile?.avatar_url || 'https://api.dicebear.com/7.x/notionists/svg?seed=Admin'}
              alt={profile?.name || 'Admin'}
              className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 object-cover"
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLElement).setAttribute('src', 'https://api.dicebear.com/7.x/notionists/svg?seed=Admin');
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {profile?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {profile?.title || 'Super Admin'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
