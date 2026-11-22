'use client';

import React from 'react';
import type { DeviceCheck } from '@/lib/helpers';

interface DeviceBadgesProps {
  device: DeviceCheck;
  compact?: boolean;
}

type BadgeStatus = 'good' | 'bad' | 'unknown';

function getStatus(value: string | undefined): BadgeStatus {
  if (!value) return 'unknown';
  const v = value.toLowerCase().trim();
  if (v === 'baik' || v === 'tidak' || v === 'normal' || v === 'aktif') return 'good';
  if (v === 'belum dicek' || v === '-' || v === '') return 'unknown';
  return 'bad';
}

interface DeviceItem {
  key: string;
  shortLabel: string;
  fullLabel: string;
  value: string;
}

export function DeviceBadges({ device, compact = true }: DeviceBadgesProps) {
  const devices: DeviceItem[] = [
    { key: 'cctv1', shortLabel: 'CAM 1', fullLabel: 'CCTV 1', value: device.cctv1 || '-' },
    { key: 'cctv2', shortLabel: 'CAM 2', fullLabel: 'CCTV 2', value: device.cctv2 || '-' },
    { key: 'cctv3', shortLabel: 'CAM 3', fullLabel: 'CCTV 3', value: device.cctv3 || '-' },
    { key: 'cctv4', shortLabel: 'CAM 4', fullLabel: 'CCTV 4', value: device.cctv4 || '-' },
    { key: 'nvr', shortLabel: 'NVR', fullLabel: 'NVR', value: device.nvr || '-' },
    { key: 'switch', shortLabel: 'SW', fullLabel: 'Switch', value: device.switch || '-' },
    { key: 'modem', shortLabel: 'MDM', fullLabel: 'Modem', value: device.modem || '-' },
    { key: 'pindah', shortLabel: 'PNDH', fullLabel: 'Pemindahan', value: device.pemindahan_perangkat || '-' },
  ];

  const goodCount = devices.filter(d => getStatus(d.value) === 'good').length;
  const badCount = devices.filter(d => getStatus(d.value) === 'bad').length;

  return (
    <div className="space-y-1.5">
      {/* 2x4 Grid of compact device pills */}
      <div className="grid grid-cols-4 gap-1 w-full max-w-[280px]">
        {devices.map((item) => {
          const status = getStatus(item.value);
          const isGood = status === 'good';
          const isBad = status === 'bad';

          return (
            <div
              key={item.key}
              title={`${item.fullLabel}: ${item.value}`}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-md text-[10px] font-semibold tracking-tight transition-all border ${
                isGood
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-xs'
                  : isBad
                  ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs animate-pulse'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span className="text-[9px] font-bold text-slate-400 leading-none">
                {item.shortLabel}
              </span>
              <span className="truncate max-w-[55px] font-medium leading-tight mt-0.5">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary line */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {goodCount}/8 Normal
        </span>
        {badCount > 0 && (
          <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            {badCount} Bermasalah
          </span>
        )}
      </div>
    </div>
  );
}
