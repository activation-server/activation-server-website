import { google } from "googleapis";
import { NEW_WORK_THRESHOLD_DAYS } from "~/constants";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

/**
 * Google Sheetsの列インデックス定義
 * シートの列順序が変更された場合はここを更新
 */
const COLUMNS = {
  MEMBERS: {
    ID: 0,
    NAME: 1,
    AVATAR: 2,
    ROLE: 3,
    BIO: 4,
    TWITTER: 5,
    INSTAGRAM: 6,
    WEBSITE: 7,
    SOUNDCLOUD: 8,
    SPOTIFY: 9,
  },
  WORKS: {
    ID: 0,
    TITLE: 1,
    SUBTITLE: 2,
    IMAGE: 3,
    TAGS: 4,
    DATE: 5,
    MEMBER_IDS: 6,
    TWITTER: 7,
    INSTAGRAM: 8,
    WEBSITE: 9,
    SOUNDCLOUD: 10,
    SPOTIFY: 11,
  },
  EVENTS: {
    ID: 0,
    NUMBER: 1,
    TITLE: 2,
    DATE: 3,
    DESCRIPTION: 4,
    COLOR: 5,
    IMAGE: 6,
    LINK: 7,
    FLYER: 8,
    LOCATION: 9,
    DETAIL: 10,
  },
} as const;

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
  const match = url.match(/\/file\/d\/([^/?]+)/);
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
    soundcloud?: string;
    spotify?: string;
  };
}

export interface Event {
  id: string;
  number: string;
  title: string;
  date: string;
  description?: string;
  color?: string;
  image?: string;
  link?: string;
  flyer?: string;
  location?: string;
  detail?: string;
}

export async function getMembersFromSheet(): Promise<Member[]> {
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Members!A2:J", // A2から始めてヘッダーをスキップ
    });

    const rows = response.data.values || [];

    const { MEMBERS: M } = COLUMNS;
    return rows.map((row) => ({
      id: row[M.ID] || "",
      name: row[M.NAME] || "",
      avatar: convertGoogleDriveUrl(row[M.AVATAR] || ""),
      role: row[M.ROLE] || "",
      bio: row[M.BIO] || undefined,
      socialLinks: {
        twitter: row[M.TWITTER] || undefined,
        instagram: row[M.INSTAGRAM] || undefined,
        website: row[M.WEBSITE] || undefined,
        soundcloud: row[M.SOUNDCLOUD] || undefined,
        spotify: row[M.SPOTIFY] || undefined,
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
      range: "Works!A2:L", // A2から始めてヘッダーをスキップ
    });

    const rows = response.data.values || [];

    const { WORKS: W } = COLUMNS;
    return rows.map((row) => ({
      id: row[W.ID] || "",
      title: row[W.TITLE] || "",
      subtitle: row[W.SUBTITLE] || undefined,
      image: convertGoogleDriveUrl(row[W.IMAGE] || ""),
      tags: row[W.TAGS] ? row[W.TAGS].split(",").map((t: string) => t.trim()) : [],
      date: row[W.DATE] || undefined,
      memberIds: row[W.MEMBER_IDS] ? row[W.MEMBER_IDS].split(",").map((id: string) => id.trim()) : [],
      socialLinks: {
        twitter: row[W.TWITTER] || undefined,
        instagram: row[W.INSTAGRAM] || undefined,
        website: row[W.WEBSITE] || undefined,
        soundcloud: row[W.SOUNDCLOUD] || undefined,
        spotify: row[W.SPOTIFY] || undefined,
      },
    }));
  } catch (error) {
    console.error("Error fetching works from Google Sheets:", error);
    throw error;
  }
}

export async function getEventsFromSheet(): Promise<Event[]> {
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Events!A2:K", // A2から始めてヘッダーをスキップ
    });

    const rows = response.data.values || [];

    const { EVENTS: E } = COLUMNS;
    return rows.map((row) => ({
      id: row[E.ID] || "",
      number: row[E.NUMBER] || "",
      title: row[E.TITLE] || "",
      date: row[E.DATE] || "",
      description: row[E.DESCRIPTION] || undefined,
      color: row[E.COLOR] || "bg-blue-500",
      image: convertGoogleDriveUrl(row[E.IMAGE] || ""),
      link: row[E.LINK] || undefined,
      flyer: convertGoogleDriveUrl(row[E.FLYER] || ""),
      location: row[E.LOCATION] || undefined,
      detail: row[E.DETAIL] || undefined,
    }));
  } catch (error) {
    console.error("Error fetching events from Google Sheets:", error);
    throw error;
  }
}

/**
 * 作品が新着かどうかを判定（dateからNEW_WORK_THRESHOLD_DAYS日以内ならtrue）
 */
export function isWorkNew(work: Work): boolean {
  if (!work.date) return false;

  const workDate = new Date(work.date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - workDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= NEW_WORK_THRESHOLD_DAYS;
}

// イベントが今後のものか判定する関数
export function isEventUpcoming(event: Event): boolean {
  if (!event.date) return false;

  const eventDate = new Date(event.date);
  eventDate.setHours(23, 59, 59, 999); // イベント当日の23:59までupcomingとする
  const now = new Date();

  return eventDate >= now;
}
