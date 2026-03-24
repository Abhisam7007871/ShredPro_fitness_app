"use client";

import { useEffect, useState } from "react";
import { CreditCard, ChevronLeft, Crown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

import { useSession } from "next-auth/react";

export default function MembershipSettingsPage() {
    const { data: session } = useSession();
    const user = session?.user as any;

    const membershipLevel = user?.membershipLevel || user?.membership || "Basic";

    const tiers = [
        { name: "Basic", price: "$4", features: ["Limited library", "Basic routines", "Essential tracking"] },
        { name: "Pro", price: "$9", features: ["Full exercise library", "AI Pro Plan generator", "Advanced tracking", "Nutrition insights"] },
        { name: "Elite", price: "$15", features: ["Extra advanced exercises", "AI Personalized progression", "Priority support", "Team connectivity"] },
    ];

    const handleUpdateMembership = async (level: string) => {
        try {
            await api.put(`/users/${user.email}/membership`, { membershipLevel: level });
            window.location.reload(); // Refresh to update session
        } catch (err) {
            console.error("Failed to update membership", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/profile" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-3xl font-black text-white tracking-tight">Access Control</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`glass rounded-[2rem] p-8 border ${membershipLevel === tier.name ? 'border-primary shadow-glow' : 'border-white/5'} flex flex-col`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-black text-white italic">{tier.name}</h3>
                            {membershipLevel === tier.name && <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-1 rounded">Active</span>}
                        </div>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-black text-white">{tier.price}</span>
                            <span className="text-gray-500 text-sm">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {tier.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs text-gray-400 font-bold leading-tight">
                                    <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            disabled={membershipLevel === tier.name}
                            onClick={() => handleUpdateMembership(tier.name)}
                            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${membershipLevel === tier.name
                                ? 'bg-white/5 text-gray-500 cursor-default'
                                : 'bg-primary text-black hover:scale-105 shadow-glow'
                                }`}
                        >
                            {membershipLevel === tier.name ? "Current Plan" : "Switch Plan"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="glass rounded-[2rem] p-10 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 italic">
                    <CreditCard className="text-orange-400" size={24} /> SECURE CLEARANCE
                </h3>
                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-6">
                        <div className="h-10 w-16 rounded-lg bg-white flex items-center justify-center shadow-lg">
                            <span className="text-blue-800 font-black italic text-lg">VISA</span>
                        </div>
                        <div>
                            <p className="text-white font-bold tracking-widest">•••• •••• •••• 4242</p>
                            <p className="text-xs text-gray-500 font-bold uppercase">Expires 12/28</p>
                        </div>
                    </div>
                    <button className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-black text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">Update</button>
                </div>
            </div>
        </div>
    );
}
