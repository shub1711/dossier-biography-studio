import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      error: "Edge function not deployed. Use Next.js API route or deploy this handler.",
      function: "biography-generate-profile-from-text",
    }),
    { status: 503, headers: { "Content-Type": "application/json" } }
  );
});
