import { createClient } from "@/lib/supabase/server";
import { resolveAppUser, type AppUser } from "@/lib/biography/service";
import { NextResponse } from "next/server";

export async function requireAppUser(): Promise<
  { user: AppUser; authUserId: string } | NextResponse
> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUser = await resolveAppUser(user.id);
  if (!appUser) {
    return NextResponse.json(
      {
        error:
          "No application user mapping found. Create an auth user and map it in the users table.",
      },
      { status: 403 }
    );
  }

  return { user: appUser, authUserId: user.id };
}
