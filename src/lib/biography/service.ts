import { createAdminClient } from "@/lib/supabase/admin";
import type { BiographySections } from "@/lib/llm/schemas";

export type AppUser = {
  user_id: string;
  customer_id: string;
  email: string;
};

export async function resolveAppUser(authUserId: string): Promise<AppUser | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("users")
    .select("user_id, customer_id, email")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createLlmJob(params: {
  customerId: string;
  userId: string;
  jobType: string;
  inputRef: Record<string, unknown>;
}) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("llm_jobs")
    .insert({
      customer_id: params.customerId,
      user_id: params.userId,
      job_type: params.jobType,
      status: "queued",
      input_ref: params.inputRef,
    })
    .select("llm_job_id")
    .single();

  if (error) throw error;
  return data.llm_job_id as string;
}

export async function markJobRunning(jobId: string) {
  const admin = createAdminClient();
  await admin
    .from("llm_jobs")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("llm_job_id", jobId);
}

export async function markJobCompleted(
  jobId: string,
  resultRef: Record<string, unknown>
) {
  const admin = createAdminClient();
  await admin
    .from("llm_jobs")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      result_ref: resultRef,
      updated_at: new Date().toISOString(),
    })
    .eq("llm_job_id", jobId);
}

export async function markJobFailed(jobId: string, errorMessage: string) {
  const admin = createAdminClient();
  await admin
    .from("llm_jobs")
    .update({
      status: "failed",
      error_message: errorMessage,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("llm_job_id", jobId);
}

function isMissingProvenanceColumn(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const message =
    "message" in error ? String((error as { message?: string }).message) : "";
  return message.includes("section_provenance");
}

export async function upsertBiographyProfile(params: {
  customerId: string;
  userId: string;
  sourceType: "profile_url" | "pasted_text";
  sourceUrl?: string | null;
  sourceText?: string | null;
  sections: BiographySections;
  jobId: string;
}) {
  const admin = createAdminClient();
  const row = {
    customer_id: params.customerId,
    user_id: params.userId,
    source_type: params.sourceType,
    source_url: params.sourceUrl ?? null,
    source_text: params.sourceText ?? null,
    subject_name: params.sections.subject_name,
    personal_overview: params.sections.personal_overview,
    origin_story: params.sections.origin_story,
    career_journey: params.sections.career_journey,
    current_focus: params.sections.current_focus,
    areas_of_expertise: params.sections.areas_of_expertise,
    notable_achievements: params.sections.notable_achievements,
    career_highlights: params.sections.career_highlights,
    personal_interests: params.sections.personal_interests,
    section_provenance: params.sections.section_provenance ?? null,
    biography_job_id: params.jobId,
    created_by: params.userId,
    updated_by: params.userId,
    updated_at: new Date().toISOString(),
  };

  let { data, error } = await admin
    .from("biography_profiles")
    .upsert(row, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error && isMissingProvenanceColumn(error)) {
    const { section_provenance: _provenance, ...rowWithoutProvenance } = row;
    ({ data, error } = await admin
      .from("biography_profiles")
      .upsert(rowWithoutProvenance, { onConflict: "user_id" })
      .select("*")
      .single());
  }

  if (error) {
    throw error;
  }
  return data;
}
