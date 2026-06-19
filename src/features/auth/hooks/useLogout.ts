"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { logoutRequest } from "../api";

export function useLogout() {
  const router = useRouter();

  return useCallback(async () => {
    await logoutRequest();
    router.push("/login");
    router.refresh();
  }, [router]);
}
