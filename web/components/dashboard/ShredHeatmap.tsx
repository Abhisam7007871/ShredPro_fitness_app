"use client";

import React, { useMemo } from 'react';

interface HeatmapProps {
    data: [string, number][]; // [date, count]
    year: number;
}

export default function ShredHeatmap({ data, year }: HeatmapProps) {
    const intensityColors = [
        'bg-white/5',       // 0: None
        'bg-primary/20',     // 1: Light
        'bg-primary/40',     // 2: Medium
        'bg-primary/70',     // 3: Intense
        'bg-primary shadow-[0_0_8px_rgba(255,59,48,0.4)]', // 4: MAX (Elite)
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const activityMap = useMemo(() => {
        const map: Record<string, number> = {};
        data.forEach(([date, count]) => {
            map[date] = (map[date] || 0) + count;
        });
        return map;
    }, [data]);

    // Grouping by months as separate "boxes"
    const monthlyData = useMemo(() => {
        const result = [];
        for (let m = 0; m < 12; m++) {
            const daysInMonth = [];
            const date = new Date(year, m, 1);
            const activeDays = new Set();

            while (date.getMonth() === m) {
                const dateStr = date.toISOString().split('T')[0];
                const count = activityMap[dateStr] || 0;
                if (count > 0) activeDays.add(dateStr);
                daysInMonth.push({ date: dateStr, count });
                date.setDate(date.getDate() + 1);
            }
            result.push({
                name: months[m],
                days: daysInMonth,
                activeCount: activeDays.size
            });
        }
        return result;
    }, [year, activityMap]);

    return (
        <div className="glass-tactical p-10 border-white/5 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Persistence Protocol</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Operational Activity Log • {year}</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Active Days</p>
                        <p className="text-2xl font-black text-primary">{data.length}</p>
                    </div>
                    <div className="flex gap-1.5 p-2 bg-white/5 rounded-lg border border-white/10">
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-3 w-3 rounded-sm ${intensityColors[i]}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {monthlyData.map((month, idx) => (
                    <div key={idx} className="space-y-3 group">
                        <div className="flex items-end justify-between px-1">
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                                {month.name}
                            </span>
                            <span className="text-[10px] font-black text-primary uppercase">
                                {month.activeCount} DAYS
                            </span>
                        </div>

                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex flex-wrap gap-1 aspect-square h-32 w-full content-start overflow-hidden hover:bg-white/[0.05] transition-all hover:border-white/10">
                            {month.days.map((day, dIdx) => (
                                <div
                                    key={dIdx}
                                    title={`${day.date}: ${day.count} submissisons`}
                                    className={`h-2.5 w-2.5 rounded-[1px] ${intensityColors[Math.min(day.count, 4)]} transition-all duration-300 hover:scale-150`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
