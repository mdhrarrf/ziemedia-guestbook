// src/lib/google-sheets.ts
import { google } from "googleapis";

export const getGoogleSheetsInstance = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  // Kita tambahkan komentar di bawah ini untuk memberitahu ESLint:
  // "Abaikan baris ini, saya terpaksa pakai 'any'"

  return google.sheets({
    version: "v4",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    auth: auth as any,
  });
};
