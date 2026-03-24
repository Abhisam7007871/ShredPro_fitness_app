"use client";

import { useState, useEffect } from "react";
import { Play, X, Zap, ShieldAlert, Cpu } from "lucide-react";
import api from "@/lib/api";

interface AIVideoDemoProps {
    exerciseName: string;
    onClose: () => void;
}

export default function AIVideoDemo({ exerciseName, onClose }: AIVideoDemoProps) {
    const [loading, setLoading] = useState(true);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.post("/media/generate", null, {
                    params: {
                        exerciseName,
                        prompt: `Expert-level form for ${exerciseName}, cinematic lighting, instructional drill, 4k, technical visualization`
                    }
                });

                // Simulate generation delay for Sora-2 logic
                if (res.data.status === "GENERATING") {
                    await new Promise(r => setTimeout(r, 3000));
                    const poll = await api.post("/media/generate", null, {
                        params: { exerciseName, prompt: "" }
                    });
                    setVideoUrl(poll.data.videoUrl);
                } else {
                    setVideoUrl(res.data.videoUrl);
                }
            } catch (err) {
                console.error(err);
                setError("Neural Link Interrupted. Failed to stream tactical demo.");
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [exerciseName]);

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[300] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full glass-tactical border-primary/30 overflow-hidden relative">
                <button onClick={onClose} className="absolute top-6 right-6 z-50 h-10 w-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black transition-all">
                    <X size={20} />
                </button>

                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                        <Cpu className="text-primary w-5 h-5 animate-pulse" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">AI Tactical Intelligence</span>
                    </div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                        {exerciseName} <span className="text-primary">Protocol</span>
                    </h2>
                </div>

                <div className="aspect-video bg-black/40 relative flex items-center justify-center group">
                    {loading ? (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] animate-pulse">Synthesizing Sora-2 Stream...</div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center gap-4 text-center p-12">
                            <ShieldAlert size={64} className="text-red-500 mb-4" />
                            <p className="text-xl font-black text-white uppercase italic">{error}</p>
                            <button onClick={onClose} className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Abort Link</button>
                        </div>
                    ) : (
                        <>
                            {/* Placeholder Video Player with Premium Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="px-2 py-1 bg-primary/20 border border-primary/30 text-[8px] font-black text-primary rounded uppercase">Sora 2.0 Engine</span>
                                <span className="px-2 py-1 bg-black/40 border border-white/10 text-[8px] font-black text-white rounded uppercase">4K / 60FPS</span>
                            </div>

                            <video
                                src={videoUrl || ""}
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-black text-white uppercase tracking-widest mb-1">Tactical Analysis</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Observe spinal alignment and peak contraction metrics.</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-black shadow-glow">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-8 bg-black/40 flex justify-between items-center">
                    <div className="flex gap-8">
                        <div>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Difficulty</p>
                            <p className="text-xs font-bold text-white uppercase">Advanced Intelligence</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Safety Rating</p>
                            <p className="text-xs font-bold text-emerald-400 uppercase">A+ (Tactical)</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-10 py-4 bg-primary text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-glow hover:scale-105 transition-all"
                    >
                        Master Technique
                    </button>
                </div>
            </div>
        </div>
    );
}
