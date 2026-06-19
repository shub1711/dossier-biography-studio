import type { LoginPayload, SignupPayload, SignupResponse } from "./types";

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data as T;
}

export async function signupRequest(payload: SignupPayload): Promise<SignupResponse> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<SignupResponse>(response);
}

export async function loginRequest(payload: LoginPayload): Promise<void> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(payload);
  if (error) throw new Error(error.message);
}

export async function logoutRequest(): Promise<void> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
