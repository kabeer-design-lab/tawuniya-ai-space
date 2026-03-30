export interface ThemeColors {
  bg: string; bgSecondary: string; bgHover: string; bgActiveChat: string;
  border: string; borderLight: string; text: string; textSecondary: string;
  textTertiary: string; textMuted: string; inputBg: string; cardBg: string;
  dropdownBg: string; userBubbleBg: string; userBubbleBorder: string;
  sourcesBg: string; sourcesHeader: string; toastBg: string; toastText: string;
}

export const defaultTheme: ThemeColors = {
  bg: "#ffffff", bgSecondary: "#f9fafb", bgHover: "#f5f5f5", bgActiveChat: "#f0ebff",
  border: "#e9eaeb", borderLight: "#d5d7da", text: "#181d27", textSecondary: "#414651",
  textTertiary: "#535862", textMuted: "#717680", inputBg: "#ffffff", cardBg: "#ffffff",
  dropdownBg: "#ffffff", userBubbleBg: "#f9fafb", userBubbleBorder: "#e9eaeb",
  sourcesBg: "#fafafa", sourcesHeader: "#f5f5f5", toastBg: "#181d27", toastText: "#ffffff",
};
