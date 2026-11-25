import React, { useState, useEffect } from 'react';
import SkeletonCard from '../SkeletonCard';
import type { BlogPost } from '../../hooks/usePortfolioData';
import {
  BookOpen,
  Calendar,
  ArrowRight,
  X,
  Images,
  Sparkles,
} from 'lucide-react';

function formatDate(dateString?: string) {
  if (!dateString) return '';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return '';
  }
}

function renderFormattedContent(content: string) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const hasQA = lines.some((l) => /^(Q:|Tanya:|T:)/i.test(l));

    if (hasQA) {
      return (
        <div
          key={index}
          className="rounded-2xl bg-slate-50 border border-slate-200/70 p-4 sm:p-5 space-y-2.5"
        >
          {lines.map((line, i) => {
            if (/^(Q:|Tanya:|T:)/i.test(line)) {
              const cleaned = line.replace(/^(Q:|Tanya:|T:)\s*/i, '');
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-0.5 px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-700">
                    Tanya
                  </span>
                  <p className="font-semibold text-slate-800 text-sm sm:text-base leading-relaxed">
                    {cleaned}
                  </p>
                </div>
              );
            }
            if (/^(A:|Jawab:|J:)/i.test(line)) {
              const cleaned = line.replace(/^(A:|Jawab:|J:)\s*/i, '');
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-0.5 px-2 py-0.5 text-[11px] font-bold rounded-md bg-blue-100 text-blue-700">
                    Jawab
                  </span>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {cleaned}
                  </p>
                </div>
              );
            }
            return (
              <p key={i} className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>
      );
    }

    return (
      <p
        key={index}
        className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line"
      >
        {block}
      </p>
    );
  });
}

export default function BlogSection({
  blogs,
  loading,
}: {
  blogs: BlogPost[];
  loading: boolean;
}) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null);
        } else if (selectedPost) {
          setSelectedPost(null);
        }
      }
    };

    if (selectedPost || lightboxImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPost, lightboxImage]);

  return (
    <section id="blog" className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Blog
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base">
            Berbagi pengalaman, cerita, dan tanya jawab seputar perjalanan saya.
          </p>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold text-base mb-1">
              Belum ada tulisan blog
            </p>
            <p className="text-slate-500 text-sm">
              Tulisan pengalaman, cerita, atau tanya jawab akan segera hadir di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => {
              const extraPhotosCount = post.gallery_images?.length || 0;

              return (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/80 group cursor-pointer"
                >
                  {/* Cover Photo */}
                  <div className="relative h-52 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        draggable={false}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-slate-400 text-sm font-medium flex flex-col items-center gap-2">
                        <BookOpen className="w-7 h-7 text-slate-300" />
                        <span className="text-xs font-mono text-slate-400">
                          Blog Post
                        </span>
                      </div>
                    )}

                    {/* Gallery Count Badge */}
                    {extraPhotosCount > 0 && (
                      <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-md">
                        <Images className="w-3.5 h-3.5" />
                        +{extraPhotosCount} foto
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1">
                    {post.created_at && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    )}

                    <h3 className="font-bold text-xl text-slate-800 mb-2.5 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                      {post.excerpt || post.content}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-500 group-hover:text-blue-600 transition-colors">
                        Baca selengkapnya
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs overflow-y-auto flex items-start sm:items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200/80 overflow-hidden my-6 max-h-[90vh] flex flex-col"
          >
            {/* Top Sticky Bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-white/95 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2.5">
                {selectedPost.created_at && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(selectedPost.created_at)}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Tutup artikel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Article Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                {selectedPost.title}
              </h2>

              {selectedPost.cover_image && (
                <div
                  onClick={() => setLightboxImage(selectedPost.cover_image || null)}
                  className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 cursor-zoom-in group"
                >
                  <img
                    src={selectedPost.cover_image}
                    alt={selectedPost.title}
                    className="w-full max-h-96 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              )}

              {/* Article Body */}
              <div className="space-y-4">
                {renderFormattedContent(selectedPost.content)}
              </div>

              {/* Photo Gallery */}
              {selectedPost.gallery_images && selectedPost.gallery_images.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Images className="w-4 h-4 text-blue-500" />
                    Galeri Foto ({selectedPost.gallery_images.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPost.gallery_images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(imgUrl)}
                        className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 aspect-video cursor-zoom-in group"
                      >
                        <img
                          src={imgUrl}
                          alt={`${selectedPost.title} - foto ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Image Preview */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Tutup pratinjau foto"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxImage}
            alt="Pratinjau foto"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[88vh] rounded-2xl object-contain shadow-2xl cursor-default"
          />
        </div>
      )}
    </section>
  );
}
