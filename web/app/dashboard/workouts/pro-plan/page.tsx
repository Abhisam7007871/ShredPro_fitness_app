"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Target,
    Activity,
    Scale,
    User,
    Dumbbell,
    Brain,
    Utensils,
    Zap,
    Shield,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { requestAiWorkoutPlan, getCurrentAiWorkoutPlan } from "@/lib/api/workouts";
import type { AiWorkoutPlan } from "@/types/workout";

export default function AiProPlanPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user as any;

    const [loading, setLoading] = useState(false);
    const [loadingCurrent, setLoadingCurrent] = useState(false);
    const [plan, setPlan] = useState<any>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    const [form, setForm] = useState({
        height: user?.height || "",
        weight: user?.currentWeight || "",
        age: user?.age || "",
        gender: user?.gender || "MALE",
        goal: "FAT_LOSS",
        experience: "INTERMEDIATE",
        daysPerWeek: 4,
        sessionMinutes: 60,
        equipment: "" as string,
        preferredSplit: "upper_lower" as "full_body" | "upper_lower" | "push_pull_legs" | "custom",
    });

    const isPro = user?.membershipLevel === "Pro" || user?.membershipLevel === "Elite";

    const mapGoal = (g: string) => {
        const map: Record<string, "muscle_gain" | "fat_loss" | "strength" | "endurance"> = {
            FAT_LOSS: "fat_loss",
            MUSCLE_GAIN: "muscle_gain",
            STRENGTH: "strength",
            ENDURANCE: "endurance",
        };
        return map[g] ?? "muscle_gain";
    };
    const mapExperience = (e: string) => {
        const map: Record<string, "beginner" | "intermediate" | "advanced"> = {
            BEGINNER: "beginner",
            INTERMEDIATE: "intermediate",
            ADVANCED: "advanced",
        };
        return map[e] ?? "intermediate";
    };

    const handleGenerate = async () => {
        setLoading(true);
        setApiError(null);
        try {
            const payload = {
                goal: mapGoal(form.goal),
                experienceLevel: mapExperience(form.experience),
                daysPerWeek: form.daysPerWeek,
                sessionLengthMinutes: form.sessionMinutes,
                availableEquipment: form.equipment ? form.equipment.split(",").map((s) => s.trim()).filter(Boolean) : [],
                injuriesOrConstraints: [],
                preferredSplit: form.preferredSplit,
            };
            const aiPlan: AiWorkoutPlan = await requestAiWorkoutPlan(payload);
            setPlan({ type: "ai", data: aiPlan });
        } catch (err) {
            console.error(err);
            setApiError(err instanceof Error ? err.message : "Failed to generate plan");
            setTimeout(() => {
                setPlan({
                    type: "mock",
                    workout: {
                        name: "Elite Shred Architecture",
                        frequency: `${form.daysPerWeek} Days/Week`,
                        focus: form.goal,
                        caloriesBurned: 450,
                    },
                    nutrition: {
                        dailyCalories: 2200,
                        protein: "180g",
                        fiber: "35g",
                        macros: { p: "40%", c: "40%", f: "20%" },
                    },
                });
            }, 1500);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadCurrent = async () => {
        setLoadingCurrent(true);
        setApiError(null);
        try {
            const current = await getCurrentAiWorkoutPlan();
            if (current) setPlan({ type: "ai", data: current });
            else setApiError("No saved AI plan found. Generate one first.");
        } catch (err) {
            setApiError(err instanceof Error ? err.message : "Failed to load plan");
        } finally {
            setLoadingCurrent(false);
        }
    };

    if (!isPro) {
        return (
            <div className="min-h-[80vh] flex flex-center flex-col items-center justify-center text-center px-6">
                <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
                    <Shield className="text-primary h-10 w-10" />
                </div>
                <h1 className="text-4xl font-black text-white mb-4 italic uppercase">Clearance Required</h1>
                <p className="text-gray-400 max-w-md mb-8 font-medium">
                    The AI Pro Plan generator is restricted to **Pro** and **Elite** athletes.
                    Upgrade your clearance to unlock personalized performance architecture.
                </p>
                <Link href="/dashboard/settings/membership" className="px-10 py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-glow">
                    Upgrade Access
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-10">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/dashboard/workouts" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight italic">AI PRO <span className="text-primary tracking-normal">GENERATOR</span></h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Powered by GPT-5.2 Intelligence</p>
                </div>
            </div>

            {!plan ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="glass rounded-[3rem] p-10 border border-white/10 space-y-8">
                        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                            <span className="text-sm font-semibold text-amber-200">Missed a session? Get a fresh plan that adapts to your week.</span>
                            <RefreshCw size={18} className="text-amber-400 shrink-0" />
                        </div>
                        <button type="button" onClick={handleLoadCurrent} disabled={loadingCurrent} className="w-full py-3 rounded-xl border border-white/20 text-gray-300 font-semibold hover:bg-white/5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-6">
                            {loadingCurrent ? "Loading..." : "Load my current AI plan"}
                        </button>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <Activity className="text-primary" /> BIOMETRIC SCAN
                        </h2>
                        {apiError && <p className="text-sm text-amber-400">Backend unavailable: using preview. {apiError}</p>}

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Scale size={14} className="text-primary" /> Height (cm)
                                </label>
                                <input
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:border-primary/50 outline-none transition-all"
                                    value={form.height}
                                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Scale size={14} className="text-primary" /> Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:border-primary/50 outline-none transition-all"
                                    value={form.weight}
                                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <User size={14} className="text-primary" /> Age
                                </label>
                                <input
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:border-primary/50 outline-none transition-all"
                                    value={form.age}
                                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <User size={14} className="text-primary" /> Gender
                                </label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:border-primary/50 outline-none transition-all appearance-none"
                                    value={form.gender}
                                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                >
                                    <option value="MALE">MALE</option>
                                    <option value="FEMALE">FEMALE</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Target size={14} className="text-primary" /> PRIMARY OBJECTIVE
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['FAT_LOSS', 'MUSCLE_GAIN', 'STRENGTH', 'ENDURANCE'].map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => setForm({ ...form, goal })}
                                        className={`py-3 rounded-xl border font-bold text-xs transition-all ${form.goal === goal ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                                            }`}
                                    >
                                        {goal.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Dumbbell size={14} className="text-primary" /> EXPERIENCE LEVEL
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((exp) => (
                                    <button
                                        key={exp}
                                        onClick={() => setForm({ ...form, experience: exp })}
                                        className={`py-3 rounded-xl border font-bold text-[10px] transition-all ${form.experience === exp ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                                            }`}
                                    >
                                        {exp}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Days per week</label>
                                <input type="number" min={1} max={7} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:border-primary/50 outline-none" value={form.daysPerWeek} onChange={(e) => setForm({ ...form, daysPerWeek: Number(e.target.value) || 4 })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Session (min)</label>
                                <input type="number" min={20} max={180} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:border-primary/50 outline-none" value={form.sessionMinutes} onChange={(e) => setForm({ ...form, sessionMinutes: Number(e.target.value) || 60 })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Equipment (comma-separated, e.g. dumbbells, band)</label>
                            <input type="text" placeholder="Leave empty for bodyweight" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:border-primary/50 outline-none placeholder:text-gray-500" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Preferred split</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold focus:border-primary/50 outline-none" value={form.preferredSplit} onChange={(e) => setForm({ ...form, preferredSplit: e.target.value as typeof form.preferredSplit })}>
                                <option value="full_body">Full body</option>
                                <option value="upper_lower">Upper / Lower</option>
                                <option value="push_pull_legs">Push / Pull / Legs</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        <button
                            disabled={loading}
                            onClick={handleGenerate}
                            className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest transition-all hover:bg-primary hover:shadow-glow flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Zap className="animate-spin h-5 w-5" />
                                    Synthesizing...
                                </>
                            ) : (
                                <>
                                    <Brain size={20} />
                                    Construct AI Plan
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col justify-center gap-8 px-10">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white italic">Elite Architecture.</h3>
                            <p className="text-gray-400 font-medium italic">Our AI analyzes your unique physiology to construct a mathematically optimized training and nutrition protocol.</p>
                        </div>
                        <div className="space-y-6">
                            {[
                                { icon: Zap, title: "Precision Macros", desc: "Optimized P/C/F splits based on your expenditure." },
                                { icon: Brain, title: "Logical Progression", desc: "Dynamic set/rep scaling for consistent output." },
                                { icon: Target, title: "Hyper Focus", desc: "Exercises selected specifically for your target goal." }
                            ].map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                <div key={i} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Icon className="text-primary" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm tracking-tight">{feature.title}</p>
                                        <p className="text-xs text-gray-500 font-medium">{feature.desc}</p>
                                    </div>
                                </div>
                            );})}
                        </div>
                    </div>
                </div>
            ) : plan?.type === "ai" ? (
                <div className="space-y-10 animate-fade-in">
                    <div className="glass rounded-[3rem] p-12 border border-primary/30 relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-6 mb-10">
                            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-glow">
                                <Sparkles className="text-black" size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">{plan.data.name}</h1>
                                <p className="text-primary font-bold tracking-widest text-sm">{plan.data.durationWeeks} weeks · {plan.data.daysPerWeek} days/week · ID {plan.data.planId}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Weeks</p>
                                <p className="text-xl font-black text-white">{plan.data.durationWeeks}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Days/Week</p>
                                <p className="text-xl font-black text-white">{plan.data.daysPerWeek}</p>
                            </div>
                        </div>
                        <div className="mt-8 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {plan.data.weeks?.slice(0, 2).map((week: any) => (
                                <div key={week.weekNumber}>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Week {week.weekNumber}</h3>
                                    <div className="space-y-2">
                                        {week.days?.map((day: any) => (
                                            <div key={day.dayNumber} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <p className="font-bold text-white">{day.label}</p>
                                                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                                                    {day.exercises?.slice(0, 5).map((ex: any, i: number) => (
                                                        <li key={i}>{ex.exerciseId} — {ex.sets}×{ex.reps}{ex.rpe ? ` RPE ${ex.rpe}` : ""}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setPlan(null)} className="mt-6 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold hover:text-white transition-all">
                            Generate a new plan
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 animate-fade-in">
                    <div className="glass rounded-[3rem] p-12 border border-primary/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent opacity-50" />
                        <div className="relative z-10 flex items-center gap-6 mb-10">
                            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-glow">
                                <Sparkles className="text-black" size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">{plan.workout.name}</h1>
                                <p className="text-primary font-bold tracking-widest text-sm">STRATEGIC ARCHITECTURE ACTIVE</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Weekly Frequency</p>
                                <p className="text-2xl font-black text-white">{plan.workout.frequency}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Training Focus</p>
                                <p className="text-2xl font-black text-white uppercase italic">{plan.workout.focus.replace("_", " ")}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Daily Fuel Goal</p>
                                <p className="text-2xl font-black text-white">{plan.nutrition.dailyCalories} kcal</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Protein Target</p>
                                <p className="text-2xl font-black text-primary">{plan.nutrition.protein}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="glass rounded-[3rem] p-10 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 italic uppercase">
                                <Utensils className="text-orange-400" /> Nutritional Logic
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <span className="text-sm font-bold text-gray-400 uppercase">Fiber Threshold</span>
                                    <span className="text-lg font-black text-white">{plan.nutrition.fiber}</span>
                                </div>
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-4">Macro Distribution</p>
                                    <div className="flex h-3 w-full rounded-full bg-white/5 overflow-hidden gap-1">
                                        <div className="h-full bg-primary" style={{ width: plan.nutrition.macros.p }}></div>
                                        <div className="h-full bg-blue-500" style={{ width: plan.nutrition.macros.c }}></div>
                                        <div className="h-full bg-orange-500" style={{ width: plan.nutrition.macros.f }}></div>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <span className="text-[10px] font-black text-primary uppercase italic">PRO: {plan.nutrition.macros.p}</span>
                                        <span className="text-[10px] font-black text-blue-500 uppercase italic">CARB: {plan.nutrition.macros.c}</span>
                                        <span className="text-[10px] font-black text-orange-500 uppercase italic">FAT: {plan.nutrition.macros.f}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <Link href="/dashboard/workouts" className="flex-1 rounded-[2rem] bg-primary text-black font-black uppercase tracking-widest hover:shadow-glow transition-all flex items-center justify-center gap-3 group text-xl py-5">
                                Deploy Protocol
                                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button
                                onClick={() => setPlan(null)}
                                className="h-20 rounded-[2rem] bg-white/5 border border-white/10 text-gray-500 font-bold hover:text-white transition-all uppercase tracking-widest text-xs"
                            >
                                Re-sync Parameters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


