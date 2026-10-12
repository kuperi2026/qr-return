/** QR RETURN palette export. The existing site uses matching CSS variables.
 * Tailwind v3: merge theme.extend.colors into your configuration.
 * Tailwind v4: load this file explicitly with @config (path relative to the CSS).
 * Use each `foreground` on its matching DEFAULT fill; `ink` is for light surfaces.
 */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0F172A", hover: "#1E293B", foreground: "#F8FAFC" },
        secondary: { DEFAULT: "#2DD4BF", hover: "#5EEAD4", foreground: "#0F172A", ink: "#0F766E", soft: "#CCFBF1" },
        accent: { DEFAULT: "#FF8A3D", hover: "#F97316", foreground: "#0F172A", ink: "#9A3412", soft: "#FFF0E5" },
        background: { DEFAULT: "#F8FAFC", dark: "#0B1220" },
        surface: { DEFAULT: "#FFFFFF", muted: "#F1F5F9", dark: "#1E293B" },
        text: { DEFAULT: "#1E293B", secondary: "#475569", muted: "#526176", inverse: "#F8FAFC", "inverse-muted": "#CBD5E1" },
        border: { DEFAULT: "#D7E0E8", control: "#64748B", dark: "#475569" },
        success: { DEFAULT: "#0F766E", soft: "#CCFBF1", foreground: "#FFFFFF" },
        warning: { DEFAULT: "#92400E", soft: "#FEF3C7", foreground: "#FFFFFF" },
        emergency: { DEFAULT: "#B91C1C", soft: "#FEF2F2", foreground: "#FFFFFF" },
        focus: { DEFAULT: "#0F766E", dark: "#2DD4BF" },
      },
    },
  },
};
