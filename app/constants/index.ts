/**
 * Discord招待URL
 */
export const DISCORD_INVITE_URL =
  "https://discord.com/invite/BwtTvC8Fny?fbclid=PAZXh0bgNhZW0CMTEAAac1PFb-eN8Jh94RDx-Ej9NW2sYksBPX4LMdPLokE9mQfwvoWMe-girvS9dZww_aem_dcecfxWLJvu-LJkts3CUEw";

/**
 * メインビジュアル動画のパス
 */
export const MAIN_VISUAL_VIDEOS = [
  "/main-visual/main-visual-1.mov",
  "/main-visual/main-visual-2.mov",
  "/main-visual/main-visual-3.mov",
  "/main-visual/main-visual-4.mov",
  "/main-visual/main-visual-5.mov",
] as const;

/**
 * ビデオエフェクトの種類
 */
export const VIDEO_EFFECTS = ["glitch", "ascii", "pixelate", "vhs"] as const;

export type VideoEffectType = (typeof VIDEO_EFFECTS)[number];

/**
 * 新着判定の日数（この日数以内なら新着扱い）
 */
export const NEW_WORK_THRESHOLD_DAYS = 30;

/**
 * サイトメタ情報
 */
export const SITE_META = {
  title: "活性化サーバー | Activation Server",
  description:
    "活性化サーバーは、活性化を目的としたサーバーです。様々な活動やイベントが行われます。",
  url: "https://activation-server.com",
  locale: "ja_JP",
  siteName: "Activation Server",
  themeColor: "#000000",
} as const;
