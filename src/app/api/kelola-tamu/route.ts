// src/app/api/kelola-tamu/route.ts
import { getGoogleSheetsInstance } from "@/lib/google-sheets";
import { NextResponse } from "next/server";

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

// FUNGSI HAPUS DATA
export async function DELETE(req: Request) {
  try {
    const { rowIndex } = await req.json();
    const sheets = await getGoogleSheetsInstance();

    // Di Google Sheets API, hapus data menggunakan 'batchUpdate'
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // 0 biasanya adalah ID untuk tab pertama (Sheet1)
                dimension: "ROWS",
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// FUNGSI EDIT DATA
export async function PATCH(req: Request) {
  try {
    const { rowIndex, updatedData } = await req.json();
    const sheets = await getGoogleSheetsInstance();

    // Data yang dikirim dari dashboard harus urut sesuai kolom di Excel
    // No, Tanggal, Nama, Jabatan, Instansi, Pembahasan, Host, Kontak, Pesan
    const values = [updatedData];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!A${rowIndex}:I${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return NextResponse.json({ message: "Data berhasil diupdate" });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
