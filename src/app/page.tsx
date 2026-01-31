"use client";

import { useState } from "react";
// Link ini untuk pindah halaman
import Link from "next/link";
// Ikon-ikon dari Lucide
import {
  Send,
  User,
  Building,
  Phone,
  BookOpen,
  MessageSquare,
  Mic2,
  Circle,
} from "lucide-react";

export default function GuestbookPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sedang memproses data...");

    const formData = new FormData(e.currentTarget);
    const data = {
      nama: formData.get("nama"),
      kontak: formData.get("kontak"),
      jabatan: formData.get("jabatan"),
      instansi: formData.get("instansi"),
      pembahasan: formData.get("pembahasan"),
      host: formData.get("host"),
      pesan: formData.get("pesan"),
    };

    try {
      const res = await fetch("/api/simpan-tamu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("✅ Berhasil! Data kunjungan Anda telah tersimpan.");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("❌ Gagal mengirim. Silakan coba lagi.");
      }
    } catch {
      setStatus("❌ Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 md:p-8 lg:p-12 font-sans selection:bg-orange-100">
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl bg-white rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden border border-slate-200">
        {/* SISI KIRI: BRANDING & IDENTITY */}
        <div className="w-full md:w-[40%] bg-[#1E3A8A] p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Dot Pattern (User Preferred) */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1.2px, transparent 1.2px)",
              backgroundSize: "24px 24px",
            }}
          ></div>

          <div className="relative z-10">
            {/* Logo Section */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl transform -rotate-3">
                <Mic2 className="text-[#F97316]" size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none">
                  ZIE MEDIA
                </span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-orange-400 uppercase leading-none mt-1.5">
                  Studio Production
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight mb-6 leading-tight">
              Buku Tamu <br />
              Digital Studio
            </h1>

            <p className="text-blue-100/70 text-sm leading-relaxed max-w-70 font-medium">
              Selamat datang di Studio Zie Media. Mohon catat kehadiran Anda
              untuk keperluan dokumentasi dan arsip kami.
            </p>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-8">
              <Circle
                className="text-orange-500 fill-orange-500 animate-pulse"
                size={10}
              />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-orange-400">
                On-Air Ready
              </span>
            </div>

            <p className="text-[10px] font-black tracking-[0.25em] text-blue-300/40 uppercase mb-1">
              Location
            </p>
            <p className="text-xs font-bold">Batam City, Indonesia</p>
          </div>
        </div>

        {/* SISI KANAN: FORMULIR DENGAN KONTRAS TINGGI */}
        <div className="w-full md:w-[60%] p-8 md:p-14 lg:p-16 bg-slate-50/50">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Formulir Kunjungan
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Silakan lengkapi kolom penginputan di bawah ini.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F97316]">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#F97316]"
                    size={18}
                  />
                  <input
                    name="nama"
                    required
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm placeholder:text-slate-300"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
              </div>

              {/* Kontak */}
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F97316]">
                  No. WhatsApp / Email
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#F97316]"
                    size={18}
                  />
                  <input
                    name="kontak"
                    required
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm placeholder:text-slate-300"
                    placeholder="0812xxxx"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Jabatan */}
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F97316]">
                  Jabatan / Posisi
                </label>
                <input
                  name="jabatan"
                  required
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm placeholder:text-slate-300"
                  placeholder="Narasumber / Talent"
                />
              </div>

              {/* Instansi */}
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F97316]">
                  Instansi / Kantor
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#F97316]"
                    size={16}
                  />
                  <input
                    name="instansi"
                    required
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm placeholder:text-slate-300"
                    placeholder="Nama Perusahaan"
                  />
                </div>
              </div>
            </div>

            {/* Topik Podcast */}
            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F97316]">
                Topik Pembahasan Podcast
              </label>
              <div className="relative">
                <BookOpen
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#F97316]"
                  size={18}
                />
                <input
                  name="pembahasan"
                  required
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm placeholder:text-slate-300"
                  placeholder="Judul Pembicaraan Podcast"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Host */}
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F97316]">
                  Nama Host (Tim Zie)
                </label>
                <input
                  name="host"
                  required
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm placeholder:text-slate-300"
                  placeholder="Nama Host Pemandu"
                />
              </div>

              {/* Kritik/Saran */}
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F97316]">
                  Kritik & Saran
                </label>
                <div className="relative">
                  <MessageSquare
                    className="absolute left-4 top-4 text-slate-400 transition-colors group-focus-within:text-[#F97316]"
                    size={18}
                  />
                  <textarea
                    name="pesan"
                    rows={1}
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm resize-none placeholder:text-slate-300"
                    placeholder="Opsional..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* BUTTON ACTION */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-sm tracking-widest py-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 uppercase"
            >
              {loading ? (
                "Sedang Mengirim..."
              ) : (
                <>
                  <Send size={18} /> Konfirmasi Kehadiran
                </>
              )}
            </button>

            {status && (
              <div
                className={`text-center p-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-2 ${status.includes("✅") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}
              >
                {status}
              </div>
            )}
          </form>
          {/* FOOTER SECTION DENGAN PINTU ADMIN */}
          <div className="p-8 bg-gray-50/50 text-center border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">
              © 2024 Zie Media Production Studio
            </p>

            {/* PINTU RAHASIA ADMIN */}
            <Link
              href="/admin/login"
              className="group flex items-center gap-2 text-[9px] font-black text-slate-300 hover:text-[#1E3A8A] transition-all uppercase tracking-[0.2em] border border-slate-200 px-3 py-1.5 rounded-lg hover:border-[#1E3A8A]/20 hover:bg-white"
            >
              <div className="w-1.5 h-1.5 bg-slate-300 group-hover:bg-orange-500 rounded-full transition-colors"></div>
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
