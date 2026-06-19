import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchDiffbotProfile } from "@/lib/diffbot";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { toErrorMessage } from "@/lib/error-message";
import {
  createLlmJob,
  markJobCompleted,
  markJobFailed,
  markJobRunning,
  upsertBiographyProfile,
} from "@/lib/biography/service";
import { generateBiographyFromText } from "@/lib/llm/provider";

const bodySchema = z.object({
  source_url: z.string().url(),
});

export async function POST(request: Request) {
  const auth = await requireAppUser();
  if (auth instanceof NextResponse) return auth;

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { source_url } = parsed.data;
  const jobId = await createLlmJob({
    customerId: auth.user.customer_id,
    userId: auth.user.user_id,
    jobType: "biography-fetch-profile-from-url",
    inputRef: { source_url },
  });

  try {
    await markJobRunning(jobId);
    const diffbotText = await fetchDiffbotProfile(source_url);
    const sections = await generateBiographyFromText(diffbotText);
    const profile = await upsertBiographyProfile({
      customerId: auth.user.customer_id,
      userId: auth.user.user_id,
      sourceType: "profile_url",
      sourceUrl: source_url,
      sourceText: diffbotText,
      sections,
      jobId,
    });
    await markJobCompleted(jobId, {
      biography_profile_id: profile.biography_profile_id,
      source_url,
      section_provenance: sections.section_provenance ?? null,
    });

    return NextResponse.json({ job_id: jobId, profile });
  } catch (error) {
    const message = toErrorMessage(error, "Profile URL fetch failed");
    await markJobFailed(jobId, message);
    return NextResponse.json({ error: message, job_id: jobId }, { status: 500 });
  }
}
