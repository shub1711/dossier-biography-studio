"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { rewriteSection } from "../api";
import type { RewriteSectionPayload } from "../types";

export function useRewriteSection() {
  return useMutation({
    mutationFn: (payload: RewriteSectionPayload) => rewriteSection(payload),
    onSuccess: () => {
      toast.success("Section rewritten — review and save");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
