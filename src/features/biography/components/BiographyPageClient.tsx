"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { Sparkle, FileText, ArrowClockwise } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/core/Skeleton";
import { BIOGRAPHY_SECTION_FIELDS } from "@/lib/llm/schemas";
import { biographyFormSchema, type BiographyFormValues } from "@/lib/validators";
import { profileToFormValues } from "../api";
import { BiographySectionCard } from "./BiographySectionCard";
import { useBiographyProfile, biographyQueryKey } from "../hooks/useBiographyProfile";

const GenerateBiographyModal = dynamic(
  () => import("./GenerateBiographyModal").then((m) => ({ default: m.GenerateBiographyModal })),
  { ssr: false }
);
import { useGenerateBiography } from "../hooks/useGenerateBiography";
import { useSaveBiography } from "../hooks/useSaveBiography";
import { useRewriteSection } from "../hooks/useRewriteSection";
import { useJobStatus } from "../hooks/useJobStatus";
import {
  biographyUiInitialState,
  type BiographyUiState,
} from "../types";

const emptyFormValues: BiographyFormValues = {
  subject_name: "",
  personal_overview: "",
  origin_story: "",
  career_journey: "",
  current_focus: "",
  areas_of_expertise: "",
  notable_achievements: "",
  career_highlights: "",
  personal_interests: "",
};

