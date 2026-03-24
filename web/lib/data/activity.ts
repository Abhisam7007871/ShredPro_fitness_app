import api from "@/lib/api";
import { ActivitySummary, mockActivitySummary } from "@/lib/mock/activity";

export async function getActivitySummary(userId?: string): Promise<ActivitySummary> {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "1";
  if (useMock || !userId) return mockActivitySummary();

  try {
    // Expected backend endpoint (adjust once backend is finalized)
    const res = await api.get(`/activity/summary/${userId}`);
    return res.data as ActivitySummary;
  } catch {
    return mockActivitySummary();
  }
}

