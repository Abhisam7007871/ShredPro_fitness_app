"use client";

import { useEffect, useState } from "react";
import { Utensils, Zap, Flame, Droplets, Target, ChevronRight, Sparkles, Clock, Plus } from "lucide-react";
import api from "@/lib/api";
import { useSession } from "next-auth/react";

export default function DietPage() {
    const [generating, setGenerating] = useState(false);
    const [selectedDay, setSelectedDay] = useState("Today");

    const [meals, setMeals] = useState<any[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user) {
            fetchDietPlan();
        }
    }, [session]);

    const fetchDietPlan = async () => {
        try {
            const res = await api.get(`/diet/user/${(session?.user as any).id}`);
            if (res.data && res.data.length > 0) {
                const plan = res.data[0];
                try {
                    const parsed = JSON.parse(plan.aiAdvice);
                    setMeals(parsed.meals || []);
                } catch (e) {
                    console.log("Could not parse AI Diet Json", plan.aiAdvice);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleGenerate = async () => {
        if (!session?.user) return;
        setGenerating(true);
        try {
            // Using a generic goal, the backend will fetch the user's specific biometrics
            const res = await api.post(`/diet/generate?userId=${(session?.user as any).id}&goal=OPTIMIZE`);
            const plan = res.data;
            try {
                const parsed = JSON.parse(plan.aiAdvice);
                setMeals(parsed.meals || []);
            } catch (e) { }
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const macros = [
        { label: "Protein", current: 142, goal: 180, color: "bg-emerald-400", text: "text-emerald-400", icon: Flame },
        { label: "Carbs", current: 210, goal: 250, color: "bg-primary", text: "text-primary", icon: Zap },
        { label: "Fats", current: 58, goal: 70, color: "bg-orange-400", text: "text-orange-400", icon: Droplets },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Nutrition <span className="text-neon">Command</span></h1>
                    <p className="text-gray-400 font-medium">Precision-engineered fueling for elite performance.</p>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="bg-primary hover:scale-105 active:scale-95 text-black font-black px-8 py-3 rounded-2xl transition-all shadow-glow flex items-center gap-2"
                >
                    {generating ? <Zap className="animate-spin" size={20} /> : <Sparkles size={20} fill="currentColor" />}
                    {generating ? "Calculating..." : "Update AI Diet"}
                </button>
            </div>

            {/* Macros Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {macros.map((macro, i) => {
                    const progress = (macro.current / macro.goal) * 100;
                    const Icon = macro.icon;
                    return (
                        <div key={i} className="glass rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`h-12 w-12 rounded-2xl ${macro.color}/10 ${macro.text} flex items-center justify-center`}>
                                    <Icon size={24} />
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Remaining</span>
                                    <p className="text-xl font-black text-white leading-none">{macro.goal - macro.current}g</p>
                                </div>
                            </div>

                            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">{macro.label} Intake</h3>
                            <div className="flex items-baseline gap-2 mb-6">
                                <p className="text-4xl font-black text-white">{macro.current}</p>
                                <span className="text-gray-500 font-bold text-lg">/ {macro.goal}g</span>
                            </div>

                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${macro.color} shadow-glow transition-all duration-1000 ease-out`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Meal Timeline */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight">Daily Timeline</h2>
                        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                            {["Yesterday", "Today", "Tomorrow"].map((day) => (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedDay === day ? "bg-primary text-black shadow-glow" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-4">
                        <div className="space-y-4">
                            {meals.map((meal, i) => (
                                <div key={i} className="group relative flex items-start gap-6 p-6 rounded-[2rem] hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                                    <div className="flex flex-col items-center gap-2 mt-1">
                                        <div className="h-10 w-10 rounded-xl bg-black/40 flex items-center justify-center text-xl shadow-inner">
                                            {meal.icon}
                                        </div>
                                        {i !== meals.length - 1 && <div className="w-0.5 h-full bg-white/5 rounded-full min-h-[40px]" />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-lg font-black text-white group-hover:text-primary transition-colors">{meal.name}</h4>
                                            <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                                <Clock size={12} />
                                                {meal.time || "Scheduled"}
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest leading-none block mb-4 ${meal.type === 'VEGAN' ? 'text-green-400' :
                                            meal.type === 'VEG' ? 'text-emerald-400' :
                                                'text-red-400'
                                            }`}>
                                            {meal.type || "Macro-Balanced"}
                                        </span>
                                        <p className="text-xs text-gray-400 font-medium mb-4">{meal.description || "High nutritional density."}</p>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-xs font-black text-gray-300">
                                                <Flame size={14} className="text-orange-400" />
                                                {meal.calories} kcal
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                {meal.macros?.protein && `P:${meal.macros.protein}g | C:${meal.macros.carbs}g | F:${meal.macros.fat}g`}
                                            </div>
                                        </div>
                                    </div>

                                    <button className="self-center h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-all opacity-0 group-hover:opacity-100">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Nutrition Insights */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-black tracking-tight text-white">Advanced Insights</h2>

                    <div className="glass rounded-[2rem] p-8 border border-white/10 bg-gradient-to-br from-[#1a1a2e] to-transparent">
                        <div className="h-10 w-10 rounded-xl bg-orange-400/20 text-orange-400 flex items-center justify-center mb-6">
                            <Target size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 leading-tight">Metabolic Efficiency</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">Your body is currently efficiently utilizing fats for low-intensity recovery. Maintain current carb levels to support ATP replenishment.</p>
                        <ul className="space-y-3">
                            {["Hydration: 2.4/3.5L", "Sodium: Optimal", "Fiber: +5g Needed"].map((tip, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-300">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass rounded-[2rem] p-8 border border-white/5 relative group cursor-pointer overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Plus size={80} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-black text-white mb-2">Supplement Stack</h3>
                        <p className="text-xs text-gray-500 mb-6">Track your extra performance boosters and micronutrients.</p>
                        <button className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                            Configure Stack <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
