'use client';

import React from 'react';

interface SummaryCardsProps {
  total: number;
  selesai: number;
  belumSelesai: number;
  loading: boolean;
}

export function SummaryCards({ total, selesai, belumSelesai, loading }: SummaryCardsProps) {
  const percentSelesai = total > 0 ? Math.round((selesai / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Lorong Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Lorong
            </p>
            {loading ? (
              <div className="skeleton h-9 w-20 mt-2" />
            ) : (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {total.toLocaleString('id-ID')}
                </span>
                <span className="text-xs font-medium text-slate-400">Titik Pantau</span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center ring-1 ring-blue-500/10 group-hover:scale-105 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0-.512 1.41l16.518 6.007a.75.75 0 0 0 .512-1.41L15 13.062V17a.75.75 0 0 0 .75.75h1.5A.75.75 0 0 0 18 17v-4.93l1.006-.365Z" />
              <path d="M4.5 10.153v7.347a.75.75 0 0 0 .75.75H12a.75.75 0 0 0 .75-.75v-4.618l-8.25-3.002Z" />
            </svg>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          <span>Terdaftar dalam monitoring session aktif</span>
        </div>
      </div>

      {/* Selesai Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status Selesai
            </p>
            {loading ? (
              <div className="skeleton h-9 w-20 mt-2" />
            ) : (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  {selesai.toLocaleString('id-ID')}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  {percentSelesai}%
                </span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center ring-1 ring-emerald-500/10 group-hover:scale-105 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${percentSelesai}%` }}
            />
          </div>
        </div>
      </div>

      {/* Belum Selesai Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Belum Selesai
            </p>
            {loading ? (
              <div className="skeleton h-9 w-20 mt-2" />
            ) : (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-amber-600 tracking-tight">
                  {belumSelesai.toLocaleString('id-ID')}
                </span>
                <span className="text-xs font-medium text-slate-400">Menunggu Tindakan</span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center ring-1 ring-amber-500/10 group-hover:scale-105 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Lorong yang masih dalam proses pemantauan</span>
        </div>
      </div>
    </div>
  );
}
