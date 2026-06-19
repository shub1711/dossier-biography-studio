"use client";

import { memo } from "react";
import { Box, Button, Typography } from "@mui/joy";
import NextLink from "next/link";
import { Logo } from "@/components/brand/Logo";

type AuthLayoutProps = {
  children: React.ReactNode;
  mode?: "login" | "signup";
};

function DecorShape({
  width,
  height,
  top,
  left,
  right,
  bottom,
  rotate = 0,
  borderRadius = "14px",
  opacity = 0.16,
  filled = false,
}: {
  width: number;
  height: number;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  rotate?: number;
  borderRadius?: string;
  opacity?: number;
  filled?: boolean;
}) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        width,
        height,
        top,
        left,
        right,
        bottom,
        borderRadius,
        border: `1.5px solid rgba(255,255,255,${opacity + 0.08})`,
        bgcolor: filled ? `rgba(255,255,255,${opacity})` : "transparent",
        transform: `rotate(${rotate}deg)`,
        pointerEvents: "none",
      }}
    />
  );
}

function AuthLayoutComponent({ children, mode = "login" }: AuthLayoutProps) {
  const isLogin = mode === "login";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "var(--surface-base)",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          width: "42%",
          flexShrink: 0,
          background:
            "linear-gradient(150deg, #064e3b 0%, #065f46 35%, #0d9488 80%, #059669 100%)",
          position: "relative",
          overflow: "hidden",
          p: 4,
          pb: 5,
        }}
      >
        <DecorShape
          width={130}
          height={100}
          top={30}
          right={40}
          rotate={22}
          opacity={0.14}
        />
        <DecorShape
          width={85}
          height={65}
          top={100}
          right={-15}
          rotate={12}
          opacity={0.12}
        />
        <DecorShape
          width={52}
          height={52}
          top="42%"
          left={22}
          rotate={6}
          borderRadius="12px"
          opacity={0.14}
        />
        <DecorShape
          width={68}
          height={68}
          bottom={90}
          right={50}
          rotate={18}
          opacity={0.12}
        />
        <DecorShape
          width={200}
          height={200}
          bottom={-80}
          left={-70}
          rotate={0}
          borderRadius="50%"
          opacity={0.1}
          filled
        />

        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Logo size="sm" href={null} />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            px: 4,
          }}
        >
          <Typography
            level="h2"
            sx={{
              color: "#fff",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
              mb: 2,
              fontSize: "2rem",
            }}
          >
            {isLogin ? "Welcome Back!" : "Hello, Friend!"}
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.7,
              mb: 4,
              maxWidth: 300,
              fontSize: "0.9375rem",
            }}
          >
            {isLogin
              ? "Continue building your professional story with Dossier."
              : "Join Dossier and create a compelling biography that truly represents you."}
          </Typography>
          <Button
            component={NextLink}
            href={isLogin ? "/signup" : "/login"}
            variant="outlined"
            sx={{
              borderColor: "rgba(255,255,255,0.45)",
              color: "#fff",
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontSize: "0.8125rem",
              px: 3.5,
              py: 1.25,
              borderRadius: "var(--layout-radius-sm)",
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.75)",
              },
            }}
          >
            {isLogin ? "SIGN UP" : "SIGN IN"}
          </Button>
        </Box>

        <Box
          sx={{
            height: "1px",
            bgcolor: "rgba(255,255,255,0.12)",
            mx: 1,
            mb: 3.5,
            position: "relative",
            zIndex: 2,
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "var(--surface-raised)",
          borderRadius: { md: "24px 0 0 24px" },
          ml: { md: "-24px" },
          px: { xs: 3, sm: 5, md: 7 },
          py: { xs: 5, md: 6 },
          position: "relative",
          zIndex: 1,
          overflowY: "auto",
          minHeight: { xs: "100vh", md: 0 },
          boxShadow: { md: "-8px 0 48px rgba(0,0,0,0.32)" },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420 }}>{children}</Box>
      </Box>
    </Box>
  );
}

export const AuthLayout = memo(AuthLayoutComponent);
