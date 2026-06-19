"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveBiographyProfile } from "../api";
import { biographyQueryKey } from "./useBiographyProfile";
import type { BiographyFormValues } from "@/lib/validators";

export function useSaveBiography() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: BiographyFormValues) => saveBiographyProfile(values),
    onSuccess: (profile) => {
      queryClient.setQueryData(biographyQueryKey, profile);
      toast.success("Biography saved");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
