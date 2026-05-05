/**
 * Brook Skincare — Admin Design Tokens
 * Clean light dashboard + dark sidebar system
 */

export const palette = {
  white: "#ffffff",
  whiteSoft: "#f8f7f3",
  cream: "#fbfaf7",
  creamHover: "#f1efe9",

  bg0: "#0A1F14",
  bg1: "#0F2D1E",
  bg2: "#1A3D2B",
  bg3: "#1F4A33",

  gold: "#C9A96E",
  goldDeep: "#a07840",
  goldFaint: "rgba(201,169,110,0.08)",
  goldMuted: "rgba(201,169,110,0.18)",
  goldBorder: "rgba(201,169,110,0.25)",

  textPrimary: "#1E1E1E",
  textSecondary: "rgba(30,30,30,0.65)",
  textMuted: "rgba(30,30,30,0.4)",

  borderSubtle: "rgba(0,0,0,0.06)",
  borderLight: "rgba(0,0,0,0.1)",

  errorBg: "rgba(239,68,68,0.1)",
  errorBgSoft: "rgba(239,68,68,0.08)",
  errorBorder: "rgba(239,68,68,0.2)",
  errorText: "#dc2626",

  successBg: "rgba(52,211,153,0.12)",
  successBorder: "rgba(52,211,153,0.25)",
  successText: "#059669",

  accentGold: "#C9A96E",
  accentGreen: "#34d399",
  accentBlue: "#3b82f6",
  accentPurple: "#8b5cf6",
} as const;

export const bg = {
  page: palette.whiteSoft,
  card: palette.white,
  cardAlt: palette.cream,
  hover: palette.creamHover,
  sidebar: palette.bg1,
} as const;

export const text = {
  primary: palette.textPrimary,
  secondary: palette.textSecondary,
  muted: palette.textMuted,
  gold: palette.gold,
  success: palette.successText,
  error: palette.errorText,
} as const;

export const border = {
  subtle: palette.borderSubtle,
  light: palette.borderLight,
  gold: palette.goldBorder,
  error: palette.errorBorder,
  success: palette.successBorder,
} as const;

export const gradient = {
  page: `radial-gradient(circle at top left, ${palette.goldFaint} 0%, transparent 34%),
         linear-gradient(135deg, ${palette.whiteSoft} 0%, ${palette.white} 48%, ${palette.cream} 100%)`,

  card: `linear-gradient(135deg, ${palette.white} 0%, ${palette.cream} 100%)`,

  cardGold: `linear-gradient(135deg, rgba(201,169,110,0.16) 0%, ${palette.white} 45%, ${palette.cream} 100%)`,

  sidebar: `linear-gradient(180deg, ${palette.bg1} 0%, ${palette.bg0} 100%)`,

  header: `linear-gradient(180deg, ${palette.bg1} 0%, ${palette.bg0} 100%)`,

  gold: `linear-gradient(135deg, ${palette.gold} 0%, ${palette.goldDeep} 100%)`,

  goldSoft: `linear-gradient(135deg, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0.04) 100%)`,

  darkPanel: `linear-gradient(135deg, ${palette.bg1} 0%, ${palette.bg0} 100%)`,
} as const;

export const shadow = {
  soft: "0 10px 30px rgba(15,45,30,0.08)",
  card: "0 16px 40px rgba(15,45,30,0.10)",
  strong: "0 24px 70px rgba(15,45,30,0.18)",
} as const;

export const skeleton = {
  base: "rgba(0,0,0,0.05)",
  highlight: "rgba(0,0,0,0.1)",
} as const;