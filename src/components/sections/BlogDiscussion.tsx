import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlogCommentItem } from '../../types/admin';
import {
  fetchBlogComments,
  createBlogComment,
} from '../../services/blogCommentService';
import {
  MessageSquare,
  Send,
  CornerDownRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

interface BlogDiscussionProps {
  blogId: string;
  onCommentCountChange?: (blogId: string, nextCount: number) => void;
}

function formatDateTime(dateStr: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  } catch {
    return '';
  }
}

export default function BlogDiscussion({
  blogId,
  onCommentCountChange,
}: BlogDiscussionProps) {
  const [comments, setComments] = useState<BlogCommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Main form state
  const [authorName, setAuthorName] = useState(() => {
    try {
      return localStorage.getItem('portfolio_visitor_name') || '';
    } catch {
      return '';
    }
  });
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Inline reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const { comments: loaded } = await fetchBlogComments(blogId);
      if (active) {
        setComments(loaded);
        setLoading(false);
        onCommentCountChange?.(blogId, loaded.length);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [blogId]);

  const rememberName = (name: string) => {
    try {
      if (name.trim()) localStorage.setItem('portfolio_visitor_name', name.trim());
    } catch {
      // ignore
    }
  };

  const handleSubmitMain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const finalName = authorName.trim() || 'Guest';
    rememberName(finalName);

    try {
      setSubmitting(true);
      const { comment } = await createBlogComment({
        blog_id: blogId,
        author_name: finalName,
        content: content.trim(),
        is_admin: false,
      });
      const updated = [...comments, comment];
      setComments(updated);
      onCommentCountChange?.(blogId, updated.length);
      setContent('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const finalName = authorName.trim() || 'Guest';
    rememberName(finalName);

    try {
      setReplySubmitting(true);
      const { comment } = await createBlogComment({
        blog_id: blogId,
        parent_id: parentId,
        author_name: finalName,
        content: replyText.trim(),
        is_admin: false,
      });
      const updated = [...comments, comment];
      setComments(updated);
      onCommentCountChange?.(blogId, updated.length);
      setReplyText('');
      setReplyingToId(null);
    } finally {
      setReplySubmitting(false);
    }
  };

  // Group into top-level threads (newest first) + chronological replies
  const topLevel = comments
    .filter((c) => !c.parent_id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const repliesByParent = comments.reduce<Record<string, BlogCommentItem[]>>((acc, item) => {
    if (item.parent_id) {
      if (!acc[item.parent_id]) acc[item.parent_id] = [];
      acc[item.parent_id].push(item);
    }
    return acc;
  }, {});

  return (
    <div className="pt-7 border-t border-neutral-200/80 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-base font-bold text-neutral-950 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-neutral-700" />
          Discussion &amp; Q&amp;A
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
            {comments.length}
          </span>
        </h4>
        <span className="text-xs text-neutral-400 hidden sm:inline">
          Ask a question or leave a comment
        </span>
      </div>

      {/* Main Question / Comment Form */}
      <form
        onSubmit={handleSubmitMain}
        className="rounded-2xl bg-neutral-50 border border-neutral-200/90 p-4 space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-neutral-900 transition-colors"
          />
          <input
            type="text"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your question or comment here..."
            className="sm:col-span-2 px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-400">
            Your message appears right away and I can reply directly here.
          </span>
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      {/* Comments / Q&A Thread List */}
      {loading ? (
        <div className="py-8 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading discussion...
        </div>
      ) : topLevel.length === 0 ? (
        <div className="py-8 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <p className="text-sm font-medium text-neutral-600">
            No questions or comments yet.
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Be the first to ask a question or start a discussion on this post!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {topLevel.map((comment) => {
            const replies = repliesByParent[comment.id] || [];
            const isReplying = replyingToId === comment.id;

            return (
              <div
                key={comment.id}
                className="rounded-2xl border border-neutral-200/80 bg-white p-4 space-y-3"
              >
                {/* Parent Comment */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      comment.is_admin
                        ? 'bg-neutral-950 text-white'
                        : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {comment.author_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-sm font-semibold text-neutral-950">
                        {comment.author_name}
                      </span>
                      {comment.is_admin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-950 text-white text-[10px] font-semibold">
                          <ShieldCheck className="w-3 h-3" />
                          Author
                        </span>
                      )}
                      <span className="text-[11px] text-neutral-400">
                        {formatDateTime(comment.created_at)}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-700 mt-1.5 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setReplyingToId(isReplying ? null : comment.id);
                        setReplyText('');
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-950 transition-colors cursor-pointer"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      {isReplying ? 'Cancel reply' : 'Reply'}
                    </button>
                  </div>
                </div>

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="ml-4 sm:ml-8 pl-4 border-l-2 border-neutral-200 space-y-3 pt-1">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`rounded-xl p-3 ${
                          reply.is_admin
                            ? 'bg-neutral-950 text-white'
                            : 'bg-neutral-50 border border-neutral-200/70'
                        }`}
                      >
                        <div className="flex items-center flex-wrap gap-2">
                          <span
                            className={`text-xs font-bold ${
                              reply.is_admin ? 'text-white' : 'text-neutral-900'
                            }`}
                          >
                            {reply.author_name}
                          </span>
                          {reply.is_admin && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-neutral-950 text-[10px] font-bold">
                              <ShieldCheck className="w-3 h-3" />
                              Author
                            </span>
                          )}
                          <span className="text-[10px] text-neutral-400">
                            {formatDateTime(reply.created_at)}
                          </span>
                        </div>
                        <p
                          className={`text-xs sm:text-sm mt-1 leading-relaxed whitespace-pre-line ${
                            reply.is_admin ? 'text-neutral-200' : 'text-neutral-700'
                          }`}
                        >
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Reply Form */}
                <AnimatePresence>
                  {isReplying && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={(e) => handleSubmitReply(e, comment.id)}
                      className="overflow-hidden ml-4 sm:ml-8 pl-4 border-l-2 border-neutral-300"
                    >
                      <div className="pt-1 flex flex-col sm:flex-row gap-2">
                        {!authorName && (
                          <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Name"
                            className="sm:w-32 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:outline-none focus:border-neutral-900 focus:bg-white"
                          />
                        )}
                        <input
                          type="text"
                          required
                          autoFocus
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.author_name}...`}
                          className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:outline-none focus:border-neutral-900 focus:bg-white"
                        />
                        <button
                          type="submit"
                          disabled={replySubmitting || !replyText.trim()}
                          className="px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          {replySubmitting ? '...' : 'Reply'}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
