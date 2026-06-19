"use client";

import { memo, useCallback, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import NextLink from "next/link";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { useLogin } from "../hooks/useLogin";
import { SocialAuthSection } from "./SocialAuthSection";

const submitButtonSx = {
  bgcolor: "var(--brand-accent)",
  color: "#fff",
  fontWeight: 700,
  letterSpacing: "0.01em",
  py: 1.5,
  fontSize: "var(--font-size-md)",
  "&:hover": { bgcolor: "var(--brand-accent-hover)" },
  "&:active": { transform: "scale(0.99)" },
  boxShadow: "var(--shadow-accent)",
} as const;

function LoginFormComponent() {
  const loginMutation = useLogin();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(
    useCallback(
      async (values: LoginFormValues) => {
        setSubmitError(null);
        try {
          await loginMutation.mutateAsync(values);
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Sign in failed");
        }
      },
      [loginMutation]
    )
  );

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Typography
        level="h3"
        sx={{ fontWeight: 700, letterSpacing: "-0.03em", mb: 0.75, color: "var(--text-primary)" }}
      >
        Sign in to Dossier
      </Typography>
      <Typography level="body-sm" sx={{ color: "var(--text-secondary)", mb: 3.5, lineHeight: 1.6 }}>
        Welcome back! Please enter your details.
      </Typography>

      {submitError ? (
        <Alert color="danger" variant="soft" sx={{ mb: 2.5, fontSize: "var(--font-size-sm)", borderRadius: "var(--layout-radius-sm)" }}>
          {submitError}
        </Alert>
      ) : null}

      <Stack spacing={2.5}>
        <FormControl error={Boolean(form.formState.errors.email)}>
          <FormLabel sx={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            size="md"
            {...form.register("email")}
            sx={{ "--Input-focusedHighlight": "var(--brand-accent)" }}
          />
          {form.formState.errors.email ? (
            <FormHelperText>{form.formState.errors.email.message}</FormHelperText>
          ) : null}
        </FormControl>

        <FormControl error={Boolean(form.formState.errors.password)}>
          <FormLabel sx={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            size="md"
            {...form.register("password")}
            sx={{ "--Input-focusedHighlight": "var(--brand-accent)" }}
          />
          {form.formState.errors.password ? (
            <FormHelperText>{form.formState.errors.password.message}</FormHelperText>
          ) : null}
        </FormControl>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Checkbox
            label="Remember me"
            size="sm"
            sx={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)", "--Checkbox-size": "16px" }}
          />
          <Link
            component="button"
            type="button"
            level="body-sm"
            onClick={(e) => e.preventDefault()}
            sx={{ color: "var(--brand-accent)", fontWeight: 600, fontSize: "var(--font-size-sm)", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Forgot Password?
          </Link>
        </Box>

        <Button type="submit" loading={loginMutation.isPending} fullWidth size="md" sx={submitButtonSx}>
          Sign In
        </Button>
      </Stack>

      <SocialAuthSection />

      <Typography level="body-sm" sx={{ mt: 3, textAlign: "center", color: "var(--text-secondary)" }}>
        Don&apos;t have an account?{" "}
        <Link
          component={NextLink}
          href="/signup"
          sx={{ color: "var(--brand-accent)", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
        >
          Sign up here
        </Link>
      </Typography>
    </Box>
  );
}

export const LoginForm = memo(LoginFormComponent);
