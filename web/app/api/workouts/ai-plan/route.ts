import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // You should already define this for next-auth

const WORKOUT_SERVICE_URL = process.env.WORKOUT_SERVICE_URL;

if (!WORKOUT_SERVICE_URL) {
  // This will surface clearly at startup in development
  // and avoids silently proxying to an undefined URL.
  // eslint-disable-next-line no-console
  console.warn(
    "[AI Plan API] WORKOUT_SERVICE_URL is not set. Proxy requests will fail.",
  );
}

async function proxyToWorkoutService(
  req: NextRequest,
  path: string,
  init: RequestInit,
) {
  if (!WORKOUT_SERVICE_URL) {
    return NextResponse.json(
      { error: "WORKOUT_SERVICE_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${WORKOUT_SERVICE_URL}${path}`, {
      ...init,
      // Ensure we never forward any incoming cookies to the internal service
      headers: init.headers as HeadersInit,
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown upstream error";
    return NextResponse.json(
      { error: "Failed to reach workout-service", details: message },
      { status: 502 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const accessToken = (session as any).accessToken as string | undefined;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const userId =
    (session.user as any)?.id ??
    (session as any).userId ??
    (session as any).sub;
  if (userId) {
    headers["x-user-id"] = String(userId);
  }

  return proxyToWorkoutService(req, "/workouts/ai-plan/requests", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers: Record<string, string> = {};

  const accessToken = (session as any).accessToken as string | undefined;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const userId =
    (session.user as any)?.id ??
    (session as any).userId ??
    (session as any).sub;
  if (userId) {
    headers["x-user-id"] = String(userId);
  }

  return proxyToWorkoutService(req, "/workouts/ai-plan/current", {
    method: "GET",
    headers,
  });
}

