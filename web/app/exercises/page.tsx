"use client";

import { useState } from "react";
import { Play, Search, Filter, Zap, ChevronRight } from "lucide-react";

const EXERCISES = [
    { id: "1", name: "Incline Barbell Bench Press", muscle: "Upper Chest", equipment: "Barbell", tier: "BASIC" },
    { id: "2", name: "Bulgarian Split Squat", muscle: "Quads/Glutes", equipment: "Dumbbells", tier: "BASIC" },
    { id: "3", name: "Weighted Pull-ups", muscle: "Lats/Biceps", equipment: "Bodyweight/Belt", tier: "INTERMEDIATE" },
    { id: "4", name: "Cable Lateral Raise", muscle: "Side Delts", equipment: "Cable", tier: "INTERMEDIATE" },
    { id: "5", name: "Zercher Squat", muscle: "Full Body", equipment: "Barbell", tier: "ELITE" },
    { id: "6", name: "Muscle-up Protocol", muscle: "Upper Body", equipment: "Rings/Bar", tier: "ELITE" },
];

import { useSession } from "next-auth/react";
import { Lock, Crown, ShieldAlert } from "lucide-react";

export default function ExerciseLibrary() {
    const { data: session } = useSession();
    const user = session?.user as any;
    const membership = user?.membershipLevel?.toUpperCase() || "BASIC";

    const [selected, setSelected] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState<string | null>(null);

    const checkAccess = (tier: string) => {
        if (membership === "ELITE") return true;
        if (membership === "PRO" && (tier === "BASIC" || tier === "INTERMEDIATE")) return true;
        if (membership === "BASIC" && tier === "BASIC") return true;
        return false;
    };

    const generateSoraDemo = async (ex: any) => {
        if (!checkAccess(ex.tier)) {
            setShowUpgrade(ex.tier);
            return;
        }
        setIsGenerating(true);
        // Simulate Sora 2 API Call
        setTimeout(() => {
            setIsGenerating(false);
            setSelected(ex.name);
        }, 3000);
    };

    return (
        <main className="min-h-screen bg-background relative px-6 py-12">
            <div className="absolute inset-0 tactical-grid opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <h1 className="text-6xl font-extrabold italic mb-4">EXERCISE INTEL</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <input
                                type="text"
                                placeholder="SEARCH DATABASE..."
                                className="w-full bg-surface border border-white/10 p-4 pl-12 outline-none focus:border-primary/50 transition-all font-heading uppercase tracking-widest"
                            />
                        </div>
                        <button className="btn-secondary flex items-center justify-center">
                            <Filter className="mr-2 w-4 h-4" />
                            Filter Protocol
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-2 space-y-4">
                        {EXERCISES.map((ex) => {
                            const hasAccess = checkAccess(ex.tier);
                            return (
                                <div
                                    key={ex.id}
                                    className={`glass-tactical p-6 flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden ${!hasAccess ? 'opacity-60 grayscale' : ''}`}
                                    onClick={() => generateSoraDemo(ex)}
                                >
                                    {!hasAccess && (
                                        <div className="absolute top-0 right-0 p-2">
                                            <Lock className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold italic tracking-wide group-hover:text-primary transition-colors">{ex.name}</h3>
                                            {ex.tier === "ELITE" && <Crown className="w-4 h-4 text-secondary drop-shadow-glow" />}
                                        </div>
                                        <div className="flex space-x-4 mt-2">
                                            <span className="text-xs uppercase font-heading font-bold text-text-muted tracking-widest bg-white/5 px-2 py-1">{ex.muscle}</span>
                                            <span className="text-xs uppercase font-heading font-bold text-text-muted tracking-widest bg-white/5 px-2 py-1">{ex.equipment}</span>
                                            <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded ${ex.tier === 'BASIC' ? 'bg-gray-500/20 text-gray-400' : ex.tier === 'INTERMEDIATE' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                                                {ex.tier}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right hidden md:block">
                                            <span className="block text-xs uppercase font-heading font-bold text-primary tracking-widest">Sora 2 Ready</span>
                                            <span className="text-xs text-text-muted">8s CINEMATIC DEMO</span>
                                        </div>
                                        <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                            {hasAccess ? <Play className="w-5 h-5 text-primary fill-current" /> : <Lock className="w-5 h-5 text-gray-500" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Video Preview / AI Status */}
                    <div className="lg:col-span-1">
                        <div className="glass-tactical aspect-[9/16] relative flex flex-col items-center justify-center overflow-hidden border-primary/20 bg-black/60 sticky top-24">
                            {showUpgrade ? (
                                <div className="text-center p-8 animate-in fade-in zoom-in duration-300">
                                    <ShieldAlert className="w-16 h-16 text-primary mx-auto mb-6" />
                                    <h4 className="text-3xl font-black italic mb-4 uppercase leading-none">Access Restricted</h4>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-8">
                                        This {showUpgrade} protocol requires a higher clearance level.
                                    </p>
                                    <button className="w-full py-4 bg-primary text-black font-black uppercase tracking-widest text-xs rounded hover:scale-105 transition-all shadow-glow mb-4">
                                        Upgrade to {showUpgrade === 'ELITE' ? 'ELITE' : 'PRO'}
                                    </button>
                                    <button onClick={() => setShowUpgrade(null)} className="text-[10px] font-black uppercase text-gray-500 hover:text-white tracking-widest transition-colors">
                                        Return to Database
                                    </button>
                                </div>
                            ) : isGenerating ? (
                                <div className="text-center p-8">
                                    <Zap className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
                                    <h4 className="text-2xl font-extrabold italic mb-2">GENERATING INTEL</h4>
                                    <p className="text-xs text-text-muted uppercase tracking-widest">Sora 2 Cinematic Engine Rendering...</p>
                                </div>
                            ) : selected ? (
                                <div className="w-full h-full relative group">
                                    {/* Placeholder for Video */}
                                    <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                        <Play className="w-16 h-16 text-white/20 mb-4" />
                                        <h4 className="text-xl font-bold italic">{selected}</h4>
                                        <p className="text-xs text-primary uppercase font-bold mt-2 tracking-[.2em]">Cinematic Demonstration Loaded</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-12 text-white/5">
                                    <Activity className="w-20 h-20 mx-auto mb-4" />
                                    <p className="font-heading font-bold uppercase tracking-[.3em]">Select Protocol to View Demo</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

import { Activity } from "lucide-react";
