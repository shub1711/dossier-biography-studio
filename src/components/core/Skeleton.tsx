"use client";

import { Box, Skeleton as JoySkeleton } from "@mui/joy";
import type { SkeletonProps as JoySkeletonProps } from "@mui/joy/Skeleton";

type SkeletonVariant = "text" | "card" | "avatar" | "button" | "page" | "auth";

type AppSkeletonProps = {
  variant?: SkeletonVariant;
  lines?: number;
  width?: JoySkeletonProps["width"];
  height?: JoySkeletonProps["height"];
  sx?: JoySkeletonProps["sx"];
};

function SkeletonLine({
  width = "100%",
  height = 14,
}: {
  width?: JoySkeletonProps["width"];
  height?: number;
}) {
  return (
    <JoySkeleton
      variant="rectangular"
      animation="wave"
      width={width}
      height={height}
      sx={{
        borderRadius: "var(--layout-radius-sm)",
        bgcolor: "var(--surface-skeleton)",
        "&::after": {
          background:
            "linear-gradient(90deg, transparent, var(--surface-border-strong), transparent)",
        },
      }}
    />
  );
}

function SkeletonCard() {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "var(--layout-radius-md)",
        border: "1px solid var(--surface-border)",
        bgcolor: "var(--surface-raised)",
      }}
    >
      <SkeletonLine width="40%" height={16} />
      <Box sx={{ mt: 2 }}>
        <SkeletonLine />
        <Box sx={{ mt: 1 }}>
          <SkeletonLine />
        </Box>
        <Box sx={{ mt: 1 }}>
          <SkeletonLine width="85%" />
        </Box>
      </Box>
    </Box>
  );
}

function SkeletonPage() {
  return (
    <Box className="page-shell">
      <Box className="page-header">
        <Box className="page-header__content">
          <SkeletonLine width={220} height={28} />
          <Box sx={{ mt: 1.5 }}>
            <SkeletonLine width={320} height={14} />
          </Box>
        </Box>
        <SkeletonLine width={100} height={36} />
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <SkeletonLine width={90} height={28} />
        <SkeletonLine width={120} height={28} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </Box>
    </Box>
  );
}

function SkeletonAuth() {
  return (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <SkeletonLine width={120} height={32} />
      </Box>
      <Box
        sx={{
          p: 3,
          borderRadius: "var(--layout-radius-lg)",
          border: "1px solid var(--surface-border)",
          bgcolor: "var(--surface-raised)",
        }}
      >
        <SkeletonLine width="50%" height={24} />
        <Box sx={{ mt: 1.5, mb: 3 }}>
          <SkeletonLine width="80%" height={14} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <SkeletonLine height={40} />
          <SkeletonLine height={40} />
          <SkeletonLine height={40} />
        </Box>
      </Box>
    </Box>
  );
}

export function Skeleton({
  variant = "text",
  lines = 3,
  width,
  height,
  sx,
}: AppSkeletonProps) {
  if (variant === "page") return <SkeletonPage />;
  if (variant === "card") return <SkeletonCard />;
  if (variant === "auth") return <SkeletonAuth />;

  if (variant === "avatar") {
    return (
      <JoySkeleton
        variant="circular"
        animation="wave"
        width={height ?? 32}
        height={height ?? 32}
        sx={{
          bgcolor: "var(--surface-skeleton)",
          ...sx,
        }}
      />
    );
  }

  if (variant === "button") {
    return (
      <JoySkeleton
        variant="rectangular"
        animation="wave"
        width={width ?? 100}
        height={height ?? 36}
        sx={{
          borderRadius: "var(--layout-radius-sm)",
          bgcolor: "var(--surface-skeleton)",
          ...sx,
        }}
      />
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ...sx }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={i === lines - 1 ? "70%" : width ?? "100%"}
          height={typeof height === "number" ? height : 14}
        />
      ))}
    </Box>
  );
}
