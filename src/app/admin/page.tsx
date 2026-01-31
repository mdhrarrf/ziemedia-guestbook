"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Download,
  RefreshCw,
  ArrowLeft,
  LogOut,
  Users,
  Trash2,
  Pencil,
  X,
  Save,
  ExternalLink,
  Database,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 1. Definisikan Interface (KTP Data) agar tidak pakai 'any'
interface Guest {
  rowIndex: number;
  No: string;
  "Hari/Tanggal": string;
  "Nama Tamu": string;
  Jabatan: string;
  "Dinas Instansi/Perusahaan": string;
  Pembahasan: string;
  Host: string;
  "Kontak (WA/Email)": string;
  "Kritik & Saran": string;
}

export default function AdminDashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const router = useRouter();

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ambil-tamu");
      const data = await res.json();
      setGuests(Array.isArray(data) ? data.reverse() : []);
    } catch {
      console.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/admin/login");
    } else {
      fetchGuests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (rowIndex: number) => {
    if (!confirm("Hapus data tamu ini secara permanen?")) return;
    try {
      const res = await fetch("/api/kelola-tamu", {
        method: "DELETE",
        body: JSON.stringify({ rowIndex }),
      });
      if (res.ok) fetchGuests();
    } catch {
      alert("Gagal menghapus");
    }
  };

  // 2. PERBAIKAN: Gunakan tipe Guest, bukan unknown
  const handleEditOpen = (guest: Guest) => {
    setSelectedGuest({ ...guest });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return; // Lindungi jika data null

    try {
      const updatedData = [
        selectedGuest["No"],
        selectedGuest["Hari/Tanggal"],
        selectedGuest["Nama Tamu"],
        selectedGuest["Jabatan"],
        selectedGuest["Dinas Instansi/Perusahaan"],
        selectedGuest["Pembahasan"],
        selectedGuest["Host"],
        selectedGuest["Kontak (WA/Email)"],
        selectedGuest["Kritik & Saran"],
      ];

      const res = await fetch("/api/kelola-tamu", {
        method: "PATCH",
        body: JSON.stringify({ rowIndex: selectedGuest.rowIndex, updatedData }),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchGuests();
      }
    } catch {
      alert("Gagal update");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/admin/login");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(guests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Tamu");
    XLSX.writeFile(workbook, `Rekap_Tamu_ZieMedia.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-orange-100 pb-20">
      <nav className="bg-[#1E3A8A] text-white px-6 py-4 sticky top-0 z-40 shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-all"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex flex-col text-left">
              <span className="font-black tracking-tighter text-sm uppercase leading-none">
                Zie Media
              </span>
              <span className="text-[9px] font-bold text-orange-400 tracking-[0.3em] uppercase mt-1">
                Management Console
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-5 py-2.5 rounded-xl transition-all border border-red-500/20 flex items-center gap-2"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 text-left">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Panel kendali pusat data kunjungan studio.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={fetchGuests}
              className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:border-[#1E3A8A] transition-all"
            >
              <RefreshCw
                size={22}
                className={
                  loading ? "animate-spin text-blue-600" : "text-slate-400"
                }
              />
            </button>
            <button
              onClick={downloadExcel}
              className="flex-1 md:flex-none bg-[#F97316] hover:bg-orange-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-orange-200 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
            >
              <Download size={20} /> Export Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-7 rounded-4xl border-2 border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 text-[#1E3A8A] rounded-2xl flex items-center justify-center shadow-inner">
              <Users size={32} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Total Kunjungan
              </p>
              <p className="text-4xl font-black text-[#1E3A8A]">
                {guests.length}
              </p>
            </div>
          </div>
          <div className="bg-white p-7 rounded-4xl border-2 border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-orange-50 text-[#F97316] rounded-2xl flex items-center justify-center shadow-inner">
              <Calendar size={32} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Sesi Hari Ini
              </p>
              <p className="text-xl font-bold text-slate-900">
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
          <div className="bg-white p-7 rounded-4xl border-2 border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Database size={32} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Raw Database
              </p>
              <a
                href={`https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID}`}
                target="_blank"
                className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline mt-1"
              >
                Google Sheets <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto text-left">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-100">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    No
                  </th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Data Tamu
                  </th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Instansi
                  </th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Topik Podcast
                  </th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Kontak
                  </th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-20 text-center font-black text-slate-300 animate-pulse tracking-widest"
                    >
                      MEMUAT DATA...
                    </td>
                  </tr>
                ) : (
                  guests.map((guest, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-all group"
                    >
                      <td className="p-6 text-sm font-black text-slate-300 group-hover:text-orange-500 transition-colors">
                        {guest.No}
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-black text-[#1E3A8A] uppercase">
                          {guest["Nama Tamu"]}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                          {guest["Hari/Tanggal"]}
                        </p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-bold text-slate-700 leading-tight">
                          {guest["Dinas Instansi/Perusahaan"]}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                          {guest.Jabatan}
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-2xl max-w-55">
                          <p className="text-xs text-slate-600 font-semibold italic leading-relaxed">
                            &quot;{guest.Pembahasan}&quot;
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-mono font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                          {guest["Kontak (WA/Email)"]}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditOpen(guest)}
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(guest.rowIndex)}
                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL EDIT */}
      {isEditModalOpen && selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white">
            <div className="bg-[#1E3A8A] p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Pencil size={20} />
                </div>
                <h3 className="font-black text-xl tracking-tight uppercase">
                  Update Data Tamu
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="hover:rotate-90 transition-all text-white/50 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-10 space-y-6 text-left">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nama Tamu
                  </label>
                  <input
                    value={selectedGuest["Nama Tamu"]}
                    onChange={(e) =>
                      setSelectedGuest({
                        ...selectedGuest,
                        "Nama Tamu": e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Kontak
                  </label>
                  <input
                    value={selectedGuest["Kontak (WA/Email)"]}
                    onChange={(e) =>
                      setSelectedGuest({
                        ...selectedGuest,
                        "Kontak (WA/Email)": e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Instansi
                  </label>
                  <input
                    value={selectedGuest["Dinas Instansi/Perusahaan"]}
                    onChange={(e) =>
                      setSelectedGuest({
                        ...selectedGuest,
                        "Dinas Instansi/Perusahaan": e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Jabatan
                  </label>
                  <input
                    value={selectedGuest.Jabatan}
                    onChange={(e) =>
                      setSelectedGuest({
                        ...selectedGuest,
                        Jabatan: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Pembahasan Podcast
                </label>
                <textarea
                  value={selectedGuest.Pembahasan}
                  onChange={(e) =>
                    setSelectedGuest({
                      ...selectedGuest,
                      Pembahasan: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:border-orange-500 outline-none transition-all resize-none"
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#F97316] text-white font-black py-5 rounded-3xl shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"
              >
                <Save size={20} /> Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
