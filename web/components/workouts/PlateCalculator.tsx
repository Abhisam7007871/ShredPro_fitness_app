"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface PlateCalculatorProps {
    targetWeight: number;
    barWeight?: number;
    onClose: () => void;
}

export default function PlateCalculator({ targetWeight, barWeight = 20, onClose }: PlateCalculatorProps) {
    const plates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const weightPerSide = (targetWeight - barWeight) / 2;

    let remainingWeight = weightPerSide;
    const requiredPlates: number[] = [];

    plates.forEach(plate => {
        while (remainingWeight >= plate) {
            requiredPlates.push(plate);
            remainingWeight -= plate;
        }
    });

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
            <div className="max-w-md w-full glass-tactical p-10 border-primary/20 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Plate <span className="text-primary">Calculator</span></h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Target: {targetWeight} KG • Bar: {barWeight} KG</p>

                <div className="space-y-6">
                    <div className="flex items-center justify-center gap-1 mb-10 overflow-x-auto pb-4">
                        {/* Visual Barbell Representation */}
                        <div className="h-4 w-10 bg-gray-700 rounded-l-full shrink-0" />
                        <div className="flex items-center gap-1">
                            {requiredPlates.map((plate, i) => (
                                <div
                                    key={i}
                                    className={`rounded-lg border font-black text-[10px] flex items-center justify-center transition-all animate-in zoom-in-50 duration-300`}
                                    style={{
                                        width: `${24 + (plate * 0.5)}px`,
                                        height: `${60 + (plate * 0.8)}px`,
                                        backgroundColor: plate >= 20 ? '#ef4444' : plate >= 15 ? '#f59e0b' : plate >= 10 ? '#3b82f6' : '#6b7280',
                                        borderColor: 'rgba(255,255,255,0.2)'
                                    }}
                                >
                                    {plate}
                                </div>
                            ))}
                        </div>
                        <div className="h-8 w-4 bg-gray-600 rounded-r-md shrink-0" />
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest text-center">Load per side</p>
                        <div className="grid grid-cols-2 gap-4">
                            {plates.map(plate => {
                                const count = requiredPlates.filter(p => p === plate).length;
                                if (count === 0) return null;
                                return (
                                    <div key={plate} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <span className="text-xl font-black text-white italic">{plate} <span className="text-[10px] text-gray-500 not-italic uppercase ml-1">KG</span></span>
                                        <span className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/30 text-primary flex items-center justify-center font-black text-sm">x {count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-gray-200 active:scale-95"
                >
                    Acknowledge Calculation
                </button>
            </div>
        </div>
    );
}
