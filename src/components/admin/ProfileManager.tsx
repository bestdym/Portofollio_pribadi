import React, { useState, useEffect } from 'react';
import { User, Image, Link as LinkIcon, Sparkles, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from './SocialIcons';
import type { ProfileItem } from '../../types/admin';

interface ProfileManagerProps {
  profile: ProfileItem | null;
  onSaveProfile: (profileData: Partial<ProfileItem>) => Promise<void>;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setTitle(profile.title || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
      setGithub(profile.social_links?.github || '');
      setLinkedin(profile.social_links?.linkedin || '');
      setTwitter(profile.social_links?.twitter || '');
      setInstagram(profile.social_links?.instagram || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSaveProfile({
        name: name.trim(),
        title: title.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl.trim() || null,
        social_links: {
          github: github.trim() || undefined,
          linkedin: linkedin.trim() || undefined,
          twitter: twitter.trim() || undefined,
          instagram: instagram.trim() || undefined,
        },
      });
    } catch (err: any) {
      console.error(err);
      alert('Gagal memperbarui profil: ' + (err.message || 'Error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Profile Card Preview Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group shrink-0">
            <img
              src={avatarUrl || 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex'}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-2xl bg-white border-2 border-white shadow-md object-cover"
              onError={(e) => {
                (e.target as HTMLElement).setAttribute(
                  'src',
                  'https://api.dicebear.com/7.x/notionists/svg?seed=Alex'
                );
              }}
            />
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900">
              {name || 'Nama Anda'}
            </h3>
            <p className="text-sm text-blue-600 font-medium">
              {title || 'Jabatan / Spesialisasi'}
            </p>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {bio || 'Biografi singkat portofolio Anda...'}
            </p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Alex Pratama"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              Gelar / Bidang Keahlian
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Senior Frontend Engineer"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-slate-500" />
            URL Foto Avatar
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://api.dicebear.com/7.x/notionists/svg?seed=Alex atau URL gambar langsung"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Biografi Ringkas (Hero & Tentang Saya)
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tuliskan perkenalan singkat tentang pengalaman Anda, passion di bidang teknologi, dan fokus proyek Anda saat ini..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white resize-y"
          />
        </div>

        {/* Social Links Section */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-blue-600" />
            Tautan Media Sosial & Jejaring
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-slate-700" /> GitHub URL
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-700" /> LinkedIn URL
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <TwitterIcon className="w-3.5 h-3.5 text-sky-500" /> Twitter / X URL
              </label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/username"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600" /> Instagram URL
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/username"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? (
              'Menyimpan...'
            ) : (
              <>
                <Check className="w-4 h-4" />
                Simpan Pembaruan Profil
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
