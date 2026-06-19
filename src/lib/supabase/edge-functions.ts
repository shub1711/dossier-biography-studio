type InvokeOptions = {
  body?: Record<string, unknown>;
};

const FUNCTION_ROUTE_MAP: Record<string, string> = {
  "biography-generate-profile-from-text": "/api/biography/generate-from-text",
  "biography-fetch-profile-from-url": "/api/biography/fetch-from-url",
  "biography-rewrite-section": "/api/biography/rewrite-section",
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Request failed"
    );
  }
  return data as T;
}

async function invokeLocal<T>(
  functionName: string,
  options?: InvokeOptions
): Promise<T> {
  const route = FUNCTION_ROUTE_MAP[functionName];
  if (!route) {
    throw new Error(`Unknown function: ${functionName}`);
  }

  const response = await fetch(route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options?.body ?? {}),
  });

  return parseResponse<T>(response);
}

async function invokeSupabase<T>(
  functionName: string,
  options?: InvokeOptions
): Promise<T> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: options?.body,
  });

  if (error) throw new Error(error.message);
  return data as T;
}

export const edgeFunctions = {
  invoke<T>(functionName: string, options?: InvokeOptions): Promise<T> {
    const useSupabase =
      process.env.NEXT_PUBLIC_USE_SUPABASE_FUNCTIONS === "true";

    if (useSupabase) {
      return invokeSupabase<T>(functionName, options);
    }

    return invokeLocal<T>(functionName, options);
  },

  biography: {
    generateFromText(source_text: string) {
      return edgeFunctions.invoke<{
        job_id: string;
        profile: unknown;
      }>("biography-generate-profile-from-text", {
        body: { source_text, source_type: "pasted_text" },
      });
    },

    fetchFromUrl(source_url: string) {
      return edgeFunctions.invoke<{
        job_id: string;
        profile: unknown;
      }>("biography-fetch-profile-from-url", {
        body: { source_url },
      });
    },

    rewriteSection(body: {
      section_name: string;
      current_text: string;
      user_instruction: string;
    }) {
      return edgeFunctions.invoke<{ new_text: string }>(
        "biography-rewrite-section",
        { body }
      );
    },
  },
};
