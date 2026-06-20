"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssVarsProvider } from "@mui/joy/styles";
import { useState, useSyncExternalStore } from "react";
import { theme } from "@/styles/theme";
import { AppToaster } from "@/components/core/toaster";
import { parseThemeMode, THEME_STORAGE_KEY } from "@/lib/theme";
import type { ThemeMode } from "@/lib/theme";

type ProvidersProps = {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
};

function readDomTheme(): ThemeMode {
  return parseThemeMode(
    document.documentElement.getAttribute("data-joy-color-scheme")
  );
}

function useResolvedTheme(serverMode: ThemeMode): ThemeMode {
  return useSyncExternalStore(
    () => () => {},
    readDomTheme,
    () => serverMode
  );
}

export function Providers({ children, defaultMode = "dark" }: ProvidersProps) {
  const mode = useResolvedTheme(defaultMode);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider
        theme={theme}
        defaultMode={mode}
        modeStorageKey={THEME_STORAGE_KEY}
        colorSchemeSelector="data-joy-color-scheme"
        disableTransitionOnChange
      >
        {children}
        <AppToaster />
      </CssVarsProvider>
    </QueryClientProvider>
  );
}
