import React, { useState } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Images,
  AlertCircle,
  Database,
  Calendar,
} from 'lucide-react';
import type { BlogPostItem } from '../../types/admin';

interface BlogsManagerProps {
  blogs: BlogPostItem[];
  isTableReady: boolean;
  onOpenAddModal: () => void;
  onOpenEditModal: (blog: BlogPostItem) => void;
  onDeleteBlog: (id: string, title: string) => void;
  onTogglePublished: (blog: BlogPostItem) => void;
  onNavigateToDatabase: () => void;
}

export const BlogsManager: React.FC<BlogsManagerProps> = ({
  blogs,
  isTableReady,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteBlog,
  onTogglePublished,
  onNavigateToDatabase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = blogs.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Warning banner if blogs table not yet created in Supabase */}
      {!isTableReady && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Tabel `blogs` belum dibuat di Supabase
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Halaman utama saat ini menampilkan contoh blog bawaan. Jalankan skrip SQL di menu Database & SQL agar Anda bisa menyimpan tulisan sendiri ke Supabase.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToDatabase}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 self-start sm:self-center"
          >
            <Database className="w-3.5 h-3.5" />
            Buka Skrip SQL
          </button>
        </div>
      )}

      {/* Top Filter & Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul atau isi blog..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 hover:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Blog</span>
          </button>
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {searchTerm ? 'Tulisan tidak ditemukan' : 'Belum ada tulisan blog'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? `Tidak ditemukan blog dengan kata kunci "${searchTerm}".`
              : 'Mulai tulis pengalaman, cerita, atau tanya jawab pertama Anda lengkap dengan foto.'}
          </p>
          {!searchTerm && (
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tulis Blog Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Cover Image */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-100">
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-tr from-slate-100 to-slate-200">
                    <BookOpen className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-[11px] font-mono">No Cover Photo</span>
                  </div>
                )}

                {/* Publish Toggle Badge */}
                <button
                  onClick={() => onTogglePublished(post)}
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md transition-all shadow-xs flex items-center gap-1 ${
                    post.published
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-slate-800/80 text-slate-200 hover:bg-slate-900'
                  }`}
                  title={post.published ? 'Tayang (Klik untuk jadikan Draft)' : 'Draft (Klik untuk Publikasikan)'}
                >
                  {post.published ? (
                    <>
                      <Eye className="w-3 h-3" /> Tayang
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" /> Draft
                    </>
                  )}
                </button>

                {post.gallery_images && post.gallery_images.length > 0 && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/65 text-white text-[10px] font-medium flex items-center gap-1">
                    <Images className="w-3 h-3" />
                    +{post.gallery_images.length} foto
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {post.created_at && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(post.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.excerpt || post.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[140px]">
                    /{post.slug}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenEditModal(post)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteBlog(post.id, post.title)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Tulisan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
