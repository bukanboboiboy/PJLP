'use client';

import React from 'react';
import type { LordongWithDevice } from '@/lib/helpers';
import { getWhatsAppUrl, getMapsUrl, getFullImageUrl } from '@/lib/helpers';
import { DeviceBadges } from './DeviceBadges';

interface LorongTableProps {
  items: LordongWithDevice[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onImageClick: (url: string, caption: string) => void;
}

export function LorongTable({
  items,
  loading,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onImageClick,
}: LorongTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center">
        <div className="inline-flex flex-col items-center gap-3 text-slate-500">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-semibold text-slate-700">
            Mengambil data lorong & sesi monitoring...
          </span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-800">Tidak ada data ditemukan</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Coba periksa kata kunci pencarian, ubah filter kecamatan/kelurahan, atau periksa nomor Session ID.
        </p>
      </div>
    );
  }

  const startIdx = (currentPage - 1) * pageSize;

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-3 text-center w-12">#</th>
                <th className="py-3.5 px-4 min-w-[240px]">Lorong & Alamat</th>
                <th className="py-3.5 px-4 min-w-[150px]">Wilayah</th>
                <th className="py-3.5 px-4 min-w-[170px]">PIC & Kontak</th>
                <th className="py-3.5 px-4 text-center min-w-[110px]">Status</th>
                <th className="py-3.5 px-4 min-w-[300px]">Kondisi Perangkat</th>
                <th className="py-3.5 px-4 text-center w-24">Foto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {items.map((item, idx) => {
                const dc = item.deviceCheck;
                const isDeviceLoading = item.deviceLoading || item.deviceCheck === undefined;
                const fotoUrl = dc?.foto_tampilan
                  ? getFullImageUrl(dc.foto_tampilan)
                  : item.cctv_record
                  ? getFullImageUrl(item.cctv_record)
                  : null;
                const keterangan = dc?.keterangan || '';
                const isSelesai = item.status === 'Selesai';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-4 px-3 text-center font-mono text-xs font-semibold text-slate-400">
                      {startIdx + idx + 1}
                    </td>

                    {/* Lorong & Alamat */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                          {item.lorong_nama}
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                          {item.lorong_alamat}
                        </p>
                        {/* Maps action pill */}
                        {item.lorong_latitude && item.lorong_longitude && (
                          <div className="pt-1">
                            <a
                              href={getMapsUrl(item.lorong_latitude, item.lorong_longitude)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-semibold transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-3.5 h-3.5 text-blue-600"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.291 5.597a15.591 15.591 0 0 0 2.236 2.236l.012.008ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Google Maps</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Wilayah */}
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800">
                          {item.kecamatan}
                        </span>
                        <p className="text-slate-500 text-xs">Kel. {item.kelurahan}</p>
                      </div>
                    </td>

                    {/* PIC & Kontak */}
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-1.5">
                        <div className="font-semibold text-slate-800 text-xs">
                          {item.lorong_pic || '-'}
                        </div>
                        {item.lorong_pic_number && (
                          <div className="space-y-1">
                            <span className="text-[11px] font-mono text-slate-500 block">
                              {item.lorong_pic_number}
                            </span>
                            <a
                              href={getWhatsAppUrl(item.lorong_pic_number)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all hover:scale-102"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3 h-3"
                              >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center align-top">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-tight ${
                          isSelesai
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300'
                            : 'bg-amber-50 text-amber-700 ring-1 ring-amber-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelesai ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>

                    {/* Perangkat */}
                    <td className="py-4 px-4 align-top">
                      {isDeviceLoading ? (
                        <div className="grid grid-cols-4 gap-1 w-full max-w-[280px]">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="skeleton h-8 rounded-md" />
                          ))}
                        </div>
                      ) : !dc ? (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center max-w-[220px]">
                          <span className="text-xs text-slate-400 italic">Belum dicek</span>
                        </div>
                      ) : (
                        <DeviceBadges device={dc} />
                      )}
                    </td>

                    {/* Foto */}
                    <td className="py-4 px-4 text-center align-top">
                      {fotoUrl ? (
                        <button
                          onClick={() => onImageClick(fotoUrl, keterangan)}
                          className="group/img relative inline-block w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer hover:scale-105"
                          title="Klik untuk melihat foto bukti"
                        >
                          <img
                            src={fotoUrl}
                            alt="Bukti"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-5 h-5 text-white"
                            >
                              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                              <path
                                fillRule="evenodd"
                                d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </button>
                      ) : (
                        <div className="w-14 h-14 mx-auto rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 0 0 2.25-2.25V5.25a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                            />
                          </svg>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5 py-3">
          <p className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-slate-800">{startIdx + 1}</span>–
            <span className="font-bold text-slate-800">
              {Math.min(startIdx + pageSize, totalItems)}
            </span>{' '}
            dari <span className="font-bold text-slate-800">{totalItems}</span> total lorong
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Halaman Pertama"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M15.79 14.77a.75.75 0 0 1-1.06.02l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 1 1 1.04 1.08L11.832 10l3.938 3.71a.75.75 0 0 1 .02 1.06Zm-6 0a.75.75 0 0 1-1.06.02l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 1 1 1.04 1.08L5.832 10l3.938 3.71a.75.75 0 0 1 .02 1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Halaman Sebelumnya"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Numbers */}
            <div className="flex items-center gap-1 px-1">
              {generatePageNumbers(currentPage, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`dot-${i}`} className="px-2 text-slate-400 text-xs">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange(p as number)}
                    className={`min-w-[34px] h-[34px] rounded-xl text-xs font-bold transition-all ${
                      currentPage === p
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Halaman Selanjutnya"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Halaman Terakhir"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M4.21 4.77a.75.75 0 0 1 1.06-.02l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 1 1-1.04-1.08L8.168 10 4.23 6.29a.75.75 0 0 1-.02-1.06Zm6 0a.75.75 0 0 1 1.06-.02l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 1 1-1.04-1.08L14.168 10l-3.938-3.71a.75.75 0 0 1-.02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function generatePageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];
  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('...');
  pages.push(total);

  return pages;
}
