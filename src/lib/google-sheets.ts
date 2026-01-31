// src/lib/google-sheets.ts
import { google } from "googleapis";

export const getGoogleSheetsInstance = async () => {
  // Ambil kunci mentah
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";

  // LOGIKA PEMBERSIHAN:
  // 1. Ganti \n menjadi baris baru beneran
  // 2. Hapus tanda kutip jika masih ada yang terbawa
  const formattedKey = rawKey.replace(/\\n/g, "\n").replace(/"/g, "");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: formattedKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({
    version: "v4",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    auth: auth as any,
  });
};
