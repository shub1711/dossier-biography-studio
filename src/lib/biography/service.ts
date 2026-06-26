import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const { data, error } = await supabase
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
  const supabase = await createClient();
  await supabase
    .from("llm_jobs")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("llm_job_id", jobId);
}

export async function markJobCompleted(
  jobId: string,
  resultRef: Record<string, unknown>
) {
  const supabase = await createClient();
  await supabase
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
  const supabase = await createClient();
  await supabase
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
  return errorMessageIncludes(error, "section_provenance");
}

function isMissingVersionsTable(error: unknown): boolean {
  return errorMessageIncludes(error, "biography_profile_versions");
}

function errorMessageIncludes(error: unknown, needle: string): boolean {
  if (!error || typeof error !== "object") return false;
  const message =
    "message" in error ? String((error as { message?: string }).message) : "";
  return message.includes(needle);
}

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function snapshotCurrentProfile(
  supabase: SupabaseClient,
  params: { customerId: string; userId: string }
) {
  const { data: existing, error } = await supabase
    .from("biography_profiles")
    .select("*")
    .eq("user_id", params.userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (!existing) return;

  const { data: latest, error: latestError } = await supabase
    .from("biography_profile_versions")
    .select("version_number")
    .eq("biography_profile_id", existing.biography_profile_id)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) {
    if (isMissingVersionsTable(latestError)) return;
    throw latestError;
  }

  const nextVersion = (latest?.version_number ?? 0) + 1;

  const { error: insertError } = await supabase
    .from("biography_profile_versions")
    .insert({
      customer_id: params.customerId,
      biography_profile_id: existing.biography_profile_id,
      version_number: nextVersion,
      snapshot_json: existing,
      change_summary: "Snapshot before biography update",
      created_by: params.userId,
    });

  if (insertError && !isMissingVersionsTable(insertError)) throw insertError;
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
  const supabase = await createClient();

  await snapshotCurrentProfile(supabase, {
    customerId: params.customerId,
    userId: params.userId,
  });

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

  let { data, error } = await supabase
    .from("biography_profiles")
    .upsert(row, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error && isMissingProvenanceColumn(error)) {
    const { section_provenance: _provenance, ...rowWithoutProvenance } = row;
    ({ data, error } = await supabase
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
