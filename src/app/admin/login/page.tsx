"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        localStorage.setItem("isAdminLoggedIn", "true");
        router.push("/admin");
      } else {
        setError("Akses Ditolak! Password tidak sesuai.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-blue-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-orange-100/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-md w-full relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1E3A8A] transition-colors mb-6 text-xs font-bold uppercase tracking-widest ml-2"
        >
          <ArrowLeft size={14} /> Kembali ke Beranda
        </Link>

        {/* LOGIN CARD: Bungkus Putih Utama */}
        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(30,58,138,0.15)] border border-white flex flex-col items-center">
          {/* Logo Area: mx-auto memastikan dia di tengah */}
          <div className="w-35 h-35 flex items-center justify-center overflow-hidden relative -mt-7.5 mx-auto">
            <Image
              src="/logo-ziemedia.png"
              alt="Zie Media Logo"
              width={140}
              height={140}
              className="object-contain"
              priority
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Admin Authentication
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Otentikasi diperlukan untuk akses database Zie Media SMKN 1 Cianjur.
            </p>
          </div>

          {/* Form harus full width (w-full) agar mengikuti card */}
          <form onSubmit={handleLogin} className="space-y-6 w-full">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Master Password
              </label>
              <div className="relative group mt-2">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F97316] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-15 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#F97316] focus:bg-white transition-all text-left text-lg font-black tracking-[0.3em] text-[#1E3A8A] placeholder:tracking-normal placeholder:text-slate-200 placeholder:font-medium shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100">
                <ShieldCheck size={16} />
                <p className="text-[11px] font-bold uppercase tracking-wider">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white font-black py-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(30,58,138,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 text-xs tracking-[0.2em] uppercase"
            >
              {loading ? "Verifikasi..." : "Masuk ke Dashboard"}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <p className="text-center mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
          Secure Login &bull; Zie Media • SMKN 1 Cianjur
        </p>
      </div>
    </main>
  );
}
