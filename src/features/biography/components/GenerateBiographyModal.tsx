"use client";

import { memo, useCallback, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalClose,
  ModalDialog,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Typography,
} from "@mui/joy";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Input from "@mui/joy/Input";
import { Link, FileText, Sparkle } from "@phosphor-icons/react";
import {
  generateTextSchema,
  generateUrlSchema,
} from "@/lib/validators";

type GenerateBiographyModalProps = {
  open: boolean;
  onClose: () => void;
  onGenerateFromText: (sourceText: string) => Promise<void>;
  onGenerateFromUrl: (sourceUrl: string) => Promise<void>;
  isSubmitting: boolean;
};

const modalInitialState = {
  activeTab: 0,
  submitError: null as string | null,
};

function GenerateBiographyModalComponent({
  open,
  onClose,
  onGenerateFromText,
  onGenerateFromUrl,
  isSubmitting,
}: GenerateBiographyModalProps) {
  const [modalState, setModalState] = useState(modalInitialState);

  const updateModalState = useCallback(
    (patch: Partial<typeof modalInitialState>) => {
      setModalState((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const urlForm = useForm({
    resolver: zodResolver(generateUrlSchema),
    defaultValues: { source_url: "" },
  });

  const textForm = useForm({
    resolver: zodResolver(generateTextSchema),
    defaultValues: { source_text: "" },
  });

  const handleUrlSubmit = urlForm.handleSubmit(async (values) => {
    updateModalState({ submitError: null });
    try {
      await onGenerateFromUrl(values.source_url);
      onClose();
    } catch (error) {
      updateModalState({
        submitError: error instanceof Error ? error.message : "Generation failed",
      });
    }
  });

  const handleTextSubmit = textForm.handleSubmit(async (values) => {
    updateModalState({ submitError: null });
    try {
      await onGenerateFromText(values.source_text);
      onClose();
    } catch (error) {
      updateModalState({
        submitError: error instanceof Error ? error.message : "Generation failed",
      });
    }
  });

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          width: { xs: "95vw", sm: "560px" },
          maxWidth: "560px",
          maxHeight: "92vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          bgcolor: "var(--surface-overlay)",
          border: "1px solid var(--surface-border)",
          boxShadow: "var(--shadow-modal)",
          p: 0,
        }}
      >
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 2.5,
            borderBottom: "1px solid var(--surface-border)",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <ModalClose
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              borderRadius: "var(--layout-radius-xs)",
              color: "var(--text-secondary)",
              "&:hover": { bgcolor: "var(--surface-border)", color: "var(--text-primary)" },
            }}
          />
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "var(--layout-radius-sm)",
              bgcolor: "var(--brand-accent-muted)",
              border: "1px solid var(--brand-accent-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.75,
            }}
          >
            <Sparkle size={20} color="var(--brand-accent)" weight="fill" />
          </Box>
          <Typography
            level="h4"
            sx={{ fontWeight: 700, letterSpacing: "-0.03em", mb: 0.5 }}
          >
            Generate Biography
          </Typography>
          <Typography level="body-sm" textColor="text.secondary">
            Create a structured biography from a profile URL or pasted text.
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            scrollbarGutter: "stable",
            px: 3,
            py: 2.5,
          }}
        >
          {modalState.submitError ? (
            <Alert color="danger" variant="soft" sx={{ mb: 2.5, fontSize: "var(--font-size-sm)" }}>
              {modalState.submitError}
            </Alert>
          ) : null}

          <Tabs
            value={modalState.activeTab}
            onChange={(_, value) => updateModalState({ activeTab: value as number })}
            sx={{ "--Tab-indicatorThickness": "2px" }}
          >
            <TabList
              sx={{
                bgcolor: "var(--surface-raised)",
                borderRadius: "var(--layout-radius-sm)",
                border: "1px solid var(--surface-border)",
                p: 0.5,
                gap: 0.5,
                "& .MuiTab-root": {
                  borderRadius: "var(--layout-radius-xs)",
                  fontWeight: 500,
                  fontSize: "var(--font-size-sm)",
                  transition: "all 0.15s ease",
                  flex: 1,
                  justifyContent: "center",
                },
                "& .Mui-selected": {
                  bgcolor: "var(--brand-accent-muted)",
                  color: "var(--brand-accent)",
                  boxShadow: "none",
                },
                "--Tab-indicatorColor": "transparent",
              }}
            >
              <Tab
                startDecorator={<Link size={14} />}
                disableIndicator
              >
                Profile URL
              </Tab>
              <Tab
                startDecorator={<FileText size={14} />}
                disableIndicator
              >
                Paste Text
              </Tab>
            </TabList>

            <TabPanel value={0} sx={{ p: 0, pt: 2.5 }}>
              <form onSubmit={handleUrlSubmit}>
                <FormControl error={Boolean(urlForm.formState.errors.source_url)}>
                  <FormLabel>Profile URL</FormLabel>
                  <Input
                    placeholder="https://linkedin.com/in/your-profile"
                    size="md"
                    startDecorator={<Link size={14} color="var(--text-tertiary)" />}
                    {...urlForm.register("source_url")}
                    sx={{ "--Input-focusedHighlight": "var(--brand-accent)" }}
                  />
                  {urlForm.formState.errors.source_url ? (
                    <FormHelperText>
                      {urlForm.formState.errors.source_url.message}
                    </FormHelperText>
                  ) : null}
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    justifyContent: "flex-end",
                    mt: 3,
                    pt: 2.5,
                    borderTop: "1px solid var(--surface-border)",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="neutral"
                    size="sm"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    loading={isSubmitting}
                    startDecorator={!isSubmitting ? <Sparkle size={14} weight="fill" /> : undefined}
                    sx={{
                      bgcolor: "var(--brand-accent)",
                      color: "#fff",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "var(--brand-accent-hover)" },
                    }}
                  >
                    Generate
                  </Button>
                </Box>
              </form>
            </TabPanel>

            <TabPanel value={1} sx={{ p: 0, pt: 2.5 }}>
              <form onSubmit={handleTextSubmit}>
                <FormControl error={Boolean(textForm.formState.errors.source_text)}>
                  <FormLabel>Paste biography or resume</FormLabel>
                  <Box
                    sx={{
                      maxHeight: "260px",
                      overflowY: "auto",
                      scrollbarGutter: "stable",
                      border: "1px solid var(--surface-border)",
                      borderRadius: "var(--layout-radius-sm)",
                      transition: "border-color 0.15s ease",
                      "&:focus-within": {
                        borderColor: "var(--brand-accent)",
                        boxShadow: "0 0 0 2px var(--brand-accent-muted)",
                      },
                    }}
                  >
                    <Textarea
                      minRows={10}
                      maxRows={10}
                      sx={{
                        width: "100%",
                        maxHeight: "none",
                        border: "none",
                        boxShadow: "none",
                        bgcolor: "transparent",
                        lineHeight: "var(--line-height-relaxed)",
                        fontSize: "var(--font-size-sm)",
                      }}
                      placeholder="Paste resume, short bio, LinkedIn About section, or any narrative text..."
                      {...textForm.register("source_text")}
                    />
                  </Box>
                  {textForm.formState.errors.source_text ? (
                    <FormHelperText>
                      {textForm.formState.errors.source_text.message}
                    </FormHelperText>
                  ) : null}
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    justifyContent: "flex-end",
                    mt: 3,
                    pt: 2.5,
                    borderTop: "1px solid var(--surface-border)",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="neutral"
                    size="sm"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    loading={isSubmitting}
                    startDecorator={!isSubmitting ? <Sparkle size={14} weight="fill" /> : undefined}
                    sx={{
                      bgcolor: "var(--brand-accent)",
                      color: "#fff",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "var(--brand-accent-hover)" },
                    }}
                  >
                    Generate
                  </Button>
                </Box>
              </form>
            </TabPanel>
          </Tabs>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

export const GenerateBiographyModal = memo(GenerateBiographyModalComponent);
