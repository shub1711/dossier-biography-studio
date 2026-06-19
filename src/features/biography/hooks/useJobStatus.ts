"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJob } from "../api";

const TERMINAL_STATUSES = new Set(["completed", "failed"]);

export function useJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: ["llm-job", jobId],
    enabled: Boolean(jobId),
    queryFn: async () => {
      if (!jobId) return null;
      const data = await fetchJob(jobId);
      return data.job;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || TERMINAL_STATUSES.has(status)) return false;
      return 2000;
    },
  });
}
