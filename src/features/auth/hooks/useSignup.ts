"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginRequest, signupRequest } from "../api";
import type { SignupPayload } from "../types";

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: SignupPayload) => signupRequest(payload),
    onSuccess: async (_, variables) => {
      await loginRequest({
        email: variables.email,
        password: variables.password,
      });
      router.push("/biography");
      router.refresh();
    },
  });
}
