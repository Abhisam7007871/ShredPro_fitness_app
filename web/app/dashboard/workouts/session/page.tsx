"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Play,
    Pause,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
    SkipForward,
    X,
    Trophy,
    Flame,
    Clock,
    CheckCircle2,
    Volume2,
    VolumeX,
    Share2,
    Download,
    Settings,
    Calculator,
    Zap,
    Info,
    Eye
} from "lucide-react";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import PlateCalculator from "@/components/workouts/PlateCalculator";
import RPEInput from "@/components/workouts/RPEInput";
import AIVideoDemo from "@/components/workouts/AIVideoDemo";
import PRAlert from "@/components/workouts/PRAlert";

function WorkoutSessionContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();

    // Core State
    const [exercises, setExercises] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [reps, setReps] = useState(10);
    const [weights, setWeights] = useState<{ [key: string]: number }>({});
    const [loggedSets, setLoggedSets] = useState<any[]>([]);
    const [isFinished, setIsFinished] = useState(false);

    // Timer State
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<"WORK" | "REST">("WORK");
    const [totalTime, setTotalTime] = useState(0);
    const startTimeRef = useRef(Date.now());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Tactical State
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [currentRpe, setCurrentRpe] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [showVideoDemo, setShowVideoDemo] = useState(false);
    const [showPR, setShowPR] = useState(false);
    const [lastPR, setLastPR] = useState({ name: "", weight: 0 });
    const [personalBests, setPersonalBests] = useState<{ [key: string]: number }>({});
    const [workoutSettings, setWorkoutSettings] = useState<any>({
        rpeEnabled: true,
        plateCalculatorEnabled: true,
        inlineTimerEnabled: true,
        keepAwakeEnabled: false,
        preferredWeightUnit: "KG"
    });

    const category = searchParams.get("category");
    const exerciseId = searchParams.get("exerciseId");
    const routineId = searchParams.get("routineId");

    useEffect(() => {
        if (session?.user) {
            fetchWorkoutSettings();
            fetchPersonalBests();
        }
    }, [session]);

    const fetchWorkoutSettings = async () => {
        try {
            const res = await api.get(`/workouts/settings/${(session?.user as any).id}`);
            setWorkoutSettings(res.data);
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    };

    const fetchPersonalBests = async () => {
        try {
            // Mock PR fetch for demo
            setPersonalBests({
                "Bench Press": 80,
                "Deadlift": 120,
                "Squat": 100
            });
        } catch (err) {
            console.error(err);
        }
    };

    const updateWorkoutSettings = async (updated: any) => {
        try {
            const res = await api.put(`/workouts/settings/${(session?.user as any).id}`, updated);
            setWorkoutSettings(res.data);
        } catch (err) {
            console.error("Failed to update settings", err);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                let data: any[] = [];
                if (routineId) {
                    // Fetch the entire routine and parse its exercises
                    const res = await api.get(`/workouts/routines/detail/${routineId}`);
                    const routine = res.data;
                    if (routine?.exercisesJson) {
                        try {
                            const parsed = JSON.parse(routine.exercisesJson);
                            // Enrich each with full exercise data from exercise-service
                            const enriched = await Promise.all(
                                parsed.map(async (ex: any) => {
                                    try {
                                        if (ex.exerciseId) {
                                            const eRes = await api.get(`/exercises/${ex.exerciseId}`);
                                            return { ...eRes.data, sets: ex.sets, reps: ex.reps, restSeconds: ex.restSeconds, weightKg: ex.weightKg };
                                        }
                                        return { id: ex.exerciseId || ex.id, name: ex.exerciseName || ex.name, sets: ex.sets, reps: ex.reps || 10, restSeconds: ex.restSeconds || 60, exerciseType: ex.type || "REPS" };
                                    } catch {
                                        return { id: ex.exerciseId || ex.id, name: ex.exerciseName || ex.name, sets: ex.sets, reps: ex.reps || 10, restSeconds: ex.restSeconds || 60, exerciseType: ex.type || "REPS" };
                                    }
                                })
                            );
                            data = enriched.filter(e => e && e.name);
                        } catch (e) {
                            console.error("Failed to parse exercisesJson", e);
                        }
                    }
                } else if (exerciseId) {
                    const res = await api.get(`/exercises/${exerciseId}`);
                    data = [res.data];
                } else if (category) {
                    const res = await api.get(`/exercises/category/${category}`);
                    data = res.data;
                }
                setExercises(data || []);
                if (data && data.length > 0) {
                    initExercise(data[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [category, exerciseId, routineId]);

    const initExercise = (ex: any) => {
        if (ex.exerciseType === "TIME") {
            setTimeLeft(ex.defaultDuration || 30);
        } else {
            setReps(ex.targetReps || 12);
            setTimeLeft(0);
        }
        setPhase("WORK");
        setIsActive(false);
    };

    const startRest = () => {
        const currentEx = exercises[currentIndex];
        setPhase("REST");
        setTimeLeft(currentEx.restSeconds || 60);
        setIsActive(true);
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        handleNext();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft]);

    const finishWorkout = async () => {
        setIsActive(false);
        setIsFinished(true);
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTotalTime(duration);

        const totalWeight = loggedSets.reduce((sum, s) => sum + (s.weightKg * s.reps), 0);
        const totalRepsCount = loggedSets.reduce((sum, s) => sum + s.reps, 0);

        try {
            await api.post("/workouts/session", {
                userId: (session?.user as any)?.id,
                workoutName: category ? `${category} Session` : exercises[0].name,
                category: category || exercises[0].category,
                totalExercises: exercises.length,
                completedExercises: exercises.length,
                totalDurationSeconds: duration,
                caloriesBurned: Math.floor(duration * 0.15),
                totalWeightKg: totalWeight,
                totalReps: totalRepsCount,
                sets: loggedSets
            });

            // Update leaderboard
            await api.post("/social/leaderboard/update", null, {
                params: {
                    userId: (session?.user as any).id,
                    username: session?.user?.name || "Operator",
                    additionalVolume: totalWeight,
                    additionalWorkouts: 1,
                    currentStreak: 1 // Simple streak for now
                }
            });
        } catch (err) {
            console.error("Failed to save session", err);
        }
    };

    const handleNext = async () => {
        const currentEx = exercises[currentIndex];

        if (phase === "WORK") {
            const currentWeight = weights[currentEx.id] || 0;

            // Log the set
            const newSet = {
                exerciseId: currentEx.id,
                setNumber: currentSet,
                weightKg: currentWeight,
                reps: reps,
                rpe: currentRpe,
                completed: true
            };
            setLoggedSets(prev => [...prev, newSet]);
            setCurrentRpe(0);

            // PR Check
            const prevPB = personalBests[currentEx.name] || 0;
            if (currentWeight > prevPB && currentWeight > 0) {
                setLastPR({ name: currentEx.name, weight: currentWeight });
                setShowPR(true);
                setPersonalBests(prev => ({ ...prev, [currentEx.name]: currentWeight }));
            }

            if (currentSet < (currentEx.sets || 3)) {
                setCurrentSet(prev => prev + 1);
                startRest();
            } else {
                if (currentIndex < exercises.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                    setCurrentSet(1);
                    startRest();
                } else {
                    finishWorkout();
                }
            }
        } else {
            setPhase("WORK");
            initExercise(exercises[currentIndex]);
        }
    };

    const handleBack = () => {
        if (phase === "REST") {
            setPhase("WORK");
            initExercise(exercises[currentIndex]);
        } else if (currentSet > 1) {
            setCurrentSet(prev => Math.max(1, prev - 1));
            initExercise(exercises[currentIndex]);
        } else if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            const prevEx = exercises[currentIndex - 1];
            setCurrentSet(prevEx.sets || 3);
            initExercise(prevEx);
        }
    };

    const handleSkip = () => {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setCurrentSet(1);
            initExercise(exercises[currentIndex + 1]);
        } else {
            finishWorkout();
        }
    };

    if (loading) return (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (exercises.length === 0) return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-10 text-center">
            <h2 className="text-3xl font-black text-white mb-4">No Exercises Found</h2>
            <button onClick={() => router.back()} className="text-primary font-bold underline">Go Back</button>
        </div>
    );

    const currentEx = exercises[currentIndex];
    const progress = ((currentIndex + 1) / exercises.length) * 100;

    if (isFinished) {
        return (
            <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-6 overflow-y-auto">
                <div className="max-w-2xl w-full glass rounded-[3rem] p-12 border border-white/10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-emerald-500 to-primary animate-pulse" />

                    <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow">
                        <Trophy size={48} className="text-black" />
                    </div>

                    <h1 className="text-5xl font-black text-white mb-2 tracking-tight">WORKOUT <span className="text-neon">COMPLETE</span></h1>
                    <p className="text-gray-400 text-lg mb-10 font-medium">Exceptional performance. Your stats are being calibrated.</p>

                    <div className="grid grid-cols-3 gap-6 mb-12">
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                            <Clock className="mx-auto mb-2 text-primary" size={24} />
                            <div className="text-2xl font-black text-white">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Duration</div>
                        </div>
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                            <CheckCircle2 className="mx-auto mb-2 text-emerald-400" size={24} />
                            <div className="text-2xl font-black text-white">{exercises.length}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Exercises</div>
                        </div>
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                            <Flame className="mx-auto mb-2 text-orange-500" size={24} />
                            <div className="text-2xl font-black text-white">{Math.floor(totalTime * 0.15)}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Calories</div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/dashboard/workouts")}
                        className="w-full py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-gray-200 transition-all active:scale-95 shadow-xl"
                    >
                        RETURN TO LAB
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col font-body">
            {/* PR Alert Overlay */}
            {showPR && <PRAlert exerciseName={lastPR.name} weight={lastPR.weight} onClose={() => setShowPR(false)} />}

            {/* Header */}
            <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="h-12 w-12 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                        <X size={24} className="text-white" />
                    </button>
                    <button onClick={() => setShowSettings(true)} className="h-12 w-12 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                        <Settings size={22} className="text-gray-400" />
                    </button>
                    <button
                        onClick={() => router.push(`/dashboard/workouts/exercises/${currentEx.id}`)}
                        className="h-12 w-12 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                        aria-label="How to do it"
                        title="How to do it"
                    >
                        <Info size={22} className="text-gray-400" />
                    </button>
                    <button onClick={() => setShowVideoDemo(true)} className="h-12 w-12 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                        <Eye size={22} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 px-8">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden italic">
                        <div
                            className="h-full bg-primary shadow-glow transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {workoutSettings.plateCalculatorEnabled && (
                        <button onClick={() => setShowCalculator(true)} className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-all">
                            <Calculator size={20} />
                        </button>
                    )}
                    <button onClick={() => setMuted(!muted)} className="h-12 w-12 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                        {muted ? <VolumeX size={20} className="text-gray-500" /> : <Volume2 size={20} className="text-white" />}
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showCalculator && (
                <PlateCalculator
                    targetWeight={weights[currentEx.id] || 0}
                    onClose={() => setShowCalculator(false)}
                />
            )}

            {showSettings && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[250] flex items-center justify-center p-6">
                    <div className="max-w-md w-full glass-tactical p-10 border-white/10">
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8">Session <span className="text-primary">Settings</span></h2>
                        <div className="space-y-6 mb-10">
                            {[
                                { key: 'rpeEnabled', label: 'RPE Tracking', desc: 'Enable intensity mapping for every set' },
                                { key: 'plateCalculatorEnabled', label: 'Plate Calculator', desc: 'Precision load recommendations' },
                                { key: 'inlineTimerEnabled', label: 'Inline Timer', desc: 'Integrated rest and work timing' },
                                { key: 'keepAwakeEnabled', label: 'Keep Awake', desc: 'Prevent screen timeout during session' },
                            ].map((s) => (
                                <div key={s.key} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-widest">{s.label}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{s.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => updateWorkoutSettings({ ...workoutSettings, [s.key]: !workoutSettings[s.key] })}
                                        className={`w-14 h-8 rounded-full transition-all relative ${workoutSettings[s.key] ? 'bg-primary' : 'bg-gray-700'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-black transition-all ${workoutSettings[s.key] ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowSettings(false)} className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-gray-200">
                            Sync Preferences
                        </button>
                    </div>
                </div>
            )}

            {showVideoDemo && (
                <AIVideoDemo exerciseName={currentEx.name} onClose={() => setShowVideoDemo(false)} />
            )}

            {/* Main Stage */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="max-w-4xl w-full text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6 animate-pulse">
                        {currentEx.category} &bull; {currentIndex + 1} OF {exercises.length}
                    </span>

                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter leading-tight drop-shadow-2xl">
                        {currentEx.name}
                    </h1>

                    {/* Interaction Zone */}
                    <div className="flex flex-col items-center justify-center gap-12">
                        {phase === "REST" ? (
                            <div className="flex flex-col items-center">
                                <div className="text-primary text-xl font-black uppercase tracking-[0.3em] mb-4">RECOVERY PHASE</div>
                                <div className="text-[12rem] md:text-[16rem] font-black text-white tabular-nums leading-none tracking-tighter">
                                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-12">
                                <div className="flex items-center gap-12">
                                    <div className="flex flex-col items-center">
                                        <div className="text-[12rem] md:text-[14rem] font-black text-white tabular-nums leading-none tracking-tighter">
                                            {reps}
                                        </div>
                                        <div className="text-gray-500 font-black uppercase tracking-[0.2em]">REPS</div>
                                    </div>
                                    <div className="h-40 w-1 bg-white/5 rounded-full" />
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-baseline">
                                            <input
                                                type="number"
                                                className="bg-transparent text-[12rem] md:text-[14rem] font-black text-primary tabular-nums leading-none tracking-tighter w-[2ch] outline-none border-none text-center"
                                                value={weights[currentEx.id] || 0}
                                                onChange={(e) => setWeights(prev => ({ ...prev, [currentEx.id]: parseFloat(e.target.value) || 0 }))}
                                            />
                                            <span className="text-4xl font-black text-primary/40 uppercase ml-2 italic">KG</span>
                                        </div>
                                        <div className="text-gray-500 font-black uppercase tracking-[0.2em]">WEIGHT</div>
                                    </div>
                                </div>

                                {workoutSettings.rpeEnabled && <RPEInput value={currentRpe} onChange={setCurrentRpe} />}

                                <div className="flex gap-4 mt-12">
                                    <div className="flex gap-2">
                                        <button onClick={() => setReps(r => Math.max(0, r - 1))} className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all text-2xl"> - </button>
                                        <button onClick={() => setReps(r => r + 1)} className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all text-2xl"> + </button>
                                    </div>
                                    <button onClick={handleNext} className="h-16 w-48 rounded-2xl bg-emerald-500 text-black font-black text-xl shadow-glow hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"> SET COMPLETE </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls Dock */}
            <div className="h-32 px-12 pb-12 flex items-center justify-center gap-8">
                <button onClick={handleBack} disabled={currentIndex === 0 && currentSet === 1 && phase === "WORK"} className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-20"><ChevronLeft size={28} /></button>
                <button onClick={() => setIsActive(!isActive)} className={`h-24 w-64 rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-glow hover:scale-105 ${isActive ? 'bg-white text-black' : 'bg-primary text-black'}`}>
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                    <span className="text-2xl font-black uppercase tracking-widest">{isActive ? "PAUSE" : "START"}</span>
                </button>
                <button onClick={handleSkip} className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400"><SkipForward size={24} /></button>
            </div>
        </div>
    );
}

export default function WorkoutSessionPage() {
    return (
        <Suspense fallback={<div className="fixed inset-0 bg-black flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <WorkoutSessionContent />
        </Suspense>
    );
}

