"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateFromText, generateFromUrl } from "../api";
import { biographyQueryKey } from "./useBiographyProfile";

type GeneratePayload = {
  mode: "text" | "url";
  value: string;
};

export function useGenerateBiography() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mode, value }: GeneratePayload) => {
      if (mode === "text") return generateFromText(value);
      return generateFromUrl(value);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(biographyQueryKey, data.profile);
      toast.success("Biography generated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
