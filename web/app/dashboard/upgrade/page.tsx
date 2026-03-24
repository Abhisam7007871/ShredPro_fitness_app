"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { Check, Zap, Shield, Crown, Star, RefreshCcw } from "lucide-react";

const TIERS = [
    {
        id: "BASIC",
        name: "Standard Clearance",
        price: "Free",
        icon: Shield,
        color: "blue",
        features: ["Standard Exercise Library", "Basic Progress Tracking", "Community Feed Access"]
    },
    {
        id: "PRO",
        name: "Professional Athlete",
        price: "$19.99/mo",
        icon: Star,
        color: "purple",
        features: ["AI-Generated Plans (GPT-5.2)", "Adaptive Weight Tracking", "Intermediate Exercise Access", "Streak Intelligence Heatmap"]
    },
    {
        id: "ELITE",
        name: "The Elite Operator",
        price: "$49.99/mo",
        icon: Crown,
        color: "primary",
        features: ["Sora 2 AI Virtual Trainer", "Full Elite Exercise Library", "Biometric Heatmap Analysis", "Priority Global Leaderboard"]
    }
];

export default function UpgradeHub() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState<string | null>(null);
    const currentUserTier = (session?.user as any)?.membershipLevel || "BASIC";

    const handleUpgrade = async (tier: string) => {
        if (!session?.user) return;
        setLoading(tier);
        try {
            // Correcting to use email instead of id as per UserController
            await api.put(`/users/${session.user.email}/membership`, {
                membershipLevel: tier
            });

            // Trigger session update to reflect new tier immediately in UI
            await update({ membershipLevel: tier });

            setLoading(null);
            alert(`CLEARANCE UPGRADED: YOU ARE NOW ${tier} STATUS.`);
        } catch (err) {
            console.error("Upgrade failed", err);
            setLoading(null);
        }
    };

    return (
        <main className="min-h-screen p-6 md:p-12 space-y-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase">Clearance Protocol</h1>
                    <p className="text-gray-500 font-medium uppercase tracking-[0.3em] text-xs">Elevate Your Performance Intelligence</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {TIERS.map((tier) => {
                        const Icon = tier.icon;
                        const isCurrent = currentUserTier === tier.id;

                        return (
                            <div
                                key={tier.id}
                                className={`glass-tactical p-8 flex flex-col space-y-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 ${isCurrent ? 'border-primary/50 shadow-[0_0_30px_rgba(255,59,48,0.15)]' : 'border-white/5'}`}
                            >
                                {isCurrent && (
                                    <div className="absolute top-4 right-4 bg-primary text-black text-[10px] font-black px-2 py-1 uppercase rounded tracking-widest">Active</div>
                                )}

                                <div className="space-y-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${tier.color}/10 border border-${tier.color}/20`}>
                                        <Icon className={`w-8 h-8 text-${tier.color === 'primary' ? 'primary' : tier.color + '-400'}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight italic">{tier.name}</h2>
                                        <p className="text-3xl font-bold mt-2 font-heading">{tier.price}</p>
                                    </div>
                                </div>

                                <ul className="flex-1 space-y-4 pt-8 border-t border-white/5">
                                    {tier.features.map(f => (
                                        <li key={f} className="flex items-start gap-3 text-sm font-medium text-gray-400">
                                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => !isCurrent && handleUpgrade(tier.id)}
                                    disabled={loading !== null || isCurrent}
                                    className={`w-full py-4 font-black uppercase tracking-widest text-xs transition-all duration-300 rounded-xl flex items-center justify-center gap-2 ${isCurrent
                                        ? "bg-white/5 text-gray-400 cursor-default"
                                        : "bg-primary text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,59,48,0.3)]"
                                        }`}
                                >
                                    {loading === tier.id ? (
                                        <RefreshCcw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4 fill-current" />
                                            {isCurrent ? "Current Level" : `Activate ${tier.id}`}
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
