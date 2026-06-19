import { NextResponse } from "next/server";
import { z } from "zod";
import { generateBiographyFromText } from "@/lib/llm/provider";
import {
  createLlmJob,
  markJobCompleted,
  markJobFailed,
  markJobRunning,
  upsertBiographyProfile,
} from "@/lib/biography/service";
import { requireAppUser as requireUser } from "@/lib/auth/require-app-user";
import { toErrorMessage } from "@/lib/error-message";

const bodySchema = z.object({
  source_text: z.string().min(1).max(100000),
  source_type: z.enum(["pasted_text", "profile_url"]).default("pasted_text"),
  source_url: z.string().url().optional().nullable(),
});

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { source_text, source_type, source_url } = parsed.data;
  const jobId = await createLlmJob({
    customerId: auth.user.customer_id,
    userId: auth.user.user_id,
    jobType: "biography-generate-profile-from-text",
    inputRef: { source_type, source_url, source_text_length: source_text.length },
  });

  try {
    await markJobRunning(jobId);
    const sections = await generateBiographyFromText(source_text);
    const profile = await upsertBiographyProfile({
      customerId: auth.user.customer_id,
      userId: auth.user.user_id,
      sourceType: source_type,
      sourceUrl: source_url,
      sourceText: source_text,
      sections,
      jobId,
    });
    await markJobCompleted(jobId, {
      biography_profile_id: profile.biography_profile_id,
      sections_generated: 9,
      section_provenance: sections.section_provenance ?? null,
    });

    return NextResponse.json({ job_id: jobId, profile });
  } catch (error) {
    const message = toErrorMessage(error, "Biography generation failed");
    await markJobFailed(jobId, message);
    return NextResponse.json({ error: message, job_id: jobId }, { status: 500 });
  }
}
