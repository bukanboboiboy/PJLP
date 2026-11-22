import { API_BASE_URL } from './api-config';

/**
 * Format nomor telepon Indonesia ke format WhatsApp (62...)
 * Mengubah awalan 08... menjadi 628..., membersihkan spasi dan tanda strip
 */
export function formatPhoneToWA(phone: string): string {
  let cleaned = phone.replace(/[\s\-\.\(\)]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

/**
 * Generate WhatsApp URL dari nomor telepon
 */
export function getWhatsAppUrl(phone: string): string {
  return `https://wa.me/${formatPhoneToWA(phone)}`;
}

/**
 * Generate Google Maps URL dari latitude dan longitude
 */
export function getMapsUrl(lat: string, lng: string): string {
  return `https://google.com/maps?q=${lat},${lng}`;
}

/**
 * Generate full image URL dari path
 */
export function getFullImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}

/**
 * Tipe data dari API
 */
export interface User {
  id: number;
  nama: string;
  no_hp: string;
  role: string;
  numberid: string;
}

export interface Lorong {
  id: number;
  tanggal: string;
  status: string;
  monitoring_session_id: number;
  pic_mon: string;
  pic_number_mon: string;
  cctv_record: string | null;
  lorong_id: number;
  lorong_nama: string;
  lorong_alamat: string;
  lorong_latitude: string;
  lorong_longitude: string;
  lorong_pic: string;
  lorong_pic_number: string;
  satgas_nama: string;
  satgas_phone: string;
  kecamatan: string;
  kelurahan: string;
}

export interface DeviceCheck {
  id: number;
  lorong_id: number;
  monitoring_id: number;
  monitoring_session_id: number;
  tanggal: string;
  foto_tampilan: string | null;
  keterangan: string;
  pemindahan_perangkat: string;
  cctv1: string;
  cctv2: string;
  cctv3: string;
  cctv4: string;
  nvr: string;
  switch: string;
  modem: string;
  creator_nama: string;
}

export interface LordongWithDevice extends Lorong {
  deviceCheck?: DeviceCheck | null;
  deviceLoading?: boolean;
}
