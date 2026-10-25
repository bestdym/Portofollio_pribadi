import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image, Link2, Tag, Star, ArrowDown10 } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import type { ProjectItem } from '../../types/admin';

interface ProjectModalProps {
  isOpen: boolean;
  projectToEdit: ProjectItem | null;
  onClose: () => void;
  onSave: (projectData: Partial<ProjectItem>) => Promise<void>;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  projectToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [weight, setWeight] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManualSlug, setIsManualSlug] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || '');
      setSlug(projectToEdit.slug || '');
      setDescription(projectToEdit.description || '');
      setThumbnailUrl(projectToEdit.thumbnail_url || '');
      setTags(projectToEdit.tags || []);
      setDemoUrl(projectToEdit.demo_url || '');
      setGithubUrl(projectToEdit.github_url || '');
      setFeatured(!!projectToEdit.featured);
      setWeight(projectToEdit.weight ?? 1);
      setIsManualSlug(true);
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setThumbnailUrl('');
      setTags(['React', 'TypeScript']);
      setDemoUrl('');
      setGithubUrl('');
      setFeatured(false);
      setWeight(1);
      setIsManualSlug(false);
    }
    setTagInput('');
  }, [projectToEdit, isOpen]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isManualSlug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Judul project wajib diisi');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        thumbnail_url: thumbnailUrl.trim() || null,
        tags,
        demo_url: demoUrl.trim() || null,
        github_url: githubUrl.trim() || null,
        featured,
        weight: Number(weight) || 1,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyimpan project: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {projectToEdit ? 'Edit Proyek' : 'Tambah Proyek Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Lengkapi rincian proyek untuk ditampilkan di website portofolio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Proyek <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: E-Commerce Dashboard"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsManualSlug(true);
                }}
                placeholder="ecommerce-dashboard"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-mono text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Deskripsi Proyek
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat tentang fitur, tujuan, atau masalah yang diselesaikan dalam proyek ini..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white resize-y"
            />
          </div>

          {/* Thumbnail URL & Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-slate-500" />
              URL Gambar Thumbnail
            </label>
            <div className="flex gap-3 items-start">
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... atau URL gambar"
                className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
              {thumbnailUrl && (
                <div className="w-14 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                  <img
                    src={thumbnailUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              Teknologi / Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Ketik tag lalu tekan Enter (misal: React, Supabase)"
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                + Tambah
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-7">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Links (Demo & GitHub) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-slate-500" />
                URL Demo Live
              </label>
              <input
                type="text"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://myproject.com atau #"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-slate-500" />
                URL Repository GitHub
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Extra Options: Featured & Weight */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Star className={`w-4 h-4 ${featured ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                Jadikan Proyek Unggulan (Featured)
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <ArrowDown10 className="w-3.5 h-3.5" />
                Urutan (Weight):
              </span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                className="w-20 px-2.5 py-1.5 text-xs text-center rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : projectToEdit ? 'Simpan Perubahan' : 'Buat Proyek'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
