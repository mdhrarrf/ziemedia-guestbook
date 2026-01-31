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

// Interface harus lengkap sesuai kolom Google Sheets
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

// Daftar Host yang sama dengan di halaman depan
const LIST_HOST = [
  "Muhammad Alvi Irpansyah, M.AB",
  "Bilqisty Jazila Rizki",
  "Gita Nur Fatonah Pertiwi",
  "Lainnya",
];

export default function AdminDashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [] = useState(""); // Untuk memantau pilihan di dropdown
  const [] = useState(""); // Untuk menyimpan ketikan manual
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
  }, [router]);

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

  const handleEditOpen = (guest: Guest) => {
    setSelectedGuest({ ...guest });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;

    try {
      const updatedData = [
        selectedGuest.No,
        selectedGuest["Hari/Tanggal"],
        selectedGuest["Nama Tamu"],
        selectedGuest.Jabatan,
        selectedGuest["Dinas Instansi/Perusahaan"],
        selectedGuest.Pembahasan,
        selectedGuest.Host,
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
    XLSX.writeFile(workbook, `Data_Lengkap_Tamu_ZieMedia.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 text-left">
      <nav className="bg-[#1E3A8A] text-white px-6 py-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-400 mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-white/10 p-2 rounded-lg hover:bg-white/20"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex flex-col">
              <span className="font-black text-sm uppercase">
                Zie Media Console
              </span>
              <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">
                Administrator
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-xl flex items-center gap-2"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </nav>

      <main className="max-w-400 mx-auto p-6">
        {/* HEADER AREA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Database Management
            </h1>
            <p className="text-slate-500 font-medium">
              Rekapitulasi lengkap seluruh kunjungan studio Zie Media.
            </p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={fetchGuests}
              className="p-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-600 transition-all shadow-sm"
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
              className="flex-1 lg:flex-none bg-[#F97316] hover:bg-orange-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase text-xs tracking-widest transition-all"
            >
              <Download size={20} /> Export Full Data (.xlsx)
            </button>
          </div>
        </div>

        {/* STATS AREA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-50 text-[#1E3A8A] rounded-2xl flex items-center justify-center shadow-inner">
              <Users size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Total Tamu
              </p>
              <p className="text-3xl font-black text-[#1E3A8A]">
                {guests.length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Database size={28} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Live Database
              </p>
              <a
                href={`https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID}`}
                target="_blank"
                className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline"
              >
                Google Sheets <ExternalLink size={12} />
              </a>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-orange-50 text-[#F97316] rounded-2xl flex items-center justify-center shadow-inner">
              <Calendar size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Last Update
              </p>
              <p className="text-sm font-bold text-slate-800">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* FULL DATA TABLE */}
        <div className="bg-white rounded-4xl border-2 border-slate-100 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-300">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-100">
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    No
                  </th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Identitas Tamu
                  </th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Instansi & Jabatan
                  </th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Topik Podcast
                  </th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Host Pemandu
                  </th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Kontak
                  </th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-20 text-center font-black text-slate-300 animate-pulse tracking-widest"
                    >
                      SYNCHRONIZING DATA...
                    </td>
                  </tr>
                ) : (
                  guests.map((guest, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-all group"
                    >
                      <td className="p-5 text-sm font-black text-slate-300 group-hover:text-orange-500">
                        {guest.No}
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-black text-[#1E3A8A] uppercase">
                          {guest["Nama Tamu"]}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">
                          {guest["Hari/Tanggal"]}
                        </p>
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-bold text-slate-700">
                          {guest["Dinas Instansi/Perusahaan"]}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {guest.Jabatan}
                        </p>
                      </td>
                      <td className="p-5">
                        <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-xl max-w-62.5">
                          <p className="text-xs text-slate-600 font-semibold italic leading-relaxed">
                            &quot;{guest.Pembahasan}&quot;
                          </p>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 uppercase">
                          {guest.Host}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="text-xs font-mono font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                          {guest["Kontak (WA/Email)"]}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditOpen(guest)}
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(guest.rowIndex)}
                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={15} />
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

      {/* --- MODAL EDIT LENGKAP --- */}
      {isEditModalOpen && selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white">
            <div className="bg-[#1E3A8A] p-7 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Save size={20} />
                </div>
                <h3 className="font-black text-xl tracking-tight uppercase">
                  Update Record Tamu
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/50 hover:text-white transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-10 space-y-5 text-left overflow-y-auto max-h-[80vh]"
            >
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nama Lengkap
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
                <div className="space-y-1.5">
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

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Pembahasan Podcast
                </label>
                <input
                  value={selectedGuest.Pembahasan}
                  onChange={(e) =>
                    setSelectedGuest({
                      ...selectedGuest,
                      Pembahasan: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Host Pemandu
                  </label>
                  <div className="space-y-3">
                    <select
                      value={
                        LIST_HOST.includes(selectedGuest.Host)
                          ? selectedGuest.Host
                          : "Lainnya"
                      }
                      onChange={(e) =>
                        setSelectedGuest({
                          ...selectedGuest,
                          Host: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-700 focus:border-orange-500 outline-none transition-all appearance-none"
                    >
                      {LIST_HOST.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>

                    {/* Input muncul jika admin klik "Lainnya" ATAU jika datanya memang data manual */}
                    {(!LIST_HOST.includes(selectedGuest.Host) ||
                      selectedGuest.Host === "Lainnya") && (
                      <input
                        placeholder="Tulis nama host manual..."
                        value={
                          selectedGuest.Host === "Lainnya"
                            ? ""
                            : selectedGuest.Host
                        }
                        onChange={(e) =>
                          setSelectedGuest({
                            ...selectedGuest,
                            Host: e.target.value,
                          })
                        }
                        className="w-full bg-white border-2 border-orange-200 rounded-2xl px-5 py-4 font-bold text-slate-700 outline-none focus:border-orange-500"
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors">
                    Kritik & Saran
                  </label>
                  <textarea
                    value={selectedGuest["Kritik & Saran"]}
                    onChange={(e) =>
                      setSelectedGuest({
                        ...selectedGuest,
                        "Kritik & Saran": e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 font-bold text-slate-700 focus:border-orange-500 outline-none transition-all resize-none"
                    rows={1}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F97316] text-white font-black py-5 rounded-3xl shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                <Save size={20} /> Update Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
