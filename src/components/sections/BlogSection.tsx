import React, { useState, useEffect } from 'react';
import SkeletonCard from '../SkeletonCard';
import type { BlogPost } from '../../hooks/usePortfolioData';
import {
  ScrollReveal,
  Tilt3DCard,
  ParallaxImage,
  ParallaxLayer,
  ParallaxSectionBackdrop,
} from '../motion/ScrollMotion';
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
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const hasQA = lines.some((l) => /^(Q:|Tanya:|T:)/i.test(l));

    if (hasQA) {
      return (
        <div
          key={index}
          className="rounded-2xl bg-[#F6F3EE] border border-[#E7E1D8] p-4 sm:p-5 space-y-2.5"
        >
          {lines.map((line, i) => {
            if (/^(Q:|Tanya:|T:)/i.test(line)) {
              const cleaned = line.replace(/^(Q:|Tanya:|T:)\s*/i, '');
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-0.5 px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-[#1C1917] text-[#FFFDF9]">
                    Tanya
                  </span>
                  <p className="font-semibold text-[#1C1917] text-sm sm:text-base leading-relaxed">
                    {cleaned}
                  </p>
                </div>
              );
            }
            if (/^(A:|Jawab:|J:)/i.test(line)) {
              const cleaned = line.replace(/^(A:|Jawab:|J:)\s*/i, '');
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="shrink-0 mt-0.5 px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-[#8C6239]/15 text-[#8C6239]">
                    Jawab
                  </span>
                  <p className="text-[#57534E] text-sm sm:text-base leading-relaxed">
                    {cleaned}
                  </p>
                </div>
              );
            }
            return (
              <p key={i} className="text-[#57534E] text-sm sm:text-base leading-relaxed">
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
        className="text-[#57534E] text-sm sm:text-base leading-relaxed whitespace-pre-line"
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
    <section id="blog" className="py-24 relative overflow-hidden">
      <ParallaxSectionBackdrop label="JOURNAL" direction="left" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header: Kecil -> Besar */}
        <ScrollReveal variant="scale" className="text-center mb-16">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8C6239] mb-2">
            Journal & Notes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4 tracking-tight">
            Blog
          </h2>
          <p className="text-[#57534E] max-w-lg mx-auto text-sm md:text-base">
            Berbagi pengalaman, cerita, dan tanya jawab seputar perjalanan saya.
          </p>
        </ScrollReveal>

        {/* Content Grid: Kanan -> Kiri + 3D Tilt Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <ScrollReveal variant="scale">
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E7E1D8] p-12 text-center max-w-lg mx-auto shadow-xs">
              <Sparkles className="w-8 h-8 text-[#C2A382] mx-auto mb-3" />
              <p className="text-[#1C1917] font-semibold text-base mb-1">
                Belum ada tulisan blog
              </p>
              <p className="text-[#57534E] text-sm">
                Tulisan pengalaman, cerita, atau tanya jawab akan segera hadir di sini.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, index) => {
              const extraPhotosCount = post.gallery_images?.length || 0;
              const colOffset = index % 3 === 1 ? 26 : -14;

              return (
                <ParallaxLayer
                  key={post.id}
                  offsetY={colOffset}
                  desktopOnly
                  className="h-full"
                >
                  <ScrollReveal
                    variant="left"
                    delay={index * 0.08}
                    className="h-full"
                  >
                    <Tilt3DCard
                      onClick={() => setSelectedPost(post)}
                      className="rounded-2xl cursor-pointer"
                    >
                      <article className="h-full flex flex-col bg-[#FFFDF9] rounded-2xl overflow-hidden shadow-[0_8px_28px_rgba(28,25,23,0.05)] hover:shadow-[0_18px_40px_rgba(28,25,23,0.1)] transition-shadow duration-300 border border-[#E7E1D8] group">
                        {/* Cover Photo with Parallax */}
                        <div className="relative h-52 w-full bg-[#EAE4DC] overflow-hidden flex items-center justify-center">
                          {post.cover_image ? (
                            <ParallaxImage
                              src={post.cover_image}
                              alt={post.title}
                              strength={11}
                            />
                          ) : (
                            <div className="text-[#78716C] text-sm font-medium flex flex-col items-center gap-2">
                              <BookOpen className="w-7 h-7 text-[#A8A29E]" />
                              <span className="text-xs font-mono text-[#78716C]">
                                Blog Post
                              </span>
                            </div>
                          )}

                          {/* Gallery Count Badge */}
                          {extraPhotosCount > 0 && (
                            <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 bg-[#1C1917]/75 backdrop-blur-md text-[#FFFDF9] rounded-md">
                              <Images className="w-3.5 h-3.5" />+{extraPhotosCount} foto
                            </div>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex flex-col flex-1">
                          {post.created_at && (
                            <div className="flex items-center gap-1.5 text-xs text-[#78716C] mb-2.5">
                              <Calendar className="w-3.5 h-3.5 text-[#8C6239]" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                          )}

                          <h3 className="font-bold text-xl text-[#1C1917] mb-2.5 leading-snug group-hover:text-[#8C6239] transition-colors line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-sm text-[#57534E] line-clamp-3 mb-6 flex-1 leading-relaxed">
                            {post.excerpt || post.content}
                          </p>

                          <div className="mt-auto pt-4 border-t border-[#EFEAE2] flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C6239] group-hover:text-[#1C1917] transition-colors">
                              Baca selengkapnya
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Tilt3DCard>
                  </ScrollReveal>
                </ParallaxLayer>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 z-50 bg-[#1C1917]/65 backdrop-blur-xs overflow-y-auto flex items-start sm:items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#FFFDF9] rounded-3xl max-w-3xl w-full shadow-2xl border border-[#E7E1D8] overflow-hidden my-6 max-h-[90vh] flex flex-col"
          >
            {/* Top Sticky Bar */}
            <div className="px-6 py-4 border-b border-[#EFEAE2] flex items-center justify-between gap-4 bg-[#FFFDF9]/95 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2.5">
                {selectedPost.created_at && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E]">
                    <Calendar className="w-3.5 h-3.5 text-[#8C6239]" />
                    {formatDate(selectedPost.created_at)}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 text-[#78716C] hover:text-[#1C1917] hover:bg-[#F6F3EE] rounded-full transition-colors cursor-pointer"
                aria-label="Tutup artikel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Article Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] leading-tight">
                {selectedPost.title}
              </h2>

              {selectedPost.cover_image && (
                <div
                  onClick={() => setLightboxImage(selectedPost.cover_image || null)}
                  className="rounded-2xl overflow-hidden border border-[#E7E1D8] bg-[#EAE4DC] cursor-zoom-in group"
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
                <div className="pt-6 border-t border-[#EFEAE2] space-y-3">
                  <h4 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                    <Images className="w-4 h-4 text-[#8C6239]" />
                    Galeri Foto ({selectedPost.gallery_images.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPost.gallery_images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(imgUrl)}
                        className="rounded-2xl overflow-hidden border border-[#E7E1D8] bg-[#EAE4DC] aspect-video cursor-zoom-in group"
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
          className="fixed inset-0 z-[60] bg-[#1C1917]/92 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FFFDF9] transition-colors cursor-pointer"
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
