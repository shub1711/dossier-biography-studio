"use client";

import { memo } from "react";
import { Box, Button } from "@mui/joy";
import { usePathname } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useLogout } from "@/features/auth/hooks/useLogout";

function AppHeaderComponent() {
  const pathname = usePathname();
  const handleSignOut = useLogout();

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <Box
      component="header"
      sx={{
        height: "var(--layout-header-height)",
        borderBottom: "1px solid var(--surface-border)",
        px: { xs: 2, md: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "rgba(8, 12, 10, 0.85)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(16px) saturate(1.5)",
        WebkitBackdropFilter: "blur(16px) saturate(1.5)",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--brand-accent-border), transparent)",
          opacity: 0.6,
        },
      }}
    >
      <Logo size="sm" />

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <ThemeToggle />
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          onClick={handleSignOut}
          startDecorator={<SignOut size={15} />}
          sx={{
            fontWeight: 500,
            fontSize: "var(--font-size-sm)",
            color: "var(--text-secondary)",
            borderRadius: "var(--layout-radius-sm)",
            "&:hover": {
              bgcolor: "var(--brand-accent-muted)",
              color: "var(--brand-accent)",
            },
          }}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
}

export const AppHeader = memo(AppHeaderComponent);
