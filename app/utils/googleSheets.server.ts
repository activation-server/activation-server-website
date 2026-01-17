import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Google DriveのリンクをIMG表示用URLに変換
function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;

  // 既に変換済みの場合はそのまま返す
  if (url.includes('/thumbnail?id=')) return url;

  // /uc?export=view 形式の場合、thumbnailに変換
  if (url.includes('/uc?export=view')) {
    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
    }
  }

  // /file/d/{ID}/view または /file/d/{ID}/edit 形式を検出
  const match = url.match(/\/file\/d\/([^\/\?]+)/);
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }

  return url;
}

async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
    soundcloud?: string;
    spotify?: string;
  };
}

export interface Work {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  tags: string[];
  date?: string;
  memberIds: string[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export async function getMembersFromSheet(): Promise<Member[]> {
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Members!A2:J", // A2から始めてヘッダーをスキップ
    });

    const rows = response.data.values || [];

    return rows.map((row) => ({
      id: row[0] || "",
      name: row[1] || "",
      avatar: convertGoogleDriveUrl(row[2] || ""),
      role: row[3] || "",
      bio: row[4] || undefined,
      socialLinks: {
        twitter: row[5] || undefined,
        instagram: row[6] || undefined,
        website: row[7] || undefined,
        soundcloud: row[8] || undefined,
        spotify: row[9] || undefined,
      },
    }));
  } catch (error) {
    console.error("Error fetching members from Google Sheets:", error);
    throw error;
  }
}

export async function getWorksFromSheet(): Promise<Work[]> {
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Works!A2:J", // A2から始めてヘッダーをスキップ
    });

    const rows = response.data.values || [];

    return rows.map((row) => ({
      id: row[0] || "",
      title: row[1] || "",
      subtitle: row[2] || undefined,
      image: convertGoogleDriveUrl(row[3] || ""),
      tags: row[4] ? row[4].split(",").map((t: string) => t.trim()) : [],
      date: row[5] || undefined,
      memberIds: row[6] ? row[6].split(",").map((id: string) => id.trim()) : [],
      socialLinks: {
        twitter: row[7] || undefined,
        instagram: row[8] || undefined,
        website: row[9] || undefined,
      },
    }));
  } catch (error) {
    console.error("Error fetching works from Google Sheets:", error);
    throw error;
  }
}

// isNewを動的に判定する関数（dateから30日以内ならtrue）
export function isWorkNew(work: Work): boolean {
  if (!work.date) return false;

  const workDate = new Date(work.date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - workDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 30;
}
