"use client";

import { useState } from "react";

interface RPEInputProps {
    value: number;
    onChange: (value: number) => void;
}

export default function RPEInput({ value, onChange }: RPEInputProps) {
    const rpeLevels = [
        { val: 6, label: "Warmup" },
        { val: 7, label: "Manageable" },
        { val: 8, label: "Hard" },
        { val: 9, label: "Very Hard" },
        { val: 10, label: "Max Effort" },
    ];

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Intensity (RPE)</p>
            <div className="flex items-center gap-2">
                {rpeLevels.map((level) => (
                    <button
                        key={level.val}
                        onClick={() => onChange(level.val)}
                        className={`group relative flex flex-col items-center transition-all ${value === level.val
                                ? "scale-110"
                                : "opacity-30 hover:opacity-100"
                            }`}
                    >
                        <div
                            className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-lg shadow-glow-sm transition-all ${value === level.val
                                    ? "bg-primary border-primary text-black"
                                    : "bg-white/5 border-white/10 text-white hover:border-primary/50"
                                }`}
                        >
                            {level.val}
                        </div>
                        <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-opacity ${value === level.val ? "opacity-100 text-primary" : "opacity-0"
                            }`}>
                            {level.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
