'use client';

import React, { useEffect, useCallback } from 'react';

interface LightboxModalProps {
  imageUrl: string;
  caption: string;
  onClose: () => void;
}

export function LightboxModal({ imageUrl, caption, onClose }: LightboxModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div
      className="lightbox-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="lightbox-content relative max-w-4xl max-h-[92vh] w-full flex flex-col bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h4 className="font-bold text-sm tracking-tight">Foto Bukti Pengecekan CCTV</h4>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Buka Gambar Asli di Tab Baru"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h4a.75.75 0 0 1 0 1.5h-4Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup (Esc)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image body */}
        <div className="relative flex-1 overflow-auto bg-black flex items-center justify-center p-2 min-h-[300px] max-h-[72vh]">
          <img
            src={imageUrl}
            alt="Foto bukti ukuran penuh"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>

        {/* Caption footer */}
        {caption ? (
          <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-white uppercase tracking-wider block text-[10px] text-blue-400 mb-1">
              Keterangan Petugas
            </span>
            <p className="leading-relaxed">{caption}</p>
          </div>
        ) : (
          <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-500 italic">
            Tidak ada keterangan catatan tambahan untuk foto ini.
          </div>
        )}
      </div>
    </div>
  );
}
