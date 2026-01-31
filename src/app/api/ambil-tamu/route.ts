// src/app/api/ambil-tamu/route.ts
import { getGoogleSheetsInstance } from "@/lib/google-sheets";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sheets = await getGoogleSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:I",
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return NextResponse.json([]);

    const header = rows[0] as string[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = rows.slice(1).map((row: any, index: number) => {
      const obj: Record<string, string | number> = {};

      // Kita tambahkan 'rowIndex' agar Dashboard tahu data ini ada di baris mana
      // index + 2 karena: index mulai dari 0, data mulai dari baris 2 (baris 1 itu header)
      obj["rowIndex"] = index + 2;

      header.forEach((key, i) => {
        obj[key] = row[i] || "-";
      });
      return obj;
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { message: "Gagal", error: err.message },
      { status: 500 },
    );
  }
}
