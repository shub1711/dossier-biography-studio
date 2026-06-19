export type SectionProvenance = Partial<
  Record<
    | "subject_name"
    | "personal_overview"
    | "origin_story"
    | "career_journey"
    | "current_focus"
    | "areas_of_expertise"
    | "notable_achievements"
    | "career_highlights"
    | "personal_interests",
    "known" | "inferred"
  >
>;

export type BiographyProfile = {
  biography_profile_id: string;
  customer_id: string;
  user_id: string;
  source_type: "profile_url" | "pasted_text";
  source_url: string | null;
  source_text: string | null;
  subject_name: string | null;
  personal_overview: string | null;
  origin_story: string | null;
  career_journey: string | null;
  current_focus: string | null;
  areas_of_expertise: string | null;
  notable_achievements: string | null;
  career_highlights: string | null;
  personal_interests: string | null;
  section_provenance: SectionProvenance | null;
  biography_job_id: string | null;
  created_at: string;
  updated_at: string | null;
};

export type LlmJob = {
  llm_job_id: string;
  status: "queued" | "running" | "waiting_llm" | "completed" | "failed";
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

export type GenerateResult = {
  job_id: string;
  profile: BiographyProfile;
};

export type RewriteSectionPayload = {
  section_name: string;
  current_text: string;
  user_instruction: string;
};

export type BiographyUiState = {
  modalOpen: boolean;
  confirmUpdateOpen: boolean;
  activeJobId: string | null;
  isFreshlyGenerated: boolean;
  rewritingField: string | null;
};

export const biographyUiInitialState: BiographyUiState = {
  modalOpen: false,
  confirmUpdateOpen: false,
  activeJobId: null,
  isFreshlyGenerated: false,
  rewritingField: null,
};
