"use client";

import { useState, useEffect } from "react";
import { User, ChevronLeft, Save, ShieldCheck, Activity, Target, Utensils, Globe } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import api from "@/lib/api";

export default function BiometricsSettingsPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState({
        age: "",
        gender: "MALE",
        currentWeight: "",
        height: "",
        goal: "WEIGHT_LOSS",
        dietPreference: "NON_VEG",
        country: "US"
    });

    useEffect(() => {
        if (session?.user) {
            fetchBiometrics();
        }
    }, [session]);

    const fetchBiometrics = async () => {
        try {
            const res = await api.get(`/users/${(session?.user as any).id}`);
            const data = res.data;
            setForm({
                age: data.age?.toString() || "",
                gender: data.gender || "MALE",
                currentWeight: data.currentWeight?.toString() || "",
                height: data.height?.toString() || "",
                goal: data.goal || "WEIGHT_LOSS",
                dietPreference: data.dietPreference || "NON_VEG",
                country: data.country || "US"
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put(`/users/${(session?.user as any).id}/biometrics`, {
                age: parseInt(form.age) || null,
                gender: form.gender,
                currentWeight: parseFloat(form.currentWeight) || null,
                height: parseFloat(form.height) || null,
                goal: form.goal,
                dietPreference: form.dietPreference,
                country: form.country
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <Link href="/dashboard/profile" className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <User className="text-purple-400" /> Data & Biometrics
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Configure physical traits and structural goals.</p>
                </div>
            </div>

            <div className="glass rounded-[2rem] p-8 md:p-10 border border-white/5 space-y-8">
                {/* Physical Metrics */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity size={18} className="text-primary" /> Physical Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Age</label>
                            <input
                                type="number"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                value={form.age}
                                onChange={(e) => setForm({ ...form, age: e.target.value })}
                                placeholder="e.g. 28"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gender</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                value={form.gender}
                                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weight (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                value={form.currentWeight}
                                onChange={(e) => setForm({ ...form, currentWeight: e.target.value })}
                                placeholder="e.g. 75.5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Height (cm)</label>
                            <input
                                type="number"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                value={form.height}
                                onChange={(e) => setForm({ ...form, height: e.target.value })}
                                placeholder="e.g. 180"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Intelligence Vectors */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Target size={18} className="text-orange-400" /> Intelligence Vectors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Globe size={14} /> Region / Localization</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                            >
                                <option value="US">United States (Western Diet Macros)</option>
                                <option value="IN">India (Desi/Indian Localization)</option>
                                <option value="UK">United Kingdom</option>
                                <option value="EU">Europe (Mainland)</option>
                                <option value="OT">Other (Global Base)</option>
                            </select>
                            <p className="text-[10px] text-gray-500 font-bold mt-1">Dictates Food Algorithm recommendations.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Target size={14} /> Primary Goal</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                value={form.goal}
                                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                            >
                                <option value="WEIGHT_LOSS">Weight Loss (Shredding)</option>
                                <option value="MUSCLE_GAIN">Hypertrophy (Bulking)</option>
                                <option value="RECOMP">Body Recomposition</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Utensils size={14} /> Diet Preference</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                value={form.dietPreference}
                                onChange={(e) => setForm({ ...form, dietPreference: e.target.value })}
                            >
                                <option value="NON_VEG">Standard (Non-Vegetarian)</option>
                                <option value="VEG">Vegetarian</option>
                                <option value="VEGAN">Vegan</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-black uppercase tracking-widest transition-all shadow-glow-purple flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : saved ? (
                            <>
                                <ShieldCheck size={20} /> SYNCHRONIZED
                            </>
                        ) : (
                            <>
                                <Save size={20} /> UPDATE BIOMETRICS
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
