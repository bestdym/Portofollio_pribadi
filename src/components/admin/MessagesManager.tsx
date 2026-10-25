import React, { useState } from 'react';
import { Mail, Search, Trash2, Copy, Check, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import type { ContactMessageItem } from '../../types/admin';

interface MessagesManagerProps {
  messages: ContactMessageItem[];
  isTableReady: boolean;
  onDeleteMessage: (id: string) => void;
  onRefresh: () => void;
}

export const MessagesManager: React.FC<MessagesManagerProps> = ({
  messages,
  isTableReady,
  onDeleteMessage,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- 1. Buat tabel messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan publik agar formulir kontak bisa mengirim pesan
CREATE POLICY "Allow public insert" ON public.messages
  FOR INSERT WITH CHECK (true);

-- 4. Kebijakan agar Admin dapat membaca pesan
CREATE POLICY "Allow public read" ON public.messages
  FOR SELECT USING (true);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredMessages = messages.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.message.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {!isTableReady ? (
        /* Setup Table Helper Card */
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-base font-bold text-amber-900">
                Tabel `messages` Belum Dibuat di Supabase
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                Supabase Anda saat ini belum memiliki tabel <code>messages</code> untuk menampung data dari formulir kontak. Untuk mengaktifkan fitur kotak masuk ini, silakan jalankan skrip SQL di bawah ini pada SQL Editor Supabase Anda.
              </p>

              {/* SQL Code Block */}
              <div className="relative mt-3 rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                <button
                  onClick={handleCopySql}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold shadow-xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin SQL
                    </>
                  )}
                </button>
                <pre className="pr-24">{sqlScript}</pre>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Buka Supabase SQL Editor <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={onRefresh}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-amber-100/50 text-amber-900 border border-amber-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Cek Ulang Koneksi
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari pesan berdasarkan nama, email, isi pesan..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
              />
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Total: {messages.length} pesan
            </div>
          </div>

          {/* Messages List */}
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">
                {searchTerm ? 'Tidak ada pesan yang cocok' : 'Kotak masuk masih kosong'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? 'Coba gunakan kata kunci pencarian yang lain.'
                  : 'Pesan yang dikirim pengunjung melalui formulir kontak di website Anda akan muncul di sini.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm shrink-0">
                        {msg.name ? msg.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{msg.name}</h4>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {msg.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs text-slate-400">
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : 'Baru saja'}
                      </span>
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
