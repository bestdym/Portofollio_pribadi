import React, { useState, useEffect } from 'react';
import { supabase, isPlaceholder } from '../lib/supabase';
import type { ProjectItem, ProfileItem, ContactMessageItem, AdminTab, ToastMessage } from '../types/admin';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { ProjectsManager } from '../components/admin/ProjectsManager';
import { ProjectModal } from '../components/admin/ProjectModal';
import { MessagesManager } from '../components/admin/MessagesManager';
import { ProfileManager } from '../components/admin/ProfileManager';
import { DatabaseManager } from '../components/admin/DatabaseManager';
import { ToastNotification } from '../components/admin/ToastNotification';
import { Loader2 } from 'lucide-react';

export default function Admin() {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data states
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [profile, setProfile] = useState<ProfileItem | null>(null);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [isMessagesReady, setIsMessagesReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals & Toasts
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch all initial admin data
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);

    try {
      // 1. Fetch projects
      const { data: projData, error: projError } = await supabase
        .from('projects')
        .select('*')
        .order('weight', { ascending: true })
        .order('created_at', { ascending: false });

      if (!projError && projData) {
        setProjects(projData as ProjectItem[]);
      } else if (projError) {
        console.error('Projects fetch error:', projError);
      }

      // 2. Fetch profile
      const { data: profData, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!profError && profData) {
        setProfile(profData as ProfileItem);
      }

      // 3. Fetch messages (if table exists)
      try {
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!msgError && msgData) {
          setMessages(msgData as ContactMessageItem[]);
          setIsMessagesReady(true);
        } else {
          // Table probably doesn't exist yet
          setIsMessagesReady(false);
        }
      } catch {
        setIsMessagesReady(false);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Projects
  const handleOpenAddModal = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: ProjectItem) => {
    setProjectToEdit(proj);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (projectData: Partial<ProjectItem>) => {
    if (projectToEdit) {
      // Update
      const { error } = await supabase
        .from('projects')
        .update({
          ...projectData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectToEdit.id);

      if (error) throw error;
      addToast('success', 'Proyek Berhasil Diperbarui', `Proyek "${projectData.title}" telah disimpan.`);
    } else {
      // Create
      const { error } = await supabase
        .from('projects')
        .insert([projectData]);

      if (error) throw error;
      addToast('success', 'Proyek Baru Ditambahkan', `Proyek "${projectData.title}" berhasil dibuat.`);
    }

    fetchData(true);
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus proyek "${title}"?`)) return;

    // Optimistic UI update
    setProjects((prev) => prev.filter((p) => p.id !== id));

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      addToast('error', 'Gagal Menghapus Proyek', error.message);
      fetchData(true);
    } else {
      addToast('info', 'Proyek Dihapus', `Proyek "${title}" telah dihapus.`);
    }
  };

  const handleToggleFeatured = async (project: ProjectItem) => {
    const nextFeatured = !project.featured;

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: nextFeatured } : p))
    );

    const { error } = await supabase
      .from('projects')
      .update({ featured: nextFeatured, updated_at: new Date().toISOString() })
      .eq('id', project.id);

    if (error) {
      addToast('error', 'Gagal Memperbarui Featured', error.message);
      fetchData(true);
    } else {
      addToast(
        'success',
        nextFeatured ? 'Proyek Diunggulkan ⭐' : 'Proyek Non-Featured',
        `Status featured "${project.title}" telah diperbarui.`
      );
    }
  };

  // Handlers for Profile
  const handleSaveProfile = async (profileData: Partial<ProfileItem>) => {
    if (profile?.id) {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (error) throw error;
    }

    addToast('success', 'Profil Berhasil Disimpan', 'Informasi profil dan bio Anda telah diperbarui.');
    fetchData(true);
  };

  // Handlers for Messages
  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;

    setMessages((prev) => prev.filter((m) => m.id !== id));

    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) {
      addToast('error', 'Gagal Menghapus Pesan', error.message);
      fetchData(true);
    } else {
      addToast('info', 'Pesan Dihapus', 'Pesan kontak telah berhasil dihapus.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex">
      {/* Sidebar Component */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        projectCount={projects.length}
        messageCount={messages.length}
        profile={profile}
        isSupabaseConnected={!isPlaceholder}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Top Header */}
        <AdminHeader
          currentTab={currentTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onRefresh={() => fetchData(true)}
          isRefreshing={isRefreshing}
          onOpenAddProjectModal={handleOpenAddModal}
        />

        {/* Dynamic Body Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Memuat data admin...</p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardOverview
                  projects={projects}
                  profile={profile}
                  messages={messages}
                  isMessagesTableReady={isMessagesReady}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onOpenAddModal={handleOpenAddModal}
                  onOpenEditModal={handleOpenEditModal}
                />
              )}

              {currentTab === 'projects' && (
                <ProjectsManager
                  projects={projects}
                  onOpenAddModal={handleOpenAddModal}
                  onOpenEditModal={handleOpenEditModal}
                  onDeleteProject={handleDeleteProject}
                  onToggleFeatured={handleToggleFeatured}
                />
              )}

              {currentTab === 'messages' && (
                <MessagesManager
                  messages={messages}
                  isTableReady={isMessagesReady}
                  onDeleteMessage={handleDeleteMessage}
                  onRefresh={() => fetchData(true)}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileManager
                  profile={profile}
                  onSaveProfile={handleSaveProfile}
                />
              )}

              {currentTab === 'database' && (
                <DatabaseManager
                  supabaseUrl={import.meta.env.VITE_SUPABASE_URL || ''}
                  isPlaceholder={isPlaceholder}
                  projectCount={projects.length}
                  messageCount={messages.length}
                  isMessagesReady={isMessagesReady}
                  onRefresh={() => fetchData(true)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Add / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        projectToEdit={projectToEdit}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
      />

      {/* Floating Notifications */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
