'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Lorong, DeviceCheck, LordongWithDevice } from '@/lib/helpers';
import { SummaryCards } from '@/components/SummaryCards';
import { FilterBar } from '@/components/FilterBar';
import { LorongTable } from '@/components/LorongTable';
import { LorongCardGrid } from '@/components/LorongCardGrid';
import { LightboxModal } from '@/components/LightboxModal';

export default function DashboardPage() {
  const router = useRouter();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [lorongList, setLorongList] = useState<LordongWithDevice[]>([]);
  const [availableSessions, setAvailableSessions] = useState<{ id: number; nama?: string; tanggal?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState('70');
  const [sessionInput, setSessionInput] = useState('70');
  const [search, setSearch] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState('');
  const [filterKelurahan, setFilterKelurahan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxCaption, setLightboxCaption] = useState<string>('');
  const pageSize = 15;

  // Fetch user info & available sessions
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => router.push('/login'));

    fetch('/api/sessions')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        if (list.length > 0) {
          setAvailableSessions(list);
        }
      })
      .catch(() => {});
  }, [router]);

  // Fetch lorong list
  const fetchLorong = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`/api/lorong?session_id=${sessionId}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const json = await res.json();
      const rawList: Lorong[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : [];

      const list: LordongWithDevice[] = rawList.map((item: Lorong) => ({
        ...item,
        deviceCheck: undefined,
        deviceLoading: false,
      }));
      setLorongList(list);
      setCurrentPage(1);
    } catch (err) {
      console.error('Fetch lorong error:', err);
      setApiError('Gagal mengambil data lorong. Silakan periksa koneksi atau Session ID.');
    } finally {
      setLoading(false);
    }
  }, [sessionId, router]);

  useEffect(() => {
    fetchLorong();
  }, [fetchLorong]);

  // Filter & search
  const filtered = useMemo(() => {
    let result = lorongList;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.lorong_nama && item.lorong_nama.toLowerCase().includes(q)) ||
          (item.lorong_alamat && item.lorong_alamat.toLowerCase().includes(q)) ||
          (item.lorong_pic && item.lorong_pic.toLowerCase().includes(q))
      );
    }
    if (filterKecamatan) {
      result = result.filter((item) => item.kecamatan === filterKecamatan);
    }
    if (filterKelurahan) {
      result = result.filter((item) => item.kelurahan === filterKelurahan);
    }
    if (filterStatus) {
      result = result.filter((item) => item.status === filterStatus);
    }
    return result;
  }, [lorongList, search, filterKecamatan, filterKelurahan, filterStatus]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  // Batch Fetch device details untuk halaman aktif saja
  useEffect(() => {
    if (paginatedItems.length === 0) return;

    // Cari lorong yang belum punya device check data dan belum loading
    const needFetch = paginatedItems.filter(
      (item) => item.deviceCheck === undefined && !item.deviceLoading
    );

    if (needFetch.length === 0) return;

    // Tandai sebagai loading
    setLorongList((prev) =>
      prev.map((item) => {
        if (needFetch.some((n) => n.lorong_id === item.lorong_id)) {
          return { ...item, deviceLoading: true };
        }
        return item;
      })
    );

    // Batch fetch device details
    const lorongIds = needFetch.map((item) => item.lorong_id).join(',');
    fetch(`/api/lorong/detail?lorong_ids=${lorongIds}`)
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data?.results) return;
        setLorongList((prev) =>
          prev.map((item) => {
            const result = data.results.find(
              (r: { lorong_id: number; data: DeviceCheck[] }) =>
                r.lorong_id === item.lorong_id
            );
            if (result) {
              const checks: DeviceCheck[] = result.data;
              let deviceCheck: DeviceCheck | null = null;
              if (checks.length > 0) {
                const matchSession = checks.find(
                  (c: DeviceCheck) => c.monitoring_session_id === parseInt(sessionId, 10)
                );
                deviceCheck = matchSession || checks[0];
              }
              return { ...item, deviceCheck, deviceLoading: false };
            }
            return item;
          })
        );
      })
      .catch((err) => {
        console.error('Device fetch error:', err);
        setLorongList((prev) =>
          prev.map((item) => {
            if (needFetch.some((n) => n.lorong_id === item.lorong_id)) {
              return { ...item, deviceCheck: null, deviceLoading: false };
            }
            return item;
          })
        );
      });
  }, [paginatedItems, sessionId, router]);

  // Dropdown options
  const kecamatanOptions = useMemo(
    () => [...new Set(lorongList.map((item) => item.kecamatan).filter(Boolean))].sort(),
    [lorongList]
  );
  const kelurahanOptions = useMemo(() => {
    let items = lorongList;
    if (filterKecamatan) items = items.filter((i) => i.kecamatan === filterKecamatan);
    return [...new Set(items.map((item) => item.kelurahan).filter(Boolean))].sort();
  }, [lorongList, filterKecamatan]);
  const statusOptions = useMemo(
    () => [...new Set(lorongList.map((item) => item.status).filter(Boolean))].sort(),
    [lorongList]
  );

  // Summary
  const summary = useMemo(
    () => ({
      total: lorongList.length,
      selesai: lorongList.filter((i) => i.status === 'Selesai').length,
      belumSelesai: lorongList.filter((i) => i.status !== 'Selesai').length,
    }),
    [lorongList]
  );

  // Handlers
  const handleRefresh = () => {
    setLorongList((prev) =>
      prev.map((item) => ({
        ...item,
        deviceCheck: undefined,
        deviceLoading: false,
      }))
    );
    fetchLorong();
  };

  const handleSessionChange = () => {
    if (sessionInput.trim() && sessionInput !== sessionId) {
      setSessionId(sessionInput.trim());
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-black/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                    CCTV Lorong
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
                  Dashboard Monitoring & Pengecekan Perangkat
                </p>
              </div>
            </div>

            {/* Right Controls: Session ID + Refresh + User */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Session Selector Capsule */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 pl-2.5 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
                  Sesi
                </span>
                {availableSessions.length > 0 ? (
                  <select
                    value={sessionId}
                    onChange={(e) => {
                      setSessionId(e.target.value);
                      setSessionInput(e.target.value);
                    }}
                    className="px-2 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {availableSessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        Sesi {s.id} {s.nama ? `- ${s.nama}` : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input
                      type="number"
                      value={sessionInput}
                      onChange={(e) => setSessionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSessionChange();
                      }}
                      className="w-14 sm:w-16 px-2 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      min="1"
                    />
                    <button
                      onClick={handleSessionChange}
                      className="px-2.5 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                      title="Ganti Session"
                    >
                      Set
                    </button>
                  </>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-40 cursor-pointer border border-transparent hover:border-blue-100"
                title="Muat Ulang Data"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-5 h-5 ${loading ? 'animate-spin text-blue-600' : ''}`}
                >
                  <path
                    fillRule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.598a.75.75 0 0 0-.75.75v3.634a.75.75 0 0 0 1.5 0v-2.033l.312.311a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.389Zm-11.23-3.15a.75.75 0 0 0 1.449.388 5.5 5.5 0 0 1 9.201-2.466l.312.311H12.61a.75.75 0 0 0 0 1.5h3.634a.75.75 0 0 0 .75-.75V3.623a.75.75 0 0 0-1.5 0v2.033l-.311-.311A7 7 0 0 0 3.693 8.463.75.75 0 0 0 4.082 8.274Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  {user?.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.nama || 'Pengguna'}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 capitalize">
                    {user?.role?.replace('_', ' ') || 'Petugas'}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Keluar / Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Alert */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
            <span>{apiError}</span>
            <button
              onClick={handleRefresh}
              className="underline hover:text-rose-900 cursor-pointer"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* 1. Summary Cards */}
        <SummaryCards
          total={summary.total}
          selesai={summary.selesai}
          belumSelesai={summary.belumSelesai}
          loading={loading}
        />

        {/* 2. Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          filterKecamatan={filterKecamatan}
          onKecamatanChange={(v) => {
            setFilterKecamatan(v);
            setFilterKelurahan('');
            setCurrentPage(1);
          }}
          filterKelurahan={filterKelurahan}
          onKelurahanChange={(v) => {
            setFilterKelurahan(v);
            setCurrentPage(1);
          }}
          filterStatus={filterStatus}
          onStatusChange={(v) => {
            setFilterStatus(v);
            setCurrentPage(1);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          kecamatanOptions={kecamatanOptions}
          kelurahanOptions={kelurahanOptions}
          statusOptions={statusOptions}
          totalFiltered={filtered.length}
        />

        {/* 3. Data View: Table or Cards */}
        {viewMode === 'table' ? (
          <LorongTable
            items={paginatedItems}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onImageClick={(url, caption) => {
              setLightboxImage(url);
              setLightboxCaption(caption);
            }}
          />
        ) : (
          <LorongCardGrid
            items={paginatedItems}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onImageClick={(url, caption) => {
              setLightboxImage(url);
              setLightboxCaption(caption);
            }}
          />
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <LightboxModal
          imageUrl={lightboxImage}
          caption={lightboxCaption}
          onClose={() => {
            setLightboxImage(null);
            setLightboxCaption('');
          }}
        />
      )}
    </div>
  );
}
