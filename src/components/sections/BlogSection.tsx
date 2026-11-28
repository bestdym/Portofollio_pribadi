import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkeletonCard from '../SkeletonCard';
import BlogDiscussion from './BlogDiscussion';
import type { BlogPost } from '../../hooks/usePortfolioData';
import { fetchBlogCommentCounts } from '../../services/blogCommentService';
import {
  ScrollReveal,
  Tilt3DCard,
  ParallaxImage,
  ParallaxLayer,
  ParallaxSectionBackdrop,
} from '../motion/ScrollMotion';
import {
  Calendar,
  ArrowRight,
  X,
  Images,
  Sparkles,
  ChevronDown,
  MessageCircleQuestion,
  MessageSquare,
  Quote,
} from 'lucide-react';

interface QAItem {
  question: string;
  answer: string;
}

type ContentBlock =
  | { type: 'qa'; items: QAItem[] }
  | { type: 'paragraph'; text: string };

function formatDate(dateString?: string) {
  if (!dateString) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return '';
  }
}

/**
 * Parse blog content into regular paragraphs and structured Q&A pairs.
 * Supports lines prefixed with Q:/Tanya:/T: and A:/Jawab:/J:
 */
function parseBlogContent(content: string): { blocks: ContentBlock[]; qaItems: QAItem[] } {
  const rawBlocks = content
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const blocks: ContentBlock[] = [];
  const allQA: QAItem[] = [];

  for (const block of rawBlocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const hasQA = lines.some((l) => /^(Q:|Tanya:|T:)/i.test(l));

    if (hasQA) {
      const qaItems: QAItem[] = [];
      let currentQ = '';
      let currentA: string[] = [];

      const flush = () => {
        if (currentQ) {
          qaItems.push({
            question: currentQ,
            answer: currentA.join('\n').trim(),
          });
          currentQ = '';
          currentA = [];
        }
      };

      for (const line of lines) {
        if (/^(Q:|Tanya:|T:)/i.test(line)) {
          flush();
          currentQ = line.replace(/^(Q:|Tanya:|T:)\s*/i, '').trim();
        } else if (/^(A:|Jawab:|J:)/i.test(line)) {
          currentA.push(line.replace(/^(A:|Jawab:|J:)\s*/i, '').trim());
        } else if (currentQ) {
          currentA.push(line);
        }
      }
      flush();

      if (qaItems.length > 0) {
        allQA.push(...qaItems);
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock && lastBlock.type === 'qa') {
          lastBlock.items.push(...qaItems);
        } else {
          blocks.push({ type: 'qa', items: qaItems });
        }
        continue;
      }
    }

    blocks.push({ type: 'paragraph', text: block });
  }

  return { blocks, qaItems: allQA };
}

/**
 * Reusable interactive accordion for Q&A items (works both on cards and in modal)
 */
