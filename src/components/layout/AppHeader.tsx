"use client";

import { memo, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Dropdown,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";
import { usePathname, useRouter } from "next/navigation";
import { IdentificationCard, SignOut } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { createClient } from "@/lib/supabase/client";

function AppHeaderComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const handleSignOut = useLogout();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null))
      .catch(() => setEmail(null));
  }, []);

  if (pathname === "/login" || pathname === "/signup") return null;

  const initial = email?.[0]?.toUpperCase() ?? "U";

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
          background:
            "linear-gradient(90deg, transparent, var(--brand-accent-border), transparent)",
          opacity: 0.6,
        },
      }}
    >
      <Logo size="sm" />

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <ThemeToggle />
        <Dropdown>
          <MenuButton
            slots={{ root: Box }}
            slotProps={{
              root: {
                "aria-label": "Open account menu",
                role: "button",
                tabIndex: 0,
                sx: {
                  cursor: "pointer",
                  borderRadius: "50%",
                  display: "flex",
                  outline: "none",
                  "&:focus-visible": {
                    boxShadow: "0 0 0 2px var(--brand-accent)",
                  },
                },
              },
            }}
          >
            <Avatar
              size="sm"
              sx={{
                bgcolor: "var(--brand-accent-muted)",
                color: "var(--brand-accent)",
                border: "1px solid var(--brand-accent-border)",
                fontWeight: 600,
                fontSize: "var(--font-size-sm)",
              }}
            >
              {initial}
            </Avatar>
          </MenuButton>
          <Menu
            placement="bottom-end"
            sx={{
              minWidth: 200,
              bgcolor: "var(--surface-overlay)",
              border: "1px solid var(--surface-border)",
              boxShadow: "var(--shadow-modal)",
              "--ListItem-radius": "var(--layout-radius-sm)",
            }}
          >
            {email ? (
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Signed in as
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {email}
                  </Typography>
                </Box>
              </MenuItem>
            ) : null}
            {email ? <ListDivider /> : null}
            <MenuItem onClick={() => router.push("/biography")}>
              <IdentificationCard size={16} weight="bold" />
              Biography
            </MenuItem>
            <ListDivider />
            <MenuItem color="danger" onClick={handleSignOut}>
              <SignOut size={16} />
              Sign out
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Box>
  );
}

export const AppHeader = memo(AppHeaderComponent);
