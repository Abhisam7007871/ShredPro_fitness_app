"use client";

import { useEffect, useMemo, useState } from "react";
import { Dumbbell, Sparkles, Plus, Play, Info, Search, Filter, ChevronRight, Zap, Trophy, ChevronDown, RotateCw, ClipboardList, GripVertical, X, MoreHorizontal, Plane, Package } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { useSession } from "next-auth/react";
import WorkoutBuilderFull from "@/components/workouts/WorkoutBuilderFull";
import Card from "@/components/ui/Card";

export default function WorkoutsPage() {
    const [exercises, setExercises] = useState<any[]>([]);
    const [routines, setRoutines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [mode, setMode] = useState<"browse" | "build">("browse");
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const { data: session } = useSession();
    const discoverCategories = useMemo(() => (["All", "Strength", "Focus", "Full body"] as const), []);
    const [discoverCat, setDiscoverCat] = useState<(typeof discoverCategories)[number]>("All");

    useEffect(() => {
        fetchExercises();
        if (session?.user) {
            fetchRoutines();
        }
    }, [session]);

    const fetchExercises = async () => {
        try {
            const res = await api.get("/exercises");
            setExercises(res.data || []);
        } catch (err) {
            console.error("Failed to fetch exercises", err);
        } finally {
            if (!session?.user) setLoading(false);
        }
    };

    const fetchRoutines = async () => {
        try {
            const res = await api.get(`/workouts/routines/${(session?.user as any).id}`);
            setRoutines(res.data || []);
        } catch (err) {
            console.error("Failed to fetch routines", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredExercises = exercises.filter(ex => {
        const matchesFilter = filter === "all" || ex.category?.toLowerCase() === filter.toLowerCase();
        const matchesSearch = ex.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center pt-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    Workout <ChevronDown size={20} />
                </h1>
                <button className="hover:rotate-180 transition-transform duration-500">
                    <RotateCw size={20} />
                </button>
            </div>

            {/* Travel / Limited Equipment - like Freeletics & Fitbod */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard/workouts/pro-plan" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors">
                    <Plane size={20} />
                    <span className="text-sm font-semibold">Travel or no gym? Get a bodyweight / minimal-equipment AI plan</span>
                    <ChevronRight size={16} />
                </Link>
                <Link href="/dashboard/workouts/pro-plan" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-accent border border-[rgb(var(--border))] text-text-main hover:bg-surface transition-colors">
                    <Package size={20} className="text-secondary" />
                    <span className="text-sm font-semibold">Limited equipment filter</span>
                    <ChevronRight size={16} />
                </Link>
            </div>

            {/* Discover (reference-style cards + category chips) */}
            <Card className="p-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Discover</p>
                        <p className="text-lg font-extrabold text-text-main">Your plan</p>
                    </div>
                    <Link
                        href="/dashboard/workouts/session?category=strength"
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                    >
                        Continue
                    </Link>
                </div>

                <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {discoverCategories.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setDiscoverCat(c)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${discoverCat === c
                                ? "bg-surface border-[rgb(var(--border))] text-text-main shadow-[0_10px_26px_rgba(15,23,42,0.10)]"
                                : "bg-surface-accent border-[rgb(var(--border))] text-text-muted hover:text-text-main"
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { title: "Upper body workout", minutes: 30, desc: "Glutes / Squads / Hamstrings" },
                        { title: "Lower body workout", minutes: 30, desc: "Glutes / Squads / Hamstrings" },
                    ].map((w) => (
                        <Link
                            key={w.title}
                            href="/dashboard/workouts/session"
                            className="block rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-4 hover:bg-surface transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-extrabold text-text-main">{w.title}</p>
                                    <p className="text-xs text-text-muted font-bold mt-1">{w.desc}</p>
                                </div>
                                <div className="h-9 px-3 rounded-full bg-surface border border-[rgb(var(--border))] text-xs font-black text-text-main flex items-center">
                                    {w.minutes} MIN
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Card>

            {/* Content Area */}
            {mode === "build" ? (
                <WorkoutBuilderFull onSave={async (w) => {
                    try {
                        await api.post("/workouts/routines", {
                            userId: (session?.user as any).id,
                            name: w.name || "Untitled Routine",
                            description: w.description || "Custom Tactical Protocol",
                            exercisesJson: JSON.stringify(w.exercises)
                        });
                        setMode("browse");
                        fetchRoutines();
                    } catch (err) {
                        console.error("Failed to save routine", err);
                    }
                }} />
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Routines</h2>
                        <button onClick={() => setMode("build")} className="h-9 w-9 rounded-xl bg-surface-accent border border-[rgb(var(--border))] flex items-center justify-center hover:bg-surface transition-colors text-text-main">
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setMode("build")} className="bg-surface-accent border border-[rgb(var(--border))] text-text-main font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-surface transition-colors">
                            <ClipboardList size={18} /> New Routine
                        </button>
                        <button className="bg-surface-accent border border-[rgb(var(--border))] text-text-main font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-surface transition-colors">
                            <Search size={18} /> Explore
                        </button>
                    </div>

                    <div className="bg-surface-accent border border-[rgb(var(--border))] text-text-main font-semibold rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <GripVertical size={18} />
                            <span className="text-sm">Press and hold a routine to reorder</span>
                        </div>
                        <button><X size={16} /></button>
                    </div>

                    {/* My Routines Section */}
                    {routines.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-text-muted">
                                <ChevronDown size={16} />
                                <span className="text-sm">My Routines ({routines.length})</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                {routines.map((routine) => {
                                    const parsed = routine.exercisesJson ? JSON.parse(routine.exercisesJson) : [];
                                    const previewText = parsed.map((e: any) => e.name).join(", ");

                                    return (
                                        <div key={routine.id} className="bg-surface-accent p-5 rounded-2xl border border-[rgb(var(--border))] hover:bg-surface transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                                                    {routine.name}
                                                </h3>
                                                <button
                                                    className="text-text-muted hover:text-text-main transition-colors"
                                                    onClick={() => {
                                                        if (confirm("Delete protocol?")) api.delete(`/workouts/routines/${routine.id}`).then(() => fetchRoutines());
                                                    }}
                                                >
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </div>

                                            <p className="text-text-muted text-[13px] leading-relaxed line-clamp-2 mb-5">
                                                {previewText || routine.description || "Custom Protocol"}
                                            </p>

                                            <Link
                                                href={`/dashboard/workouts/session?routineId=${routine.id}`}
                                                className="w-full py-3 rounded-xl bg-secondary hover:brightness-95 text-white font-semibold flex items-center justify-center transition-colors"
                                            >
                                                Start Routine
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Exercise Intel Feed */}
                    <div className="space-y-6 mt-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Exercise Intel Feed</h2>
                            <Link
                                href="/dashboard/workouts/pro-plan"
                                className="bg-primary hover:scale-105 active:scale-95 text-black font-black px-4 py-2 rounded-xl transition-all shadow-glow flex items-center gap-2 text-xs tracking-widest"
                            >
                                <Sparkles size={16} fill="currentColor" />
                                Pro Plan
                            </Link>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <div className="p-1 px-1 bg-surface-accent border border-[rgb(var(--border))] rounded-xl flex gap-1">
                                {["all", "strength", "cardio", "hiit", "mobility"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === cat
                                            ? "bg-surface text-text-main"
                                            : "text-text-muted hover:text-text-main"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="h-24 rounded-2xl bg-surface-accent border border-[rgb(var(--border))] animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredExercises.map((ex) => (
                                    <div key={ex.id} className="bg-surface-accent border border-[rgb(var(--border))] p-4 rounded-2xl flex items-center gap-4 hover:bg-surface transition-colors">
                                        <div className="h-16 w-16 bg-surface rounded-xl border border-[rgb(var(--border))] flex items-center justify-center shrink-0">
                                            <Dumbbell size={24} className="text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-text-main font-bold truncate">{ex.name}</h3>
                                            <p className="text-text-muted text-xs truncate mt-1">{ex.targetMuscleGroups?.join(", ") || "Full Body"}</p>
                                        </div>
                                        <Link
                                            href={`/dashboard/workouts/exercises/${ex.id}`}
                                            className="h-10 w-10 shrink-0 rounded-full bg-surface border border-[rgb(var(--border))] flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface-accent transition-colors"
                                            aria-label="How to do it"
                                            title="How to do it"
                                        >
                                            <Info size={16} />
                                        </Link>
                                        <Link
                                            href={`/dashboard/workouts/session?exerciseId=${ex.id}`}
                                            className="h-10 w-10 shrink-0 bg-secondary hover:brightness-95 rounded-full flex items-center justify-center text-white transition-colors"
                                        >
                                            <Play size={16} fill="currentColor" className="ml-0.5" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!loading && filteredExercises.length === 0 && (
                            <div className="text-center py-10 text-text-muted">
                                No exercises found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
