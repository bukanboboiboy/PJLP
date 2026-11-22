'use client';

import React from 'react';

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filterKecamatan: string;
  onKecamatanChange: (v: string) => void;
  filterKelurahan: string;
  onKelurahanChange: (v: string) => void;
  filterStatus: string;
  onStatusChange: (v: string) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (v: 'table' | 'cards') => void;
  kecamatanOptions: string[];
  kelurahanOptions: string[];
  statusOptions: string[];
  totalFiltered: number;
}

export function FilterBar({
  search,
  onSearchChange,
  filterKecamatan,
  onKecamatanChange,
  filterKelurahan,
  onKelurahanChange,
  filterStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  kecamatanOptions,
  kelurahanOptions,
  statusOptions,
  totalFiltered,
}: FilterBarProps) {
  const hasFilters = Boolean(search || filterKecamatan || filterKelurahan || filterStatus);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3.5">
      {/* Top row: Search bar + View Toggle */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari nama lorong, alamat, atau nama PIC..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:bg-white transition-all shadow-inner"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end md:self-auto border border-slate-200/80">
          <button
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            <span>Tabel</span>
          </button>
          <button
            onClick={() => onViewModeChange('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z"
                clipRule="evenodd"
              />
            </svg>
            <span>Kartu</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Dropdowns & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap gap-2 items-center flex-1">
          {/* Kecamatan Dropdown */}
          <div className="relative min-w-[160px]">
            <select
              value={filterKecamatan}
              onChange={(e) => onKecamatanChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:bg-white cursor-pointer hover:border-slate-300"
            >
              <option value="">Semua Kecamatan</option>
              {kecamatanOptions.map((k) => (
                <option key={k} value={k}>
                  Kec. {k}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Kelurahan Dropdown */}
          <div className="relative min-w-[160px]">
            <select
              value={filterKelurahan}
              onChange={(e) => onKelurahanChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:bg-white cursor-pointer hover:border-slate-300"
            >
              <option value="">Semua Kelurahan</option>
              {kelurahanOptions.map((k) => (
                <option key={k} value={k}>
                  Kel. {k}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="relative min-w-[140px]">
            <select
              value={filterStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:bg-white cursor-pointer hover:border-slate-300"
            >
              <option value="">Semua Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Reset button */}
          {hasFilters && (
            <button
              onClick={() => {
                onSearchChange('');
                onKecamatanChange('');
                onKelurahanChange('');
                onStatusChange('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 1 .75.75v7a.75.75 0 0 1-1.5 0v-7a.75.75 0 0 1 .75-.75Zm3.58.75a.75.75 0 0 0-1.5 0v7a.75.75 0 0 0 1.5 0v-7Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="text-xs text-slate-500 font-medium">
          Ditemukan: <span className="font-bold text-slate-800">{totalFiltered}</span> lorong
        </div>
      </div>
    </div>
  );
}
