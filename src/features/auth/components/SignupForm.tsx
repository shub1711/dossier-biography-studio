"use client";

import { memo, useCallback, useState } from "react";
import {
  Alert,
  Box,
  Button,
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
import { signupSchema, type SignupFormValues } from "@/lib/validators";
import { useSignup } from "../hooks/useSignup";
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

function SignupFormComponent() {
  const signupMutation = useSignup();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { full_name: "", email: "", password: "", confirm_password: "" },
  });

  const onSubmit = form.handleSubmit(
    useCallback(
      async (values: SignupFormValues) => {
        setSubmitError(null);
        try {
          await signupMutation.mutateAsync({
            full_name: values.full_name,
            email: values.email,
            password: values.password,
          });
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : "Sign up failed");
        }
      },
      [signupMutation]
    )
  );

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Typography
        level="h3"
        sx={{ fontWeight: 700, letterSpacing: "-0.03em", mb: 0.75, color: "var(--text-primary)" }}
      >
        Create an account
      </Typography>
      <Typography level="body-sm" sx={{ color: "var(--text-secondary)", mb: 3.5, lineHeight: 1.6 }}>
        Get started with Dossier in seconds.
      </Typography>

      {submitError ? (
        <Alert color="danger" variant="soft" sx={{ mb: 2.5, fontSize: "var(--font-size-sm)", borderRadius: "var(--layout-radius-sm)" }}>
          {submitError}
        </Alert>
      ) : null}

      <Stack spacing={2.5}>
        <FormControl error={Boolean(form.formState.errors.full_name)}>
          <FormLabel sx={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>Full Name</FormLabel>
          <Input
            placeholder="Jane Smith"
            size="md"
            {...form.register("full_name")}
            sx={{ "--Input-focusedHighlight": "var(--brand-accent)" }}
          />
          {form.formState.errors.full_name ? (
            <FormHelperText>{form.formState.errors.full_name.message}</FormHelperText>
          ) : null}
        </FormControl>

        <FormControl error={Boolean(form.formState.errors.email)}>
          <FormLabel sx={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>Email</FormLabel>
          <Input
            type="email"
            placeholder="john@example.com"
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
            placeholder="Create a strong password"
            size="md"
            {...form.register("password")}
            sx={{ "--Input-focusedHighlight": "var(--brand-accent)" }}
          />
          {form.formState.errors.password ? (
            <FormHelperText>{form.formState.errors.password.message}</FormHelperText>
          ) : null}
        </FormControl>

        <FormControl error={Boolean(form.formState.errors.confirm_password)}>
          <FormLabel sx={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Repeat your password"
            size="md"
            {...form.register("confirm_password")}
            sx={{ "--Input-focusedHighlight": "var(--brand-accent)" }}
          />
          {form.formState.errors.confirm_password ? (
            <FormHelperText>{form.formState.errors.confirm_password.message}</FormHelperText>
          ) : null}
        </FormControl>

        <Button type="submit" loading={signupMutation.isPending} fullWidth size="md" sx={submitButtonSx}>
          Create Account
        </Button>
      </Stack>

      <SocialAuthSection />

      <Typography level="body-sm" sx={{ mt: 3, textAlign: "center", color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link
          component={NextLink}
          href="/login"
          sx={{ color: "var(--brand-accent)", fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
        >
          Sign in here
        </Link>
      </Typography>
    </Box>
  );
}

export const SignupForm = memo(SignupFormComponent);
