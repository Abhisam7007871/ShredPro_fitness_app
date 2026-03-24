"use client";

import React from 'react';
import { Flame, Award, Zap, TrendingUp, Star } from 'lucide-react';

interface StreakProps {
    currentStreak: number;
    longestStreak: number;
    xp: number;
}

export default function StreakStats({ currentStreak, longestStreak, xp }: StreakProps) {
    const multiplier = (1 + (currentStreak * 0.1)).toFixed(1);
    const rankTier = Math.floor(xp / 5000) + 1;
    const progress = (xp % 5000) / 5000 * 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Current Streak */}
            <div className="glass rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group hover:border-orange-500/30 transition-all">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Flame size={120} className="text-orange-500" />
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                        <Flame size={24} fill="currentColor" />
                    </div>
                    {currentStreak > 0 && (
                        <div className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                            {multiplier}x MULTIPLIER
                        </div>
                    )}
                </div>
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Current Streak</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-black text-white italic">{currentStreak}</p>
                    <span className="text-orange-500 font-black text-sm uppercase tracking-tighter">Days On Fire</span>
                </div>
            </div>

            {/* Longest Streak */}
            <div className="glass rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Award size={120} className="text-emerald-500" />
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                    <Award size={24} />
                </div>
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Personal Best</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-black text-white italic">{longestStreak}</p>
                    <span className="text-emerald-500 font-black text-sm uppercase tracking-tighter">All-Time High</span>
                </div>
            </div>

            {/* Persistence XP */}
            <div className="glass rounded-[2rem] p-8 border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={120} className="text-primary" />
                </div>
                <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Star size={14} className="text-primary fill-current" />
                        <span className="text-white font-black text-sm">LEVEL {rankTier}</span>
                    </div>
                </div>
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Performance XP</h3>
                <div className="flex items-baseline gap-2 mb-4">
                    <p className="text-5xl font-black text-white italic">{xp.toLocaleString()}</p>
                    <span className="text-primary font-black text-sm uppercase tracking-tighter">Points Total</span>
                </div>

                {/* Progress Mini Bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary shadow-glow transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-2">Next Rank: {((rankTier) * 5000).toLocaleString()} XP</p>
            </div>
        </div>
    );
}
