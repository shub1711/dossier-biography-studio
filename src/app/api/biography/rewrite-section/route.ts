import { NextResponse } from "next/server";
import { z } from "zod";
import { rewriteBiographySection } from "@/lib/llm/provider";
import { requireAppUser } from "@/lib/auth/require-app-user";
import {
  createLlmJob,
  markJobCompleted,
  markJobFailed,
  markJobRunning,
} from "@/lib/biography/service";
import { toErrorMessage } from "@/lib/error-message";

const bodySchema = z.object({
  section_name: z.string().min(1),
  current_text: z.string(),
  user_instruction: z.string().min(1).max(2000),
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

  const { section_name, current_text, user_instruction } = parsed.data;

  const jobId = await createLlmJob({
    customerId: auth.user.customer_id,
    userId: auth.user.user_id,
    jobType: "biography-rewrite-section",
    inputRef: { section_name, instruction_length: user_instruction.length },
  });

  try {
    await markJobRunning(jobId);
    const new_text = await rewriteBiographySection(
      section_name,
      current_text,
      user_instruction
    );
    await markJobCompleted(jobId, { section_name });

    return NextResponse.json({ new_text, job_id: jobId });
  } catch (error) {
    const message = toErrorMessage(error, "Section rewrite failed");
    await markJobFailed(jobId, message);
    return NextResponse.json({ error: message, job_id: jobId }, { status: 500 });
  }
}
