import React, { useState, useEffect } from 'react';
import { supabase, isPlaceholder } from '../lib/supabase';
import type { Project } from '../hooks/usePortfolioData';

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (isPlaceholder) {
      setLoading(false);
      return;
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setProjects(data as Project[]);
      } else if (error) {
        console.error("Supabase Error:", error);
      }
    } catch (err) {
      console.error("Network Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { error } = await supabase.from('projects').insert([
      { title: newTitle, slug, description: 'Deskripsi baru', featured: false }
    ]);

    if (!error) {
      setNewTitle('');
      fetchProjects();
    } else {
      alert('Gagal menambah project: ' + error.message);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      fetchProjects();
    }
  };

  if (loading) return <div className="p-10">Loading admin data...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <h1 className="text-2xl font-bold mb-6">Admin Panel - Portofolio</h1>
        
        {isPlaceholder ? (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <h2 className="text-lg font-semibold mb-2">⚠️ Supabase Belum Terhubung</h2>
            <p>Anda belum menghubungkan project ini ke Supabase. Fitur Admin tidak bisa digunakan sampai Anda mengatur <strong>VITE_SUPABASE_URL</strong> dan <strong>VITE_SUPABASE_ANON_KEY</strong> di file <code>.env.local</code>.</p>
            <p className="mt-2 text-sm">Silakan ikuti panduan di <strong>admin_setup_guide.md</strong> untuk mengatur database Anda.</p>
          </div>
        ) : (
          <>
            <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Tambah Project Baru</h2>
              <form onSubmit={addProject} className="flex gap-2">
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nama Project" 
                  className="flex-1 px-4 py-2 rounded border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                />
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
                  Tambah
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Daftar Project</h2>
              {projects.length === 0 ? (
                <p className="text-slate-500 text-sm">Belum ada project di database Supabase Anda.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <div>
                        <h3 className="font-medium">{proj.title}</h3>
                        <p className="text-xs text-slate-500">{proj.slug}</p>
                      </div>
                      <button 
                        onClick={() => deleteProject(proj.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 bg-red-50 rounded border border-red-100"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="mt-8 text-sm text-slate-500">
          <p>Catatan: Anda bisa kembali ke <a href="/" className="text-blue-500 hover:underline">Beranda Publik</a>.</p>
        </div>
      </div>
    </div>
  );
}
