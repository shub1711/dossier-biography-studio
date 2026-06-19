import type { BiographyFormValues } from "@/lib/validators";
import { edgeFunctions } from "@/lib/supabase/edge-functions";
import type {
  BiographyProfile,
  GenerateResult,
  RewriteSectionPayload,
} from "./types";

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data as T;
}

export async function fetchBiographyProfile(): Promise<BiographyProfile | null> {
  const response = await fetch("/api/biography/profile");
  const data = await parseJson<{ profile: BiographyProfile | null }>(response);
  return data.profile;
}

export async function saveBiographyProfile(
  values: BiographyFormValues
): Promise<BiographyProfile> {
  const response = await fetch("/api/biography/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await parseJson<{ profile: BiographyProfile }>(response);
  return data.profile;
}

export async function generateFromText(source_text: string): Promise<GenerateResult> {
  return edgeFunctions.biography.generateFromText(source_text) as Promise<GenerateResult>;
}

export async function generateFromUrl(source_url: string): Promise<GenerateResult> {
  return edgeFunctions.biography.fetchFromUrl(source_url) as Promise<GenerateResult>;
}

export async function rewriteSection(
  params: RewriteSectionPayload
): Promise<{ new_text: string }> {
  return edgeFunctions.biography.rewriteSection(params);
}

export async function fetchJob(jobId: string) {
  const response = await fetch(`/api/biography/jobs/${jobId}`);
  return parseJson<{ job: { status: string; error_message: string | null } }>(
    response
  );
}

export function profileToFormValues(
  profile: BiographyProfile
): BiographyFormValues {
  return {
    subject_name: profile.subject_name,
    personal_overview: profile.personal_overview,
    origin_story: profile.origin_story,
    career_journey: profile.career_journey,
    current_focus: profile.current_focus,
    areas_of_expertise: profile.areas_of_expertise,
    notable_achievements: profile.notable_achievements,
    career_highlights: profile.career_highlights,
    personal_interests: profile.personal_interests,
  };
}
