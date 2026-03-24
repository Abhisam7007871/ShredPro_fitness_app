"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import {
    Dumbbell,
    Utensils,
    Award,
    TrendingUp,
    Zap,
    Calendar,
    Target,
    ChevronRight,
    Trophy,
    Users,
    Sparkles,
    Heart,
    History,
    Medal,
} from "lucide-react";
import Link from "next/link";
import ShredHeatmap from "@/components/dashboard/ShredHeatmap";
import StreakStats from "@/components/dashboard/StreakStats";

export default function DashboardPage() {
    const { data: session } = useSession();
    const user = session?.user as any;

    const [stats, setStats] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [heatmapData, setHeatmapData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [user?.id]);

    const fetchDashboardData = async () => {
        if (!user?.id) return;
        try {
            const [statsRes, leaderboardRes, heatmapRes] = await Promise.all([
                api.get(`/workouts/stats/${user.id}`),
                api.get("/workouts/leaderboard"),
                api.get(`/workouts/heatmap/${user.id}`),
            ]);
            setStats(statsRes.data ?? null);
            setLeaderboard(Array.isArray(leaderboardRes.data) ? leaderboardRes.data : []);
            setHeatmapData(Array.isArray(heatmapRes.data) ? heatmapRes.data : []);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
            setStats(null);
            setLeaderboard([]);
            setHeatmapData([]);
        } finally {
            setLoading(false);
        }
    };

    const name = user?.name ? user.name.split(' ')[0] : "Athlete";

    return (
        <div className="space-y-10 pb-20">
            {/* Elite Streak Tracker */}
            <StreakStats
                currentStreak={stats?.currentStreak || 0}
                longestStreak={stats?.longestStreak || 0}
                xp={stats?.xp || 0}
            />

            {/* Hero Section */}
            <section className="relative group overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-gradient-premium p-6 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent opacity-50 transition-opacity group-hover:opacity-75" />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-[120px] animate-pulse" />

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-glow">
                        <Zap size={12} fill="currentColor" />
                        AI-Powered Performance
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-none">
                        Welcome, <span className="text-neon">{name}</span>.
                    </h1>
                    <p className="text-lg text-gray-300 leading-relaxed mb-8 font-medium">
                        Your performance is up <span className="text-primary font-bold">12%</span> this week. You're on a <span className="text-orange-400 font-bold">{stats?.currentStreak || 0}-day streak</span>—don't let the momentum slip.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/dashboard/workouts" className="px-8 py-4 rounded-2xl bg-primary text-black font-extrabold hover:scale-105 transition-all shadow-glow flex items-center gap-2">
                            Resume Training <ChevronRight size={20} />
                        </Link>
                        <Link href="/dashboard/nutrition" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all backdrop-blur-md flex items-center gap-2">
                            <Utensils size={20} /> Daily Nutrition
                        </Link>
                        <Link href="/dashboard/social" className="px-8 py-4 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary font-bold hover:bg-secondary/20 transition-all backdrop-blur-md flex items-center gap-2">
                            <Users size={20} /> Tactical Social
                        </Link>
                    </div>
                </div>

                <div className="absolute top-12 right-12 hidden xl:block">
                    <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-xl space-y-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Trophy size={14} className="text-amber-400" /> Global Ranking
                        </p>
                        <p className="text-4xl font-extrabold text-white italic"># {stats?.globalRank || 'TBD'}</p>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-right">Top 5% of Athletes</p>
                    </div>
                </div>
            </section>

            {/* Today's Workout & Recovery - industry-standard quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/dashboard/workouts/pro-plan" className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group block">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Today&apos;s Suggested Workout</h3>
                            <p className="text-xs text-gray-400">AI-generated plan based on your goals & recovery</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">Get a personalized session or start your next routine.</p>
                    <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold">Generate or view plan <ChevronRight size={16} /></span>
                </Link>
                <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Heart size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Recovery & Readiness</h3>
                            <p className="text-xs text-gray-400">Connect wearables for day-level adaptation</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">Apps like Fitbod and Future adapt intensity using sleep & HRV. Connect Apple Health or log sleep to unlock.</p>
                    <button type="button" className="text-sm font-semibold text-emerald-400 border border-emerald-400/30 rounded-lg px-4 py-2 hover:bg-emerald-400/10 transition-colors">Coming soon</button>
                </div>
            </div>

            {/* Elite Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Daily Volume", value: (stats?.totalWeightKg ?? 0).toLocaleString(), unit: "kg", icon: Dumbbell, color: "text-primary", bg: "bg-primary/10" },
                    { label: "Active Calories", value: (stats?.totalCalories ?? 0).toLocaleString(), unit: "kcal", icon: Zap, color: "text-orange-400", bg: "bg-orange-400/10" },
                    { label: "Total Reps", value: (stats?.totalReps ?? 0).toLocaleString(), unit: "reps", icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { label: "Total Workouts", value: String(stats?.totalWorkouts ?? 0), unit: "sessions", icon: Calendar, color: "text-purple-400", bg: "bg-purple-400/10" },
                ].map((stat, i) => (
                    <div key={i} className="glass rounded-3xl md:rounded-[2rem] p-6 md:p-8 border border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 h-32 w-32 ${stat.bg} blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity`} />
                        <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                            <stat.icon size={24} />
                        </div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                            <span className="text-gray-500 font-bold text-sm">{stat.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Insight Box */}
                <div className="lg:col-span-2 glass rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap size={120} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Target size={20} />
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-tight">AI Recovery Insight</h2>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                        Based on your resting heart rate and yesterday's high-intensity leg session, we recommend <span className="text-white font-bold">prioritizing active recovery</span> today. Increasing your protein intake by <span className="text-emerald-400 font-bold">15g</span> for your post-workout meal will optimize structural repair.
                    </p>
                    <div className="flex gap-4">
                        <div className="h-1 w-20 rounded-full bg-primary shadow-glow" />
                        <div className="h-1 w-20 rounded-full bg-white/10" />
                        <div className="h-1 w-20 rounded-full bg-white/10" />
                    </div>
                </div>

                {/* Calendar Preview */}
                <div className="glass rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-extrabold tracking-tight">Schedule</h2>
                        <Calendar size={20} className="text-gray-500" />
                    </div>
                    <div className="space-y-4">
                        {[
                            { time: "07:00 AM", task: "HIIT Core Blast", type: "Workout", color: "border-primary" },
                            { time: "12:30 PM", task: "High Protein Lunch", type: "Meal", color: "border-emerald-400" },
                            { time: "05:00 PM", task: "Stretching & Mobility", type: "Recovery", color: "border-purple-400" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 hover:bg-black/30 transition-all cursor-pointer border-l-4 group" style={{ borderColor: item.color }}>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-500 group-hover:text-primary transition-colors">{item.time}</p>
                                    <p className="text-sm font-bold text-white mt-0.5">{item.task}</p>
                                </div>
                                <div className="text-xs font-bold text-gray-400 px-2 py-1 rounded-md bg-white/5">
                                    {item.type}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Workout History & PRs - standard in apps like Fitbod, Strong, Nike TC */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass rounded-3xl p-6 md:p-8 border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                                <History size={20} />
                            </div>
                            <h2 className="text-xl font-extrabold tracking-tight">Workout History</h2>
                        </div>
                        <Link href="/dashboard/workouts" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                            View all <ChevronRight size={14} />
                        </Link>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Past sessions and volume trends. Track consistency over time.</p>
                    <div className="space-y-2">
                        {loading ? (
                            <div className="h-20 rounded-xl bg-white/5 animate-pulse" />
                        ) : (stats?.totalWorkouts ?? 0) > 0 ? (
                            <p className="text-white font-bold">{stats?.totalWorkouts} sessions logged. Keep it up.</p>
                        ) : (
                            <p className="text-gray-500 text-sm">Complete a workout to see history here.</p>
                        )}
                    </div>
                </div>
                <div className="glass rounded-3xl p-6 md:p-8 border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                            <Medal size={20} />
                        </div>
                        <h2 className="text-xl font-extrabold tracking-tight">Personal Records</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">1RMs and rep PRs. Compare with top apps like Strong and Fitbod.</p>
                    <p className="text-gray-500 text-sm">PRs will appear here once you log heavy sets. Track max lifts in session.</p>
                </div>
            </div>

            {/* Leaderboard preview when data exists */}
            {!loading && leaderboard.length > 0 && (
                <div className="glass rounded-3xl p-6 md:p-8 border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <Trophy size={24} className="text-amber-400" />
                        <h2 className="text-xl font-extrabold tracking-tight">Global Leaderboard</h2>
                        <Link href="/dashboard/social" className="ml-auto text-sm font-semibold text-primary hover:underline">See full ranking</Link>
                    </div>
                    <ul className="space-y-2">
                        {leaderboard.slice(0, 5).map((entry: any, i: number) => (
                            <li key={entry?.id ?? i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                <span className="text-gray-400 font-mono">#{i + 1}</span>
                                <span className="text-white font-medium truncate flex-1 mx-3">{entry?.name ?? entry?.userName ?? "Athlete"}</span>
                                <span className="text-primary font-bold">{entry?.xp ?? entry?.score ?? "—"}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Persistence Heatmap */}
            <ShredHeatmap data={heatmapData} year={new Date().getFullYear()} />
        </div>
    );
}
