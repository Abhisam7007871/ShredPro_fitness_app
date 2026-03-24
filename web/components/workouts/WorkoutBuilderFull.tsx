"use client";

import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    Save,
    Clock,
    Target,
    RotateCcw,
    Dumbbell,
    X
} from "lucide-react";
import api from "@/lib/api";

interface Exercise {
    id: string;
    name: string;
    category: string;
    targetMuscleGroups: string[];
    exerciseType: string;
}

interface ScheduledExercise {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: string;
    duration: number;
    type: string;
    restSeconds: number;
}

export default function WorkoutBuilderFull({ onSave }: { onSave: (workout: any) => void }) {
    const [name, setName] = useState("New Shred Routine");
    const [searchQuery, setSearchQuery] = useState("");
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [selectedExercises, setSelectedExercises] = useState<ScheduledExercise[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const res = await api.get("/exercises");
            setAllExercises(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addExercise = (ex: Exercise) => {
        const newItem: ScheduledExercise = {
            exerciseId: ex.id,
            exerciseName: ex.name,
            sets: 3,
            reps: "12",
            duration: ex.exerciseType === "TIME" ? 45 : 0,
            type: ex.exerciseType,
            restSeconds: 60
        };
        setSelectedExercises([...selectedExercises, newItem]);
        setSearchQuery("");
    };

    const removeExercise = (index: number) => {
        const newList = [...selectedExercises];
        newList.splice(index, 1);
        setSelectedExercises(newList);
    };

    const updateExercise = (index: number, fields: Partial<ScheduledExercise>) => {
        const newList = [...selectedExercises];
        newList[index] = { ...newList[index], ...fields };
        setSelectedExercises(newList);
    };

    const filteredOptions = allExercises.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedExercises.some(s => s.exerciseId === ex.id)
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-4xl font-black bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder:text-white/20 italic tracking-tighter"
                    placeholder="UNTITLED ROUTINE"
                />
                <button
                    onClick={() => onSave({ name, exercises: selectedExercises })}
                    className="bg-primary hover:scale-105 active:scale-95 text-black font-black px-10 py-4 rounded-[2rem] transition-all shadow-glow flex items-center gap-3"
                >
                    <Save size={20} />
                    SAVE Shred Pro PROTOCOL
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Exercise Selector */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass rounded-[2.5rem] p-8 border border-white/5">
                        <h3 className="text-xl font-black mb-6 uppercase italic">Add Intel</h3>
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search Database..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500 animate-pulse font-bold uppercase tracking-widest text-xs">Accessing Database...</div>
                            ) : filteredOptions.length > 0 ? (
                                filteredOptions.map(ex => (
                                    <button
                                        key={ex.id}
                                        onClick={() => addExercise(ex)}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-primary hover:text-black transition-all group"
                                    >
                                        <div className="text-left">
                                            <p className="font-bold text-sm tracking-tight">{ex.name}</p>
                                            <p className="text-[10px] uppercase font-black opacity-50">{ex.category}</p>
                                        </div>
                                        <Plus size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))
                            ) : searchQuery ? (
                                <div className="text-center py-10 text-gray-600 font-bold uppercase tracking-widest text-xs">No Intel Found</div>
                            ) : (
                                <div className="text-center py-10 text-gray-600 font-bold uppercase tracking-widest text-xs underline decoration-primary/30">Start Typing...</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Selected Exercises Config */}
                <div className="lg:col-span-2 space-y-4">
                    {selectedExercises.length > 0 ? (
                        selectedExercises.map((ex, idx) => (
                            <div key={idx} className="glass rounded-[2rem] p-6 border border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black italic">
                                            {idx + 1}
                                        </div>
                                        <h4 className="text-xl font-black italic uppercase">{ex.exerciseName}</h4>
                                    </div>
                                    <button
                                        onClick={() => removeExercise(idx)}
                                        className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Sets */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                            <RotateCcw size={10} /> Sets
                                        </label>
                                        <div className="flex items-center gap-2 bg-black/20 rounded-xl p-1 border border-white/5">
                                            <button
                                                onClick={() => updateExercise(idx, { sets: Math.max(1, ex.sets - 1) })}
                                                className="h-8 w-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-gray-400"
                                            >
                                                <ChevronDown size={14} />
                                            </button>
                                            <span className="flex-1 text-center font-black text-white">{ex.sets}</span>
                                            <button
                                                onClick={() => updateExercise(idx, { sets: ex.sets + 1 })}
                                                className="h-8 w-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-gray-400"
                                            >
                                                <ChevronUp size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reps / Duration */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                            <Target size={10} /> {ex.type === "TIME" ? "Duration" : "Reps"}
                                        </label>
                                        <input
                                            type="text"
                                            value={ex.type === "TIME" ? ex.duration : ex.reps}
                                            onChange={(e) => updateExercise(idx, ex.type === "TIME" ? { duration: parseInt(e.target.value) || 0 } : { reps: e.target.value })}
                                            className="w-full bg-black/20 border border-white/5 rounded-xl py-2 px-4 text-center font-black text-white focus:outline-none focus:border-primary/30"
                                        />
                                    </div>

                                    {/* Rest */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                            <Clock size={10} /> Rest (s)
                                        </label>
                                        <input
                                            type="number"
                                            value={ex.restSeconds}
                                            onChange={(e) => updateExercise(idx, { restSeconds: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-black/20 border border-white/5 rounded-xl py-2 px-4 text-center font-black text-white focus:outline-none focus:border-primary/30"
                                        />
                                    </div>

                                    {/* Move Order */}
                                    <div className="flex items-end gap-2 pb-1">
                                        <button className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-gray-500">
                                            <ChevronUp size={18} />
                                        </button>
                                        <button className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-gray-500">
                                            <ChevronDown size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-64 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-600 bg-white/[0.01]">
                            <Dumbbell size={48} className="mb-4 opacity-20" />
                            <p className="font-black uppercase tracking-[0.2em] text-xs">Blueprint is Empty</p>
                            <p className="text-[10px] font-bold mt-2 opacity-50">Add intel from the database to start building.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