function InteractiveQAAccordion({
  items,
  compact = false,
  defaultOpenIndex = 0,
  dark = false,
}: {
  items: QAItem[];
  compact?: boolean;
  defaultOpenIndex?: number | null;
  dark?: boolean;
}) {
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex !== null && items.length > defaultOpenIndex ? [defaultOpenIndex] : []
  );

  const toggleIndex = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (openIndices.length === items.length) {
      setOpenIndices([]);
    } else {
      setOpenIndices(items.map((_, i) => i));
    }
  };

  return (
    <div className="space-y-2.5" onClick={(e) => e.stopPropagation()}>
      {!compact && items.length > 1 && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <MessageCircleQuestion className="w-3.5 h-3.5" />
            {items.length} Interactive Questions
          </span>
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            {openIndices.length === items.length ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      )}

      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        return (
          <div
            key={idx}
            className={`rounded-xl border transition-colors duration-200 overflow-hidden ${
              dark
                ? isOpen
                  ? 'bg-neutral-900 border-neutral-700'
                  : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                : isOpen
                ? 'bg-white border-neutral-300 shadow-2xs'
                : 'bg-neutral-50/90 border-neutral-200/80 hover:border-neutral-300'
            }`}
          >
            <button
              type="button"
              onClick={(e) => toggleIndex(idx, e)}
              className={`w-full text-left flex items-start justify-between gap-3 cursor-pointer ${
                compact ? 'px-3.5 py-3' : 'px-4 py-3.5'
              }`}
              aria-expanded={isOpen}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span
                  className={`shrink-0 mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${
                    dark
                      ? 'bg-white text-neutral-950'
                      : 'bg-neutral-950 text-white'
                  }`}
                >
                  Q
                </span>
                <span
                  className={`font-semibold leading-snug ${
                    compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                  } ${dark ? 'text-white' : 'text-neutral-900'}`}
                >
                  {item.question}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 shrink-0 mt-0.5 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                } ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className={`border-t ${
                      compact ? 'px-3.5 py-3' : 'px-4 py-3.5'
                    } ${
                      dark
                        ? 'border-neutral-800 bg-neutral-950/50'
                        : 'border-neutral-100 bg-neutral-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`shrink-0 mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${
                          dark
                            ? 'bg-neutral-800 text-neutral-200'
                            : 'bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        A
                      </span>
                      <p
                        className={`leading-relaxed whitespace-pre-line ${
                          compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                        } ${dark ? 'text-neutral-300' : 'text-neutral-600'}`}
                      >
                        {item.answer || 'No answer yet.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Determine flexible asymmetric bento span & layout direction per post
 * so rows alternate naturally (kanan-kiri) without orphaned gaps.
 */
function getCardLayout(index: number, total: number, hasPhoto: boolean) {
  // Single post: centered wide editorial feature
  if (total === 1) {
    return {
      colSpan: 'md:col-span-10 md:col-start-2',
      horizontal: hasPhoto,
      photoSide: 'left' as const,
      reveal: 'scale' as const,
      parallaxOffset: 0,
    };
  }

  // Last orphaned item on an odd count (e.g. 3rd, 5th, 7th post) -> full-width spotlight alternating side
  if (total % 2 === 1 && index === total - 1) {
    const photoSide = index % 4 === 2 ? ('right' as const) : ('left' as const);
    return {
      colSpan: 'md:col-span-12',
      horizontal: hasPhoto,
      photoSide,
      reveal: photoSide === 'right' ? ('right' as const) : ('left' as const),
      parallaxOffset: 0,
    };
  }

  // Alternating asymmetric pairs: Row A = (7, 5), Row B = (5, 7)
  const pairIndex = Math.floor(index / 2);
  const isLeftSlot = index % 2 === 0;
  const isEvenRow = pairIndex % 2 === 0;

  const isWide = isEvenRow ? isLeftSlot : !isLeftSlot;

  return {
    colSpan: isWide ? 'md:col-span-7' : 'md:col-span-5',
    horizontal: isWide && hasPhoto,
    photoSide: isLeftSlot ? ('left' as const) : ('right' as const),
    reveal: isLeftSlot ? ('right' as const) : ('left' as const),
    parallaxOffset: isWide ? -55 : 75,
  };
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
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (blogs.length === 0) return;
    fetchBlogCommentCounts().then(setCommentCounts);
  }, [blogs]);

  const handleCommentCountChange = useCallback((blogId: string, nextCount: number) => {
    setCommentCounts((prev) =>
      prev[blogId] === nextCount ? prev : { ...prev, [blogId]: nextCount }
    );
  }, []);

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

  const parsedSelectedPost = selectedPost
    ? parseBlogContent(selectedPost.content)
    : null;

  return (
    <section id="blog" className="py-24 relative overflow-hidden">
      <ParallaxSectionBackdrop label="JOURNAL" direction="left" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <ParallaxLayer offsetY={-30} desktopOnly>
          <ScrollReveal variant="scale" className="text-center mb-16">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 mb-2">
              Journal &amp; Notes
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-4 tracking-tight">
              Blog
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto text-sm md:text-base">
              Experiences, short stories, and open discussions on every post.
            </p>
          </ScrollReveal>
        </ParallaxLayer>

        {/* Flexible Asymmetric Kanan-Kiri Bento Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <ScrollReveal variant="scale">
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-12 text-center max-w-lg mx-auto">
              <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-900 font-semibold text-base mb-1">
                No blog posts yet
              </p>
              <p className="text-neutral-500 text-sm">
                Experiences, stories, and Q&amp;A posts will appear here soon.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {blogs.map((post, index) => {
              const hasPhoto = Boolean(post.cover_image && post.cover_image.trim());
              const extraPhotosCount = post.gallery_images?.length || 0;
              const { qaItems } = parseBlogContent(post.content);
              const isInteractiveQA = qaItems.length > 0;
              const layout = getCardLayout(index, blogs.length, hasPhoto);

              // Subtle editorial dark contrast card for selected text-only posts (optional variety)
              const isDarkEditorial = !hasPhoto && !isInteractiveQA && index % 3 === 1;

              return (
                <ParallaxLayer
                  key={post.id}
                  offsetY={layout.parallaxOffset}
                  desktopOnly
                  className={`${layout.colSpan} h-full`}
                >
                  <ScrollReveal
                    variant={layout.reveal}
                    delay={(index % 3) * 0.08}
                    className="h-full"
                  >
                    <Tilt3DCard
                      onClick={() => setSelectedPost(post)}
                      maxTilt={isInteractiveQA ? 3 : 5}
                      className="rounded-3xl cursor-pointer"
                    >
                      <article
                        className={`h-full flex overflow-hidden rounded-3xl transition-all duration-300 border group ${
                          layout.horizontal
                            ? layout.photoSide === 'right'
                              ? 'flex-col lg:flex-row-reverse'
                              : 'flex-col lg:flex-row'
                            : 'flex-col'
                        } ${
                          isDarkEditorial
                            ? 'bg-neutral-950 text-white border-neutral-800 shadow-[0_14px_38px_rgba(0,0,0,0.16)]'
                            : 'bg-neutral-50/75 hover:bg-white text-neutral-950 border-neutral-200/90 hover:border-neutral-300 shadow-[0_6px_26px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_42px_rgba(0,0,0,0.08)]'
                        }`}
                      >
                        {/* Optional Photo — only rendered when cover_image exists */}
                        {hasPhoto && post.cover_image && (
                          <div
                            className={`relative bg-neutral-100 overflow-hidden shrink-0 ${
                              layout.horizontal
                                ? 'h-56 lg:h-auto lg:w-[46%]'
                                : 'h-52 w-full'
                            }`}
                          >
                            <ParallaxImage
                              src={post.cover_image}
                              alt={post.title}
                              strength={26}
                            />

                            {extraPhotosCount > 0 && (
                              <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 bg-neutral-950/75 backdrop-blur-md text-white rounded-md">
                                <Images className="w-3.5 h-3.5" />+{extraPhotosCount} photos
                              </div>
                            )}
                          </div>
                        )}

                        {/* Card Body */}
                        <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between min-w-0">
                          <div>
                            {/* Top Meta Row */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              {post.created_at ? (
                                <div
                                  className={`flex items-center gap-1.5 text-xs ${
                                    isDarkEditorial
                                      ? 'text-neutral-400'
                                      : 'text-neutral-400'
                                  }`}
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{formatDate(post.created_at)}</span>
                                </div>
                              ) : (
                                <span />
                              )}

                              {!hasPhoto && !isInteractiveQA && (
                                <Quote
                                  className={`w-4 h-4 ${
                                    isDarkEditorial
                                      ? 'text-neutral-600'
                                      : 'text-neutral-300'
                                  }`}
                                />
                              )}

                              {isInteractiveQA && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-neutral-200/80 text-neutral-800">
                                  <MessageCircleQuestion className="w-3 h-3" />
                                  Q&amp;A
                                </span>
                              )}

                              {!hasPhoto && extraPhotosCount > 0 && (
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                                    isDarkEditorial
                                      ? 'bg-neutral-800 text-neutral-200'
                                      : 'bg-neutral-200/80 text-neutral-700'
                                  }`}
                                >
                                  <Images className="w-3 h-3" />
                                  {extraPhotosCount} photos
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3
                              className={`font-bold leading-snug mb-3 transition-colors ${
                                !hasPhoto && !isInteractiveQA
                                  ? 'text-2xl sm:text-[1.6rem]'
                                  : 'text-xl'
                              } ${
                                isDarkEditorial
                                  ? 'text-white group-hover:text-neutral-200'
                                  : 'text-neutral-950 group-hover:text-neutral-700'
                              }`}
                            >
                              {post.title}
                            </h3>

                            {/* Interactive Q&A right on the card OR clean editorial excerpt */}
                            {isInteractiveQA ? (
                              <div className="mt-4 mb-5">
                                <InteractiveQAAccordion
                                  items={qaItems.slice(0, 3)}
                                  compact
                                  defaultOpenIndex={0}
                                />
                                {qaItems.length > 3 && (
                                  <p className="mt-2.5 text-xs text-neutral-400">
                                    +{qaItems.length - 3} more questions...
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p
                                className={`text-sm leading-relaxed mb-6 ${
                                  !hasPhoto ? 'line-clamp-5' : 'line-clamp-3'
                                } ${
                                  isDarkEditorial
                                    ? 'text-neutral-300'
                                    : 'text-neutral-600'
                                }`}
                              >
                                {post.excerpt || post.content}
                              </p>
                            )}
                          </div>

                          {/* Footer Read More & Live Discussion Count */}
                          <div
                            className={`mt-auto pt-4 border-t flex items-center justify-between gap-3 ${
                              isDarkEditorial
                                ? 'border-neutral-800'
                                : 'border-neutral-200/70'
                            }`}
                          >
                            <span
                              className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                                isDarkEditorial
                                  ? 'text-white group-hover:text-neutral-300'
                                  : 'text-neutral-800 group-hover:text-neutral-950'
                              }`}
                            >
                              {isInteractiveQA ? 'Open & Discuss' : 'Read & Discuss'}
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                isDarkEditorial
                                  ? 'text-neutral-400'
                                  : 'text-neutral-500'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              {commentCounts[post.id] || 0}
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
      {selectedPost && parsedSelectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 z-50 bg-neutral-950/65 backdrop-blur-xs overflow-y-auto flex items-start sm:items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-6 max-h-[90vh] flex flex-col"
          >
            {/* Top Sticky Bar */}
            <div className="px-6 py-4 border-b border-neutral-200/80 flex items-center justify-between gap-4 bg-white/95 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2.5">
                {selectedPost.created_at && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                    <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                    {formatDate(selectedPost.created_at)}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Article Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 leading-tight">
                {selectedPost.title}
              </h2>

              {selectedPost.cover_image && (
                <div
                  onClick={() => setLightboxImage(selectedPost.cover_image || null)}
                  className="rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 cursor-zoom-in group"
                >
                  <img
                    src={selectedPost.cover_image}
                    alt={selectedPost.title}
                    className="w-full max-h-96 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              )}

              {/* Article Body with Interactive Q&A */}
              <div className="space-y-5">
                {parsedSelectedPost.blocks.map((block, idx) =>
                  block.type === 'qa' ? (
                    <InteractiveQAAccordion
                      key={idx}
                      items={block.items}
                      defaultOpenIndex={0}
                    />
                  ) : (
                    <p
                      key={idx}
                      className="text-neutral-600 text-sm sm:text-base leading-relaxed whitespace-pre-line"
                    >
                      {block.text}
                    </p>
                  )
                )}
              </div>

              {/* Photo Gallery */}
              {selectedPost.gallery_images && selectedPost.gallery_images.length > 0 && (
                <div className="pt-6 border-t border-neutral-200/80 space-y-3">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Images className="w-4 h-4 text-neutral-600" />
                    Photo Gallery ({selectedPost.gallery_images.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPost.gallery_images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(imgUrl)}
                        className="rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 aspect-video cursor-zoom-in group"
                      >
                        <img
                          src={imgUrl}
                          alt={`${selectedPost.title} - photo ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Live Two-Way Discussion & Q&A with Visitors */}
              <BlogDiscussion
                blogId={selectedPost.id}
                onCommentCountChange={handleCommentCountChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Image Preview */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[60] bg-neutral-950/92 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close photo preview"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxImage}
            alt="Photo preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[88vh] rounded-2xl object-contain shadow-2xl cursor-default"
          />
        </div>
      )}
    </section>
  );
}
