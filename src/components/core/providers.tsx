"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssVarsProvider } from "@mui/joy/styles";
import { useState } from "react";
import { theme } from "@/styles/theme";
import { AppToaster } from "@/components/core/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
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
      <CssVarsProvider theme={theme} defaultMode="dark" modeStorageKey="dossier-theme">
        {children}
        <AppToaster />
      </CssVarsProvider>
    </QueryClientProvider>
  );
}
