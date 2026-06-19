"use client";

import { memo, useCallback, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { MagicWand, X } from "@phosphor-icons/react";
import type { BiographySectionKey } from "@/lib/llm/schemas";
import type { SectionProvenance } from "../types";

type BiographySectionCardProps = {
  fieldKey: BiographySectionKey;
  label: string;
  type: "input" | "textarea";
  value: string;
  provenance?: SectionProvenance[keyof SectionProvenance];
  onChange: (value: string) => void;
  onRewrite: (instruction: string) => Promise<void>;
  isRewriting?: boolean;
};

const rewriteInitialState = {
  instruction: "",
  showRewrite: false,
};

function BiographySectionCardComponent({
  label,
  type,
  value,
  provenance,
  onChange,
  onRewrite,
  isRewriting = false,
}: BiographySectionCardProps) {
  const [rewriteState, setRewriteState] = useState(rewriteInitialState);

  const updateRewriteState = useCallback(
    (patch: Partial<typeof rewriteInitialState>) => {
      setRewriteState((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const handleRewrite = useCallback(async () => {
    if (!rewriteState.instruction.trim()) return;
    await onRewrite(rewriteState.instruction.trim());
    updateRewriteState({ instruction: "", showRewrite: false });
  }, [onRewrite, rewriteState.instruction, updateRewriteState]);

  return (
    <Box
      className="section-card"
      sx={{
        p: 3,
        borderRadius: "var(--layout-radius-md)",
        border: "1px solid var(--surface-border)",
        bgcolor: "var(--surface-raised)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: "var(--surface-border-accent)",
          boxShadow: "var(--shadow-sm)",
        },
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
            <Typography
              level="title-sm"
              sx={{
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "var(--text-primary)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              {label}
            </Typography>
            {provenance ? (
              <Chip
                size="sm"
                variant="soft"
                color={provenance === "known" ? "success" : "warning"}
                aria-label={`${label} content is ${provenance}`}
                sx={{ fontWeight: 500 }}
              >
                {provenance === "known" ? "Known" : "Inferred"}
              </Chip>
            ) : null}
          </Box>
          <Button
            size="sm"
            variant="plain"
            color="neutral"
            startDecorator={<MagicWand size={13} />}
            onClick={() =>
              updateRewriteState({ showRewrite: !rewriteState.showRewrite })
            }
            sx={{
              fontSize: "var(--font-size-xs)",
              fontWeight: 500,
              color: "var(--text-secondary)",
              letterSpacing: "0.01em",
              px: 1,
              gap: 0.5,
              "&:hover": {
                bgcolor: "var(--brand-accent-muted)",
                color: "var(--brand-accent)",
              },
              flexShrink: 0,
            }}
          >
            Rewrite
          </Button>
        </Box>

        <FormControl>
          {type === "input" ? (
            <Input
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              sx={{
                bgcolor: "transparent",
                "--Input-focusedHighlight": "var(--brand-accent)",
              }}
            />
          ) : (
            <Textarea
              minRows={3}
              maxRows={8}
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              sx={{
                bgcolor: "transparent",
                lineHeight: "var(--line-height-relaxed)",
                "--Textarea-focusedHighlight": "var(--brand-accent)",
              }}
            />
          )}
        </FormControl>

        {rewriteState.showRewrite ? (
          <Box
            sx={{
              p: 2,
              borderRadius: "var(--layout-radius-sm)",
              bgcolor: "var(--brand-accent-muted)",
              border: "1px solid var(--brand-accent-border)",
              animation: "slideDown 0.15s ease both",
            }}
          >
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <FormLabel
                  sx={{
                    fontSize: "var(--font-size-xs)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--brand-accent)",
                    mb: 0,
                  }}
                >
                  Rewrite direction
                </FormLabel>
                <Button
                  size="sm"
                  variant="plain"
                  color="neutral"
                  onClick={() => updateRewriteState({ showRewrite: false, instruction: "" })}
                  sx={{
                    minWidth: 0,
                    px: 0.5,
                    color: "var(--text-tertiary)",
                    "&:hover": { color: "var(--text-secondary)", bgcolor: "transparent" },
                  }}
                >
                  <X size={14} />
                </Button>
              </Box>
              <Input
                placeholder="e.g. Make this shorter and focus on leadership"
                value={rewriteState.instruction}
                onChange={(e) => updateRewriteState({ instruction: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleRewrite();
                  }
                }}
                sx={{
                  bgcolor: "var(--surface-raised)",
                  "--Input-focusedHighlight": "var(--brand-accent)",
                }}
              />
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  size="sm"
                  loading={isRewriting}
                  onClick={handleRewrite}
                  disabled={!rewriteState.instruction.trim()}
                  sx={{
                    bgcolor: "var(--brand-accent)",
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "var(--brand-accent-hover)" },
                    "&:disabled": { opacity: 0.5 },
                  }}
                >
                  Apply
                </Button>
              </Box>
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}

export const BiographySectionCard = memo(BiographySectionCardComponent);
