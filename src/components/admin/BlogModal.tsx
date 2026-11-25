import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  BookOpen,
  Image as ImageIcon,
  Images,
  Upload,
  Eye,
  Plus,
  Trash2,
  Info,
} from 'lucide-react';
import type { BlogPostItem } from '../../types/admin';

interface BlogModalProps {
  isOpen: boolean;
  blogToEdit: BlogPostItem | null;
  onClose: () => void;
  onSave: (blogData: Partial<BlogPostItem>) => Promise<void>;
}

async function compressImageFile(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('File bukan gambar yang valid'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  blogToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [published, setPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManualSlug, setIsManualSlug] = useState(false);

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title || '');
      setSlug(blogToEdit.slug || '');
      setExcerpt(blogToEdit.excerpt || '');
      setContent(blogToEdit.content || '');
      setCoverImage(blogToEdit.cover_image || '');
      setGalleryImages(blogToEdit.gallery_images || []);
      setPublished(blogToEdit.published ?? true);
      setIsManualSlug(true);
    } else {
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setCoverImage('');
      setGalleryImages([]);
      setPublished(true);
      setIsManualSlug(false);
    }
    setGalleryInput('');
  }, [blogToEdit, isOpen]);

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

  const handleUploadCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setCoverImage(dataUrl);
    } catch (err: any) {
      alert(err.message || 'Gagal memproses foto sampul');
    } finally {
      e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    const trimmed = galleryInput.trim();
    if (trimmed && !galleryImages.includes(trimmed)) {
      setGalleryImages([...galleryImages, trimmed]);
      setGalleryInput('');
    }
  };

  const handleUploadGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      const uploaded = await Promise.all(files.map((f) => compressImageFile(f)));
      setGalleryImages((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      alert(err.message || 'Gagal memproses foto galeri');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Judul dan isi tulisan wajib diisi');
      return;
    }

    const finalExcerpt =
      excerpt.trim() ||
      content
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 150) + (content.trim().length > 150 ? '...' : '');

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        slug:
          slug.trim() ||
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') +
            '-' +
            Date.now().toString().slice(-4),
        category: blogToEdit?.category || 'Cerita',
        excerpt: finalExcerpt,
        content: content.trim(),
        cover_image: coverImage.trim() || null,
        gallery_images: galleryImages,
        published,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyimpan blog: ' + (err.message || 'Terjadi kesalahan'));
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
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {blogToEdit ? 'Edit Tulisan Blog' : 'Tulis Blog Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Bagikan pengalaman, cerita, atau tanya jawab lengkap dengan foto
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
                Judul Tulisan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: Pengalaman Pertama Rilis Aplikasi"
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
                placeholder="pengalaman-pertama-rilis-aplikasi"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-mono text-xs"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ringkasan Singkat (Opsional)
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan pendek yang tampil di kartu blog (otomatis diambil dari isi jika kosong)"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Isi Tulisan <span className="text-red-500">*</span>
            </label>
            <div className="mb-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
              <span>
                Bebas tulis pengalaman, cerita, atau tanya jawab. Jika ingin format Tanya Jawab, awali baris dengan <strong>Q:</strong> / <strong>Tanya:</strong> dan <strong>A:</strong> / <strong>Jawab:</strong>.
              </span>
            </div>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis pengalaman, cerita, atau tanya jawab Anda di sini. Pisahkan paragraf dengan baris kosong..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white resize-y"
            />
          </div>

          {/* Cover Photo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              Foto Sampul (Opsional — URL atau Upload)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/... atau upload foto"
                className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadCoverFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>
            {coverImage && (
              <div className="mt-2.5 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-36">
                <img
                  src={coverImage}
                  alt="Preview sampul"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/70 text-white hover:bg-red-600 transition-colors"
                  title="Hapus foto sampul"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Gallery Photos */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Images className="w-3.5 h-3.5 text-slate-500" />
              Galeri Foto Tambahan (Opsional)
            </label>
            <div className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddGalleryUrl();
                  }
                }}
                placeholder="Tempel URL foto lalu klik + Tambah"
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah
              </button>
              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleUploadGalleryFiles}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryFileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-colors shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {galleryImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group"
                  >
                    <img
                      src={url}
                      alt={`Galeri ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-slate-900/75 text-white hover:bg-red-600 transition-colors"
                      title="Hapus foto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publish Option */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Eye className={`w-4 h-4 ${published ? 'text-emerald-500' : 'text-slate-400'}`} />
                Publikasikan langsung di halaman depan
              </span>
            </label>
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
              {isSubmitting
                ? 'Menyimpan...'
                : blogToEdit
                ? 'Simpan Perubahan'
                : 'Terbitkan Tulisan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
