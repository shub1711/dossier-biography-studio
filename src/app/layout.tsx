import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { Providers } from "@/components/core/providers";
import { AppHeader } from "@/components/layout/AppHeader";
import { BRAND } from "@/lib/constants/brand";
import { parseThemeMode, THEME_COOKIE_KEY, THEME_STORAGE_KEY } from "@/lib/theme";
import type { ThemeMode } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: BRAND.pageTitle,
  description: BRAND.description,
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

const themeInitScript = `
(function() {
  var key = "${THEME_STORAGE_KEY}";
  var cookieKey = "${THEME_COOKIE_KEY}";
  var mode = "dark";
  try {
    var stored = localStorage.getItem(key);
    if (stored === "light" || stored === "dark") {
      mode = stored;
    } else {
      var match = document.cookie.match(new RegExp("(?:^|; )" + cookieKey + "=([^;]*)"));
      if (match && (match[1] === "light" || match[1] === "dark")) mode = match[1];
    }
    localStorage.setItem(key, mode);
    document.cookie = cookieKey + "=" + mode + ";path=/;max-age=31536000;SameSite=Lax";
  } catch (e) {}
  var root = document.documentElement;
  root.setAttribute("data-joy-color-scheme", mode);
  root.style.colorScheme = mode;
  root.style.backgroundColor = mode === "light" ? "#f6faf8" : "#080c0a";
  root.style.color = mode === "light" ? "#111c18" : "#edf2f0";
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialMode: ThemeMode = parseThemeMode(
    cookieStore.get(THEME_COOKIE_KEY)?.value
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-joy-color-scheme={initialMode}
      style={{ colorScheme: initialMode }}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={inter.variable} suppressHydrationWarning>
        <Providers defaultMode={initialMode}>
          <AppHeader />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
