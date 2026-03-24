"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8 shadow-glow">
                <AlertTriangle size={40} />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4 text-white">
                Operation Halted
            </h1>
            <p className="text-gray-400 font-medium max-w-md mb-10 uppercase tracking-widest text-xs">
                AN UNEXPECTED FRAGMENTATION HAS OCCURRED IN THE RENDERING CORE. STAND BY FOR RE-SYNCHRONIZATION.
            </p>
            <button
                onClick={() => reset()}
                className="px-10 py-4 bg-primary text-black font-extrabold uppercase tracking-widest text-xs rounded hover:scale-105 transition-all shadow-glow flex items-center gap-2"
            >
                <RefreshCw size={16} /> Re-Sync Protocol
            </button>
        </div>
    );
}
