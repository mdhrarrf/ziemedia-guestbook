// src/app/api/guestbook/route.ts
import { getGoogleSheetsInstance } from "@/lib/google-sheets";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, jabatan, instansi, pembahasan, host, kontak, pesan } = body;

    const sheets = await getGoogleSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 1. Ambil data untuk nomor urut
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:A",
    });

    const rows = response.data.values || [];
    const nextNo = rows.length;

    const tanggal = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const values = [
      [
        nextNo,
        tanggal,
        nama,
        jabatan,
        instansi,
        pembahasan,
        host,
        kontak,
        pesan,
      ],
    ];

    // 2. Kirim data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return NextResponse.json({ message: "Berhasil" }, { status: 200 });
  } catch (error: unknown) {
    // Kita gunakan 'unknown' agar ESLint tidak marah,
    // lalu kita ubah jadi Error agar bisa baca pesan .message-nya
    const err = error as Error;
    console.error("Gagal Simpan ke Sheets. Detail:", err.message);

    return NextResponse.json(
      { message: "Gagal", error: err.message },
      { status: 500 },
    );
  }
}
