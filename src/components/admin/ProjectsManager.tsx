import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  LayoutGrid, 
  Table as TableIcon, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import type { ProjectItem } from '../../types/admin';

interface ProjectsManagerProps {
  projects: ProjectItem[];
  onOpenAddModal: () => void;
  onOpenEditModal: (project: ProjectItem) => void;
  onDeleteProject: (id: string, title: string) => void;
  onToggleFeatured: (project: ProjectItem) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteProject,
  onToggleFeatured,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'featured' | 'standard'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter projects based on search and featured filter
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = 
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proj.description && proj.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proj.tags && proj.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!matchesSearch) return false;

    if (filterType === 'featured') return proj.featured;
    if (filterType === 'standard') return !proj.featured;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan judul, tag, atau deskripsi..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 hover:bg-white transition-colors"
          />
        </div>

        {/* Filters & View Switchers */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filters */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60 text-xs font-medium">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({projects.length})
            </button>
            <button
              onClick={() => setFilterType('featured')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                filterType === 'featured'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              Featured
            </button>
            <button
              onClick={() => setFilterType('standard')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === 'standard'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reguler
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Grid Card"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {/* New Project Button */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Proyek</span>
          </button>
        </div>
      </div>

      {/* Projects List View */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {searchTerm ? 'Tidak ada proyek yang sesuai' : 'Belum ada proyek portofolio'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm 
              ? `Tidak ditemukan proyek dengan kata kunci "${searchTerm}". Silakan periksa kembali filter Anda.`
              : 'Tambahkan karya proyek pertama Anda untuk mulai memamerkan hasil karya ke dunia.'}
          </p>
          {!searchTerm && (
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tambah Proyek Sekarang
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Card Image Header */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-100">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-tr from-slate-100 to-slate-200">
                    <Layers className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-[11px] font-mono">No Thumbnail</span>
                  </div>
                )}

                {/* Featured Badge Toggle */}
                <button
                  onClick={() => onToggleFeatured(project)}
                  className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
                    project.featured
                      ? 'bg-amber-400 text-amber-900 shadow-amber-400/40 hover:scale-110'
                      : 'bg-white/80 text-slate-400 hover:text-amber-500 hover:bg-white'
                  }`}
                  title={project.featured ? 'Featured Project (Klik untuk lepas)' : 'Klik untuk jadikan Featured'}
                >
                  <Star className={`w-4 h-4 ${project.featured ? 'fill-amber-900' : ''}`} />
                </button>

                {/* Weight badge */}
                {project.weight !== undefined && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/60 backdrop-blur-xs text-white text-[10px] font-mono flex items-center gap-1">
                    <ArrowUpDown className="w-2.5 h-2.5" />
                    <span>w:{project.weight}</span>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                      {project.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    /{project.slug}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {project.description || 'Belum ada deskripsi yang ditambahkan untuk proyek ini.'}
                  </p>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Buka Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Buka GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenEditModal(project)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteProject(project.id, project.title)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Proyek"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Proyek</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-center">Urutan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {project.thumbnail_url ? (
                            <img
                              src={project.thumbnail_url}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Layers className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate max-w-[200px]">
                            {project.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-[240px]">
                            {project.description || '-'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                      {project.slug}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {project.tags?.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleFeatured(project)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          project.featured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-300 hover:text-amber-500'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${project.featured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-600">
                      {project.weight}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenEditModal(project)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(project.id, project.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
