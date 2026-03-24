"use client";

import { useEffect, useState } from "react";
import { Award, Trophy, TrendingUp, Zap } from "lucide-react";
import api from "@/lib/api";

export default function LeaderboardWidget() {
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const res = await api.get("/social/leaderboard");
                setRankings(res.data.slice(0, 5)); // Top 5
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, []);

    if (loading) return <div className="animate-pulse h-64 bg-white/5 rounded-3xl" />;

    return (
        <div className="glass-tactical p-8 border-primary/20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Global <span className="text-primary">Rankings</span></h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Sector 7 Operational Volume</p>
                </div>
                <Trophy className="text-primary w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-4">
                {rankings.map((user, index) => (
                    <div key={user.userId} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <span className={`text-lg font-black italic w-6 ${index === 0 ? 'text-primary' : 'text-gray-600'}`}>
                                #0{index + 1}
                            </span>
                            <div>
                                <p className="text-xs font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">{user.username}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${user.rankTier === 'ELITE' ? 'bg-red-500/20 text-red-400' :
                                        user.rankTier === 'PRO' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {user.rankTier}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                                    <span className="text-[8px] font-bold text-gray-500 uppercase">{user.currentStreak} Day Streak</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-white italic tracking-tighter">
                                {(user.totalVolumeKG / 1000).toFixed(1)}K <span className="text-[8px] text-gray-500 not-italic uppercase">VOL</span>
                            </p>
                            <TrendingUp size={12} className="text-primary ml-auto mt-1" />
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-8 py-3 bg-primary/10 border border-primary/20 rounded-xl text-[9px] font-black text-primary uppercase tracking-widest hover:bg-primary/20 transition-all">
                View Global Sector
            </button>
        </div>
    );
}

