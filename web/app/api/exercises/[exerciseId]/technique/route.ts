import { NextRequest, NextResponse } from "next/server";

type Exercise = {
  id?: string | number;
  name?: string;
  category?: string;
  exerciseType?: string;
  targetMuscleGroups?: string[];
  equipment?: string[] | string;
};

type TechniqueStep = {
  title: string;
  description: string;
};

type ExerciseTechnique = {
  exerciseId: string;
  exerciseName: string;
  summary: string;
  equipment: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  steps: TechniqueStep[];
  cues: string[];
  commonMistakes: string[];
  safety: string[];
  breathing: string;
  tempo: string;
  warmup: string[];
  cooldown: string[];
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Reuse the same env used elsewhere in auth config as a fallback.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8081/api/v1";

const memCache = new Map<string, { at: number; value: ExerciseTechnique }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h

function coerceStringArray(v: Exercise["equipment"]): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isTechniqueShape(x: any): x is ExerciseTechnique {
  return (
    x &&
    typeof x === "object" &&
    typeof x.exerciseId === "string" &&
    typeof x.exerciseName === "string" &&
    typeof x.summary === "string" &&
    Array.isArray(x.steps) &&
    Array.isArray(x.cues) &&
    Array.isArray(x.commonMistakes) &&
    Array.isArray(x.safety)
  );
}

async function fetchExercise(exerciseId: string): Promise<Exercise | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/exercises/${exerciseId}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Exercise;
  } catch {
    return null;
  }
}

async function generateTechnique(exerciseId: string, ex: Exercise) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const exerciseName = ex.name || `Exercise ${exerciseId}`;
  const equipment = coerceStringArray(ex.equipment);
  const targetMuscleGroups = (ex.targetMuscleGroups || []).map(String);

  const system = [
    "You are a senior strength coach and physiotherapist.",
    "Return ONLY valid JSON. No markdown, no prose.",
    "Be concise and safety-first. Use simple language a beginner can follow.",
  ].join("\n");

  const user = [
    `ExerciseId: ${exerciseId}`,
    `ExerciseName: ${exerciseName}`,
    `Category: ${ex.category ?? ""}`,
    `ExerciseType: ${ex.exerciseType ?? ""}`,
    `TargetMuscleGroups: ${targetMuscleGroups.join(", ")}`,
    `Equipment: ${equipment.join(", ")}`,
    "",
    "Create a step-by-step technique guide with cues, common mistakes, and safety notes.",
    "JSON schema:",
    "{",
    '  "exerciseId": "string",',
    '  "exerciseName": "string",',
    '  "summary": "string (1-2 sentences)",',
    '  "equipment": ["string"],',
    '  "difficulty": "beginner|intermediate|advanced",',
    '  "steps": [{"title":"string","description":"string"}],',
    '  "cues": ["string"],',
    '  "commonMistakes": ["string"],',
    '  "safety": ["string"],',
    '  "breathing": "string",',
    '  "tempo": "string",',
    '  "warmup": ["string"],',
    '  "cooldown": ["string"]',
    "}",
  ].join("\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { error: "OpenAI request failed", details: raw },
      { status: 502 },
    );
  }

  let parsed: any = null;
  try {
    const body = raw ? JSON.parse(raw) : null;
    const content = body?.choices?.[0]?.message?.content;
    parsed = content ? JSON.parse(content) : null;
  } catch {
    parsed = null;
  }

  if (!isTechniqueShape(parsed)) {
    return NextResponse.json(
      { error: "Invalid AI response shape", raw },
      { status: 502 },
    );
  }

  memCache.set(exerciseId, { at: Date.now(), value: parsed });
  return NextResponse.json(parsed);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { exerciseId: string } },
) {
  const exerciseId = params.exerciseId;
  const cached = memCache.get(exerciseId);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json(cached.value);
  }

  const ex = await fetchExercise(exerciseId);
  if (!ex) {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
  }

  return generateTechnique(exerciseId, ex);
}