function BiographyPageClientComponent() {
  const queryClient = useQueryClient();
  const [ui, setUi] = useState<BiographyUiState>(biographyUiInitialState);

  const updateUi = useCallback((patch: Partial<BiographyUiState>) => {
    setUi((prev) => ({ ...prev, ...patch }));
  }, []);

  const profileQuery = useBiographyProfile();
  const generateMutation = useGenerateBiography();
  const saveMutation = useSaveBiography();
  const rewriteMutation = useRewriteSection();
  const jobQuery = useJobStatus(ui.activeJobId);

  const form = useForm<BiographyFormValues>({
    resolver: zodResolver(biographyFormSchema),
    defaultValues: emptyFormValues,
    mode: "onChange",
  });

  const { isDirty, isValid } = useFormState({ control: form.control });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset(profileToFormValues(profileQuery.data));
    }
  }, [profileQuery.data, form]);

  useEffect(() => {
    if (jobQuery.data?.status === "completed") {
      updateUi({ activeJobId: null, isFreshlyGenerated: true });
      queryClient.invalidateQueries({ queryKey: biographyQueryKey });
      toast.success("Biography generated successfully");
    }
    if (jobQuery.data?.status === "failed") {
      updateUi({ activeJobId: null });
      toast.error(jobQuery.data.error_message ?? "Generation failed");
    }
  }, [jobQuery.data, queryClient, updateUi]);

  const hasProfile = Boolean(profileQuery.data);
  const isGenerating =
    generateMutation.isPending ||
    Boolean(
      ui.activeJobId &&
        jobQuery.data &&
        !["completed", "failed"].includes(jobQuery.data.status)
    );

  const sourceLabel = useMemo(() => {
    const sourceType = profileQuery.data?.source_type;
    if (sourceType === "profile_url") return "Profile URL";
    if (sourceType === "pasted_text") return "Pasted Text";
    return null;
  }, [profileQuery.data?.source_type]);

  const openGenerateFlow = useCallback(() => {
    if (hasProfile) {
      updateUi({ confirmUpdateOpen: true });
      return;
    }
    updateUi({ modalOpen: true });
  }, [hasProfile, updateUi]);

  const handleGenerate = useCallback(
    async (mode: "text" | "url", value: string) => {
      const result = await generateMutation.mutateAsync({ mode, value });
      form.reset(profileToFormValues(result.profile));
      updateUi({
        activeJobId: result.job_id,
        isFreshlyGenerated: true,
        modalOpen: false,
      });
    },
    [generateMutation, form, updateUi]
  );

  const handleRewrite = useCallback(
    async (fieldKey: keyof BiographyFormValues, label: string, instruction: string) => {
      const current = form.getValues(fieldKey) ?? "";
      updateUi({ rewritingField: fieldKey });
      try {
        const result = await rewriteMutation.mutateAsync({
          section_name: label,
          current_text: String(current),
          user_instruction: instruction,
        });
        form.setValue(fieldKey, result.new_text, { shouldDirty: true });
      } finally {
        updateUi({ rewritingField: null });
      }
    },
    [form, rewriteMutation, updateUi]
  );

  const handleSave = useCallback(
    (values: BiographyFormValues) => {
      saveMutation.mutate(values, {
        onSuccess: (profile) => {
          form.reset(profileToFormValues(profile));
          updateUi({ isFreshlyGenerated: false });
        },
      });
    },
    [saveMutation, form, updateUi]
  );

  const handleCancel = useCallback(() => {
    if (profileQuery.data) {
      form.reset(profileToFormValues(profileQuery.data));
      updateUi({ isFreshlyGenerated: false });
    }
  }, [profileQuery.data, form, updateUi]);

  if (profileQuery.isLoading) {
    return <Skeleton variant="page" />;
  }

  if (profileQuery.isError) {
    return (
      <Box className="page-shell">
        <Alert color="danger" variant="soft" sx={{ borderRadius: "var(--layout-radius-md)" }}>
          Failed to load biography.{" "}
          <Button size="sm" variant="soft" color="danger" onClick={() => profileQuery.refetch()}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="page-shell">
      <Box className="page-header">
        <Box className="page-header__content">
          <Typography component="h1" className="page-title">
            Your Biography
          </Typography>
          <Typography component="p" className="page-subtitle">
            Generate a structured dossier from a profile URL or pasted text, then review,
            rewrite, and save.
          </Typography>
        </Box>

        <Button
          startDecorator={
            isGenerating ? undefined : hasProfile ? (
              <ArrowClockwise size={15} weight="bold" />
            ) : (
              <Sparkle size={15} weight="fill" />
            )
          }
          onClick={openGenerateFlow}
          loading={isGenerating}
          size="md"
          sx={{
            flexShrink: 0,
            bgcolor: "var(--brand-accent)",
            color: "#fff",
            fontWeight: 600,
            px: 2.5,
            boxShadow: "var(--shadow-accent)",
            "&:hover": {
              bgcolor: "var(--brand-accent-hover)",
              boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
            },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          {hasProfile ? "Regenerate" : "Generate"}
        </Button>
      </Box>

      {isGenerating ? (
        <Alert
          variant="soft"
          color="success"
          sx={{
            mb: 3,
            borderRadius: "var(--layout-radius-md)",
            border: "1px solid var(--brand-accent-border)",
            bgcolor: "var(--brand-accent-muted)",
          }}
          startDecorator={
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "var(--brand-accent)",
                animation: "pulse-accent 1.5s ease-in-out infinite",
              }}
            />
          }
        >
          <Typography sx={{ fontSize: "var(--font-size-sm)", color: "var(--brand-accent)" }}>
            Generating your biography — this may take a moment...
          </Typography>
        </Alert>
      ) : null}

      {!hasProfile && !isGenerating ? (
        <Box
          className="empty-state"
          sx={{
            py: 10,
            textAlign: "center",
            borderRadius: "var(--layout-radius-lg)",
            border: "1px dashed var(--surface-border-accent)",
            bgcolor: "var(--brand-accent-muted)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(16,185,129,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            },
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "var(--layout-radius-md)",
              bgcolor: "var(--brand-accent-muted)",
              border: "1px solid var(--brand-accent-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2.5,
              boxShadow: "var(--shadow-accent)",
            }}
          >
            <FileText size={28} color="var(--brand-accent)" />
          </Box>
          <Typography
            level="title-md"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em", mb: 1 }}
          >
            No biography yet
          </Typography>
          <Typography
            level="body-sm"
            textColor="text.secondary"
            sx={{ mb: 3, maxWidth: 340, mx: "auto", lineHeight: "var(--line-height-relaxed)" }}
          >
            Generate a structured biography from your LinkedIn profile URL or by pasting your resume text.
          </Typography>
          <Button
            variant="outlined"
            size="md"
            startDecorator={<Sparkle size={15} weight="fill" />}
            onClick={() => updateUi({ modalOpen: true })}
            sx={{
              borderColor: "var(--brand-accent-border)",
              color: "var(--brand-accent)",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "var(--brand-accent-muted)",
                borderColor: "var(--brand-accent)",
              },
            }}
          >
            Generate your biography
          </Button>
        </Box>
      ) : null}

      {hasProfile ? (
        <>
          {ui.isFreshlyGenerated ? (
            <Alert
              color="warning"
              variant="soft"
              sx={{
                mb: 3,
                borderRadius: "var(--layout-radius-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              Biography generated — review all sections below and save when ready.
            </Alert>
          ) : null}

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
              mb: 3,
            }}
          >
            {sourceLabel ? (
              <Chip
                size="sm"
                variant="soft"
                color="success"
                sx={{ fontWeight: 500 }}
              >
                {sourceLabel}
              </Chip>
            ) : null}
            {profileQuery.data?.biography_job_id ? (
              <Chip
                size="sm"
                variant="outlined"
                color="neutral"
                sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}
              >
                {profileQuery.data.biography_job_id.slice(0, 8)}…
              </Chip>
            ) : null}
          </Box>

          <Typography
            level="body-sm"
            textColor="text.tertiary"
            sx={{ mb: 2.5, fontSize: "var(--font-size-sm)" }}
          >
            Edit any section directly, or use the{" "}
            <Typography component="span" sx={{ color: "var(--brand-accent)", fontWeight: 500 }}>
              Rewrite
            </Typography>{" "}
            button with an instruction. Changes are local until you click Save.
          </Typography>

          <Stack spacing={2} sx={{ mb: 3, pb: 12 }}>
            {BIOGRAPHY_SECTION_FIELDS.map((field) => (
              <BiographySectionCard
                key={field.key}
                fieldKey={field.key}
                label={field.label}
                type={field.type}
                value={String(form.watch(field.key) ?? "")}
                provenance={profileQuery.data?.section_provenance?.[field.key]}
                onChange={(value) =>
                  form.setValue(field.key, value, { shouldDirty: true })
                }
                onRewrite={(instruction) =>
                  handleRewrite(field.key, field.label, instruction)
                }
                isRewriting={ui.rewritingField === field.key}
              />
            ))}
          </Stack>

          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              zIndex: 10,
              display: "flex",
              gap: 1.5,
              justifyContent: "flex-end",
              alignItems: "center",
              flexWrap: "wrap",
              py: 2,
              px: 2,
              mt: -2,
              mx: { xs: -2, md: -3 },
              borderTop: "1px solid var(--surface-border)",
              bgcolor: "var(--surface-base)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {!isDirty ? (
              <Typography
                level="body-xs"
                sx={{
                  mr: "auto",
                  color: "var(--text-tertiary)",
                  fontSize: "var(--font-size-xs)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "var(--text-tertiary)",
                    display: "inline-block",
                  }}
                />
                All changes saved
              </Typography>
            ) : (
              <Typography
                level="body-xs"
                sx={{
                  mr: "auto",
                  color: "var(--brand-accent)",
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "var(--brand-accent)",
                    display: "inline-block",
                    animation: "pulse-accent 2s ease-in-out infinite",
                  }}
                />
                Unsaved changes
              </Typography>
            )}
            <Button
              variant="outlined"
              color="neutral"
              size="sm"
              onClick={handleCancel}
              disabled={!isDirty || saveMutation.isPending}
              sx={{
                fontWeight: 500,
                "&:disabled": { opacity: 0.4 },
              }}
            >
              Discard
            </Button>
            <Button
              loading={saveMutation.isPending}
              size="sm"
              onClick={form.handleSubmit(handleSave)}
              disabled={!isDirty || !isValid}
              sx={{
                bgcolor: "var(--brand-accent)",
                color: "#fff",
                fontWeight: 600,
                boxShadow: isDirty ? "var(--shadow-accent)" : "none",
                "&:hover": { bgcolor: "var(--brand-accent-hover)" },
                "&:disabled": { opacity: 0.4 },
              }}
            >
              Save changes
            </Button>
          </Box>
        </>
      ) : null}

      <GenerateBiographyModal
        open={ui.modalOpen}
        onClose={() => updateUi({ modalOpen: false })}
        isSubmitting={generateMutation.isPending}
        onGenerateFromText={(sourceText) => handleGenerate("text", sourceText)}
        onGenerateFromUrl={(sourceUrl) => handleGenerate("url", sourceUrl)}
      />

      <Modal
        open={ui.confirmUpdateOpen}
        onClose={() => updateUi({ confirmUpdateOpen: false })}
      >
        <ModalDialog
          sx={{
            bgcolor: "var(--surface-overlay)",
            maxWidth: 420,
            width: "95vw",
          }}
        >
          <Typography
            level="h4"
            sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            Regenerate Biography?
          </Typography>
          <Typography level="body-sm" textColor="text.secondary" sx={{ mt: 0.75 }}>
            This will replace your current biography. Any unsaved edits will be lost.
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="outlined"
              color="neutral"
              size="sm"
              onClick={() => updateUi({ confirmUpdateOpen: false })}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              color="warning"
              sx={{ fontWeight: 600 }}
              onClick={() =>
                updateUi({ confirmUpdateOpen: false, modalOpen: true })
              }
            >
              Continue
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}

export const BiographyPageClient = memo(BiographyPageClientComponent);
