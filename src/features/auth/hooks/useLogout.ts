"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logoutRequest } from "../api";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await logoutRequest();
    queryClient.clear();
    router.push("/login");
    router.refresh();
  }, [router, queryClient]);
}
