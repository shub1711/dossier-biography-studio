"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginRequest } from "../api";
import type { LoginPayload } from "../types";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: () => {
      router.push("/biography");
      router.refresh();
    },
  });
}
