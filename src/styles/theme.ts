import { extendTheme } from "@mui/joy/styles";

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          solidBg: "#10b981",
          solidHoverBg: "#059669",
          solidActiveBg: "#047857",
          outlinedColor: "#059669",
          outlinedBorder: "#a7f3d0",
          outlinedHoverBg: "#ecfdf5",
          softBg: "#ecfdf5",
          softColor: "#047857",
          softHoverBg: "#d1fae5",
          plainColor: "#059669",
          plainHoverBg: "#ecfdf5",
        },
        neutral: {
          50: "#f6faf8",
          100: "#edf4f0",
          200: "#d8e8e2",
          300: "#b3cdc5",
          400: "#7fa89e",
          500: "#5a8077",
          600: "#416059",
          700: "#2e4440",
          800: "#1c2a27",
          900: "#111c18",
        },
        background: {
          body: "#f6faf8",
          surface: "#ffffff",
          level1: "#edf4f0",
          level2: "#d8e8e2",
        },
        success: {
          50: "#ecfdf5",
          500: "#10b981",
          600: "#059669",
          softBg: "rgba(16, 185, 129, 0.1)",
          softColor: "#047857",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          solidBg: "#10b981",
          solidHoverBg: "#059669",
          solidActiveBg: "#34d399",
          outlinedColor: "#34d399",
          outlinedBorder: "rgba(16, 185, 129, 0.4)",
          outlinedHoverBg: "rgba(16, 185, 129, 0.1)",
          softBg: "rgba(16, 185, 129, 0.12)",
          softColor: "#6ee7b7",
          softHoverBg: "rgba(16, 185, 129, 0.18)",
          plainColor: "#34d399",
          plainHoverBg: "rgba(16, 185, 129, 0.1)",
        },
        neutral: {
          50: "#edf4f0",
          100: "#d8e8e2",
          200: "#8a9490",
          300: "#6b7c76",
          400: "#4d5e59",
          500: "#344540",
          600: "#1f2e2a",
          700: "#141c19",
          800: "#0f1512",
          900: "#080c0a",
        },
        background: {
          body: "#080c0a",
          surface: "#0f1512",
          level1: "#141c19",
          level2: "#1c2a27",
        },
        success: {
          softBg: "rgba(16, 185, 129, 0.12)",
          softColor: "#6ee7b7",
          solidBg: "#059669",
        },
        warning: {
          softBg: "rgba(245, 158, 11, 0.12)",
          softColor: "#fcd34d",
          solidBg: "#d97706",
        },
        danger: {
          softBg: "rgba(239, 68, 68, 0.12)",
          softColor: "#fca5a5",
        },
      },
    },
  },
  fontFamily: {
    body: "var(--font-sans)",
    display: "var(--font-sans)",
  },
  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  components: {
    JoyButton: {
      defaultProps: {
        size: "sm",
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
          letterSpacing: "0.01em",
          borderRadius: "var(--layout-radius-sm)",
          transition: "all 0.15s ease",
        },
      },
    },
    JoyCard: {
      styleOverrides: {
        root: {
          borderRadius: "var(--layout-radius-md)",
          border: "1px solid var(--surface-border)",
          backgroundColor: "var(--surface-raised)",
          boxShadow: "var(--shadow-sm)",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        },
      },
    },
    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: "var(--layout-radius-sm)",
          "--Input-focusedThickness": "1px",
          transition: "border-color 0.15s ease",
        },
      },
    },
    JoyTextarea: {
      styleOverrides: {
        root: {
          borderRadius: "var(--layout-radius-sm)",
          "--Textarea-focusedThickness": "1px",
          transition: "border-color 0.15s ease",
        },
      },
    },
    JoyModalDialog: {
      styleOverrides: {
        root: {
          borderRadius: "var(--layout-radius-lg)",
          border: "1px solid var(--surface-border)",
          boxShadow: "var(--shadow-modal)",
        },
      },
    },
    JoyChip: {
      styleOverrides: {
        root: {
          borderRadius: "var(--layout-radius-xs)",
          fontWeight: 500,
          fontSize: "0.6875rem",
          letterSpacing: "0.02em",
        },
      },
    },
    JoyFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.8125rem",
          fontWeight: 500,
          letterSpacing: "0.01em",
        },
      },
    },
    JoyAlert: {
      styleOverrides: {
        root: {
          borderRadius: "var(--layout-radius-sm)",
        },
      },
    },
    JoyTab: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: "var(--font-size-sm)",
        },
      },
    },
  },
});
