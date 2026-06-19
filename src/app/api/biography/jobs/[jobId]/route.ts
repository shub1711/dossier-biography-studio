import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth/require-app-user";

export async function GET(
  _request: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  const auth = await requireAppUser();
  if (auth instanceof NextResponse) return auth;

  const { jobId } = await context.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("llm_jobs")
    .select("*")
    .eq("llm_job_id", jobId)
    .eq("user_id", auth.user.user_id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ job: data });
}
