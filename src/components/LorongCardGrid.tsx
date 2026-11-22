'use client';

import React from 'react';
import type { LordongWithDevice } from '@/lib/helpers';
import { getWhatsAppUrl, getMapsUrl, getFullImageUrl } from '@/lib/helpers';
import { DeviceBadges } from './DeviceBadges';

interface LorongCardGridProps {
  items: LordongWithDevice[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onImageClick: (url: string, caption: string) => void;
}

export function LorongCardGrid({
  items,
  loading,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onImageClick,
}: LorongCardGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3"
          >
            <div className="skeleton h-6 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-24 w-full rounded-xl" />
            <div className="skeleton h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return null; // LorongTable already has empty state message
  }

  const startIdx = (currentPage - 1) * pageSize;

  return (
    <div className="space-y-5">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isSelesai ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />

              <div className="space-y-3.5">
                {/* Header: Number & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    #{startIdx + idx + 1}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
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
                </div>

                {/* Lorong Info */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                    {item.lorong_nama}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.lorong_alamat}
                  </p>
                </div>

                {/* Badges: Kecamatan & Kelurahan */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">
                    Kec. {item.kecamatan}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200/60">
                    Kel. {item.kelurahan}
                  </span>
                </div>

                {/* PIC & Quick Contact */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">PIC Lorong:</span>
                    <span className="font-bold text-slate-800">{item.lorong_pic || '-'}</span>
                  </div>
                  {item.lorong_pic_number && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-500 text-[11px]">
                        {item.lorong_pic_number}
                      </span>
                      <a
                        href={getWhatsAppUrl(item.lorong_pic_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-[11px] font-bold transition-all shadow-xs"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Device Badges */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Status Perangkat:
                  </div>
                  {isDeviceLoading ? (
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="skeleton h-8 rounded-md" />
                      ))}
                    </div>
                  ) : !dc ? (
                    <div className="py-2 px-3 bg-slate-50 rounded-xl text-center text-xs text-slate-400 italic">
                      Belum dicek
                    </div>
                  ) : (
                    <DeviceBadges device={dc} />
                  )}
                </div>

                {/* Keterangan Note if exists */}
                {keterangan && (
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                    <span className="font-bold">Catatan:</span> {keterangan}
                  </div>
                )}
              </div>

              {/* Card Footer: Maps + Photo Thumbnail */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                {item.lorong_latitude && item.lorong_longitude ? (
                  <a
                    href={getMapsUrl(item.lorong_latitude, item.lorong_longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.291 5.597a15.591 15.591 0 0 0 2.236 2.236l.012.008ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Lokasi Maps</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Koordinat tdk tersedia</span>
                )}

                {fotoUrl && (
                  <button
                    onClick={() => onImageClick(fotoUrl, keterangan)}
                    className="flex items-center gap-2 p-1 pl-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    <span>Bukti Foto</span>
                    <img
                      src={fotoUrl}
                      alt="Thumbnail"
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5 py-3">
          <p className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-slate-800">{startIdx + 1}</span>–
            <span className="font-bold text-slate-800">
              {Math.min(startIdx + pageSize, totalItems)}
            </span>{' '}
            dari <span className="font-bold text-slate-800">{totalItems}</span> lorong
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold">
              Hal {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
