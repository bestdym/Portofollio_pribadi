import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME || 'admin').trim();
const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || 'admin123').trim();

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }

    setIsChecking(true);

    setTimeout(() => {
      if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        try {
          sessionStorage.setItem('portfolio_admin_auth', 'authenticated');
        } catch {
          // Ignore storage restrictions
        }
        onLoginSuccess();
      } else {
        setError('Username atau password salah.');
        setIsChecking(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-7 sm:p-9 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white mx-auto flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 pt-1">
              Admin Studio
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Masuk dengan username dan password untuk mengelola portofolio
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-username"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider"
              >
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 focus:border-neutral-900 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/15 focus:border-neutral-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className="w-full py-3.5 mt-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isChecking ? 'Memverifikasi...' : 'Masuk ke Admin'}
            </button>
          </form>
        </div>

        {/* Back to Portfolio */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke halaman portofolio
          </a>
        </div>
      </div>
    </div>
  );
};
