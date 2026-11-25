import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Database,
  BookOpen,
  CheckCircle2,
  Clock,
  Search,
} from 'lucide-react';
import type { BlogCommentItem, BlogPostItem } from '../../types/admin';

interface BlogCommentsManagerProps {
  comments: BlogCommentItem[];
  blogs: BlogPostItem[];
  isTableReady: boolean;
  onReplyComment: (blogId: string, parentId: string, replyContent: string) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
  onNavigateToDatabase: () => void;
}

export const BlogCommentsManager: React.FC<BlogCommentsManagerProps> = ({
  comments,
  blogs,
  isTableReady,
  onReplyComment,
  onDeleteComment,
  onNavigateToDatabase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unanswered' | 'answered'>('all');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);

  const blogTitleMap = blogs.reduce<Record<string, string>>((acc, b) => {
    acc[b.id] = b.title;
    return acc;
  }, {});

  // Group replies by parent_id
  const repliesByParent = comments.reduce<Record<string, BlogCommentItem[]>>((acc, item) => {
    if (item.parent_id) {
      if (!acc[item.parent_id]) acc[item.parent_id] = [];
      acc[item.parent_id].push(item);
    }
    return acc;
  }, {});

  const topLevelThreads = comments
    .filter((c) => !c.parent_id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredThreads = topLevelThreads.filter((thread) => {
    const replies = repliesByParent[thread.id] || [];
    const hasAdminReply = replies.some((r) => r.is_admin);

    if (filterMode === 'unanswered' && hasAdminReply) return false;
    if (filterMode === 'answered' && !hasAdminReply) return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const blogTitle = (blogTitleMap[thread.blog_id] || '').toLowerCase();
    return (
      thread.author_name.toLowerCase().includes(q) ||
      thread.content.toLowerCase().includes(q) ||
      blogTitle.includes(q)
    );
  });

  const unansweredCount = topLevelThreads.filter(
    (t) => !(repliesByParent[t.id] || []).some((r) => r.is_admin)
  ).length;

  const handleSendReply = async (e: React.FormEvent, thread: BlogCommentItem) => {
    e.preventDefault();
    const text = (replyDrafts[thread.id] || '').trim();
    if (!text) return;

    try {
      setSendingId(thread.id);
      await onReplyComment(thread.blog_id, thread.id, text);
      setReplyDrafts((prev) => ({ ...prev, [thread.id]: '' }));
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {!isTableReady && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Tabel `blog_comments` belum dibuat di Supabase
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Jalankan skrip SQL di menu Database & SQL agar pertanyaan pengunjung tersimpan di Supabase dan bisa kamu balas langsung dari sini.
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

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pengirim, pertanyaan, atau judul blog..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 hover:bg-white transition-colors"
          />
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-medium">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({topLevelThreads.length})
          </button>
          <button
            onClick={() => setFilterMode('unanswered')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMode === 'unanswered'
                ? 'bg-white text-amber-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Belum Dibalas ({unansweredCount})
          </button>
          <button
            onClick={() => setFilterMode('answered')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMode === 'answered'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sudah Dibalas
          </button>
        </div>
      </div>

      {/* Threads List */}
      {filteredThreads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {searchTerm ? 'Diskusi tidak ditemukan' : 'Belum ada pertanyaan atau komentar'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Saat pengunjung bertanya atau berkomentar di tulisan blog kamu, semuanya akan muncul di sini untuk dibalas langsung.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredThreads.map((thread) => {
            const replies = (repliesByParent[thread.id] || []).sort(
              (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            const hasAdminReply = replies.some((r) => r.is_admin);
            const blogTitle = blogTitleMap[thread.blog_id] || 'Tulisan Blog';

            return (
              <div
                key={thread.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4"
              >
                {/* Thread Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      {blogTitle}
                    </span>
                    {hasAdminReply ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Sudah Dibalas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> Menunggu Balasan
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteComment(thread.id)}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors self-end sm:self-auto"
                    title="Hapus pertanyaan ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>

                {/* Visitor Question */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                    {thread.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-sm">
                        {thread.author_name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(thread.created_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed whitespace-pre-line">
                      {thread.content}
                    </p>
                  </div>
                </div>

                {/* Existing Replies */}
                {replies.length > 0 && (
                  <div className="ml-4 sm:ml-10 pl-4 border-l-2 border-slate-200 space-y-2.5">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-3 rounded-xl flex items-start justify-between gap-3 ${
                          reply.is_admin
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-50 border border-slate-200/80'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs font-bold ${
                                reply.is_admin ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {reply.author_name}
                            </span>
                            {reply.is_admin && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-slate-900 text-[10px] font-bold">
                                <ShieldCheck className="w-3 h-3" /> Penulis
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              {new Date(reply.created_at).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p
                            className={`text-xs sm:text-sm mt-1 leading-relaxed whitespace-pre-line ${
                              reply.is_admin ? 'text-slate-200' : 'text-slate-700'
                            }`}
                          >
                            {reply.content}
                          </p>
                        </div>
                        <button
                          onClick={() => onDeleteComment(reply.id)}
                          className={`p-1 rounded-lg transition-colors shrink-0 ${
                            reply.is_admin
                              ? 'text-slate-400 hover:text-red-400'
                              : 'text-slate-400 hover:text-red-600'
                          }`}
                          title="Hapus balasan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Admin Reply Form */}
                <form
                  onSubmit={(e) => handleSendReply(e, thread)}
                  className="ml-0 sm:ml-10 pt-2 flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    value={replyDrafts[thread.id] || ''}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({ ...prev, [thread.id]: e.target.value }))
                    }
                    placeholder={`Balas ${thread.author_name} sebagai Penulis...`}
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingId === thread.id || !(replyDrafts[thread.id] || '').trim()}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sendingId === thread.id ? 'Mengirim...' : 'Balas sebagai Penulis'}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
