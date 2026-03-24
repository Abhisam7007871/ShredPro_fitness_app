"use client";

import { Trophy, Zap, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface PRAlertProps {
    exerciseName: string;
    weight: number;
    onClose: () => void;
}

export default function PRAlert({ exerciseName, weight, onClose }: PRAlertProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 500);
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[500] transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
            <div className="glass-tactical p-6 pr-12 border-primary shadow-[0_0_50px_rgba(255,59,48,0.3)] bg-gradient-to-r from-primary/20 to-black/80 flex items-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-black shadow-glow animate-bounce">
                    <Trophy size={32} fill="currentColor" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Star className="text-primary w-3 h-3 fill-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Elite Achievement Unlocked</span>
                    </div>
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">New Personal <span className="text-primary">Record</span></h4>
                    <p className="text-xs font-bold text-gray-400 uppercase mt-1">
                        {exerciseName} • <span className="text-white">{weight} KG</span> Sector Lead Established
                    </p>
                </div>

                <div className="absolute -right-8 -bottom-8 opacity-10 text-primary">
                    <Zap size={120} fill="currentColor" />
                </div>
            </div>
        </div>
    );
}

