import { NextRequest, NextResponse } from "next/server";

type AiMeal = {
  id: string;
  title: string;
  timeLabel: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

type AiNutritionDay = {
  dateISO: string;
  targets: { calories: number; proteinG: number; carbsG: number; fatG: number };
  consumed: { calories: number; proteinG: number; carbsG: number; fatG: number };
  meals: AiMeal[];
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function isAiDay(x: any): x is AiNutritionDay {
  return (
    x &&
    typeof x === "object" &&
    typeof x.dateISO === "string" &&
    x.targets &&
    typeof x.targets.calories === "number" &&
    Array.isArray(x.meals)
  );
}

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as any;
  const region = String(body?.region || "US");
  const dietType = String(body?.dietType || "Omnivore");
  const caloriesTarget = Number(body?.caloriesTarget || 2200);
  const mealsPerDay = Math.max(3, Math.min(5, Number(body?.mealsPerDay || 3)));
  const allergies = Array.isArray(body?.allergies)
    ? body.allergies.map(String).slice(0, 8)
    : [];

  const system = [
    "You are a registered dietitian and meal-planning coach.",
    "Return ONLY valid JSON. No markdown, no prose.",
    "Follow the requested region and diet type. Prefer common foods for that region.",
    "Keep ingredients realistic and easy to source.",
  ].join("\n");

  const user = [
    `Region: ${region}`,
    `DietType: ${dietType}`,
    `CaloriesTarget: ${caloriesTarget}`,
    `MealsPerDay: ${mealsPerDay}`,
    `Allergies: ${allergies.join(", ")}`,
    "",
    "Return a 1-day plan in this JSON schema:",
    "{",
    '  "dateISO": "string (ISO date)",',
    '  "targets": {"calories": number, "proteinG": number, "carbsG": number, "fatG": number},',
    '  "consumed": {"calories": 0, "proteinG": 0, "carbsG": 0, "fatG": 0},',
    '  "meals": [',
    '    {"id":"breakfast-1","title":"string","timeLabel":"Breakfast|Lunch|Dinner|Snack","calories":number,"proteinG":number,"carbsG":number,"fatG":number}',
    "  ]",
    "}",
    "",
    "Rules:",
    "- 3 to 5 meals based on MealsPerDay.",
    "- Macros should roughly sum near CaloriesTarget (within ~10%).",
    "- Use short meal titles.",
  ].join("\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.5,
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
    const bodyJson = raw ? JSON.parse(raw) : null;
    const content = bodyJson?.choices?.[0]?.message?.content;
    parsed = content ? JSON.parse(content) : null;
  } catch {
    parsed = null;
  }

  if (!isAiDay(parsed)) {
    return NextResponse.json(
      { error: "Invalid AI response shape", raw },
      { status: 502 },
    );
  }

  // Ensure consumed is zeroed (UI uses it as progress input)
  parsed.consumed = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };

  return NextResponse.json(parsed);
}

