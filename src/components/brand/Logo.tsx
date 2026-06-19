"use client";

import { Box, Typography } from "@mui/joy";
import Link from "next/link";
import { memo } from "react";
import { BRAND } from "@/lib/constants/brand";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string | null;
};

const sizes = {
  sm: { icon: 26, font: "0.9375rem" },
  md: { icon: 30, font: "1.0625rem" },
  lg: { icon: 40, font: "1.375rem" },
};

function LogoMark({ size }: { size: number }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: size,
        height: size,
        borderRadius: "var(--layout-radius-sm)",
        background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow:
          "0 0 0 1px rgba(16,185,129,0.3), 0 2px 8px rgba(16,185,129,0.2)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
          borderRadius: "inherit",
        },
      }}
    >
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 7h14M5 12h9M5 17h11"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </Box>
  );
}

function LogoComponent({ size = "md", showText = true, href = "/biography" }: LogoProps) {
  const dim = sizes[size];

  const content = (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.25,
        color: "var(--text-primary)",
      }}
    >
      <LogoMark size={dim.icon} />
      {showText ? (
        <Typography
          component="span"
          sx={{
            fontSize: dim.font,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--text-primary) 0%, var(--brand-accent-strong) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {BRAND.name}
        </Typography>
      ) : null}
    </Box>
  );

  if (href) {
    return (
      <Link href={href} style={{ display: "inline-flex" }}>
        {content}
      </Link>
    );
  }

  return content;
}

export const Logo = memo(LogoComponent);
