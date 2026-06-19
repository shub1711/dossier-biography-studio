"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBiographyProfile } from "../api";

export const biographyQueryKey = ["biography-profile"] as const;

export function useBiographyProfile() {
  return useQuery({
    queryKey: biographyQueryKey,
    queryFn: fetchBiographyProfile,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
