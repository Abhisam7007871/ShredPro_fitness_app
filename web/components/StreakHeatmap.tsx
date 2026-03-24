"use client";

import React, { useMemo } from 'react';

interface HeatmapProps {
    data: { date: string; count: number }[];
    theme?: 'cyan' | 'purple' | 'emerald';
}

export default function StreakHeatmap({ data, theme = 'cyan' }: HeatmapProps) {
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

    // Generate last 365 days
    const days = useMemo(() => {
        const result = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const entry = data.find(item => item.date === dateStr);
            result.push({
                date: dateStr,
                count: entry ? entry.count : 0,
                dayOfWeek: d.getDay(),
                month: d.getMonth()
            });
        }
        return result;
    }, [data]);

    const getColor = (count: number) => {
        if (count === 0) return 'bg-white/5';
        if (count === 1) return theme === 'cyan' ? 'bg-cyan-900/40' : 'bg-purple-900/40';
        if (count === 2) return theme === 'cyan' ? 'bg-cyan-700/60' : 'bg-purple-700/60';
        if (count >= 3) return theme === 'cyan' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(0,217,255,0.4)]' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]';
        return 'bg-white/5';
    };

    // Grouping by weeks for the grid layout
    const weeks: any[][] = [];
    let currentWeek: any[] = [];

    // Pad first week if necessary
    const firstDay = new Date(days[0].date).getDay();
    for (let i = 0; i < firstDay; i++) {
        currentWeek.push(null);
    }

    days.forEach(day => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return (
        <div className="glass-tactical p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Activity Intelligence Heatmap
                </h4>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-white/5"></div>
                        <div className={`w-3 h-3 rounded-sm ${theme === 'cyan' ? 'bg-cyan-900/40' : 'bg-purple-900/40'}`}></div>
                        <div className={`w-3 h-3 rounded-sm ${theme === 'cyan' ? 'bg-cyan-500' : 'bg-purple-500'}`}></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="flex gap-1 min-w-max">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    title={day ? `${day.count} submissisons on ${day.date}` : ""}
                                    className={`w-3 h-3 rounded-sm transition-all duration-300 hover:scale-125 ${day ? getColor(day.count) : 'bg-transparent'}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-gray-600 px-1">
                {months.map(m => <span key={m}>{m}</span>)}
            </div>
        </div>
    );
}
