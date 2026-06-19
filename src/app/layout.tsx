import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Providers } from "@/components/core/providers";
import { AppHeader } from "@/components/layout/AppHeader";
import { BRAND } from "@/lib/constants/brand";
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
  var key = "dossier-theme";
  var mode = "dark";
  try {
    var stored = localStorage.getItem(key);
    if (stored === "light" || stored === "dark") mode = stored;
  } catch (e) {}
  document.documentElement.setAttribute("data-joy-color-scheme", mode);
  document.documentElement.style.backgroundColor = mode === "light" ? "#f6faf8" : "#080c0a";
  document.documentElement.style.color = mode === "light" ? "#111c18" : "#edf2f0";
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Providers>
          <AppHeader />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
