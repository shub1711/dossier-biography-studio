import { NextResponse } from "next/server";
import { z } from "zod";
import { rewriteBiographySection } from "@/lib/llm/provider";
import { requireAppUser } from "@/lib/auth/require-app-user";

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

  try {
    const new_text = await rewriteBiographySection(
      section_name,
      current_text,
      user_instruction
    );

    return NextResponse.json({ new_text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Section rewrite failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
