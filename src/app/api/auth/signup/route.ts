import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const signupBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(2),
});

export async function POST(request: Request) {
  const parsed = signupBodySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password, full_name } = parsed.data;
  const admin = createAdminClient();

  let customerId: string;
  const { data: existingCustomer } = await admin
    .from("customers")
    .select("customer_id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingCustomer?.customer_id) {
    customerId = existingCustomer.customer_id;
  } else {
    const { data: newCustomer, error: customerError } = await admin
      .from("customers")
      .insert({ name: "Default Customer" })
      .select("customer_id")
      .single();

    if (customerError || !newCustomer) {
      return NextResponse.json(
        { error: customerError?.message ?? "Failed to create customer" },
        { status: 500 }
      );
    }
    customerId = newCustomer.customer_id;
  }

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? "Failed to create auth user" },
      { status: 400 }
    );
  }

  const { data: existingUser } = await admin
    .from("users")
    .select("user_id")
    .eq("auth_user_id", authData.user.id)
    .maybeSingle();

  if (!existingUser) {
    const { error: userError } = await admin.from("users").insert({
      customer_id: customerId,
      auth_user_id: authData.user.id,
      email,
      full_name,
    });

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    user_id: authData.user.id,
    email,
    message: "Account created successfully",
  });
}
