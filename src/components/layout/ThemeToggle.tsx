"use client";

import { IconButton, Tooltip } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import { Moon, Sun } from "@phosphor-icons/react";
import { memo, useCallback, useEffect, useState } from "react";

function ThemeToggleComponent() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  if (!mounted) {
    return (
      <IconButton
        variant="plain"
        color="neutral"
        size="sm"
        aria-hidden
        tabIndex={-1}
        sx={{
          borderRadius: "var(--layout-radius-sm)",
          color: "var(--text-secondary)",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      />
    );
  }

  const isDark = mode === "dark";

  return (
    <Tooltip title={isDark ? "Light mode" : "Dark mode"} placement="bottom">
      <IconButton
        variant="plain"
        color="neutral"
        size="sm"
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        sx={{
          borderRadius: "var(--layout-radius-sm)",
          color: "var(--text-secondary)",
          "&:hover": { bgcolor: "var(--brand-accent-muted)" },
        }}
      >
        {isDark ? <Sun size={18} weight="regular" /> : <Moon size={18} weight="regular" />}
      </IconButton>
    </Tooltip>
  );
}

export const ThemeToggle = memo(ThemeToggleComponent);
