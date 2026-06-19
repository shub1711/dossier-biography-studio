import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { biographyFormSchema } from "@/lib/validators";

export async function GET() {
  const auth = await requireAppUser();
  if (auth instanceof NextResponse) return auth;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("biography_profiles")
    .select("*")
    .eq("user_id", auth.user.user_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}

export async function PUT(request: Request) {
  const auth = await requireAppUser();
  if (auth instanceof NextResponse) return auth;

  const parsed = biographyFormSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid profile data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const body = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("biography_profiles")
    .update({
      subject_name: body.subject_name,
      personal_overview: body.personal_overview,
      origin_story: body.origin_story,
      career_journey: body.career_journey,
      current_focus: body.current_focus,
      areas_of_expertise: body.areas_of_expertise,
      notable_achievements: body.notable_achievements,
      career_highlights: body.career_highlights,
      personal_interests: body.personal_interests,
      updated_at: new Date().toISOString(),
      updated_by: auth.user.user_id,
    })
    .eq("user_id", auth.user.user_id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
