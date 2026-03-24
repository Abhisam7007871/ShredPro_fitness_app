"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { ChevronRight, ChevronLeft, Target, Activity, Dumbbell, Utensils } from "lucide-react";

const STEPS = [
    { id: "stats", title: "Physical Intel", icon: Activity },
    { id: "goals", title: "Objective", icon: Target },
    { id: "nutrition", title: "Diet Plan", icon: Utensils },
    { id: "experience", title: "Combat Level", icon: Dumbbell },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        height: "",
        weight: "",
        goal: "WEIGHT_LOSS",
        experienceLevel: "BEGINNER",
        activityLevel: "SEDENTARY",
        dietType: "OMNIVORE",
    });

    const nextStep = () => {
        if (step < STEPS.length - 1) setStep(step + 1);
        else handleComplete();
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const { data: session } = useSession();
    const userEmail = session?.user?.email;

    const handleComplete = async () => {
        if (!userEmail) {
            router.push("/login");
            return;
        }

        try {
            // Sync onboarding data with user profile
            await api.put(`/users/${userEmail}/profile`, {
                fullName: formData.fullName,
                age: parseInt(formData.age),
                height: parseFloat(formData.height),
                currentWeight: parseFloat(formData.weight)
                // Activity and goals can be added to DTO if needed
            });

            // Trigger AI plan generation (Backend handles membership level check/gating)
            // Note: In NextAuth, session?.user?.id is often the user's UUID
            const user = session?.user as any;
            if (user?.id) {
                try {
                    await api.post(`/workouts/generate?userId=${user.id}&goal=${formData.goal}&days=4`);
                } catch (aiErr) {
                    console.log("AI Generation skipped/failed:", aiErr);
                    // We don't block the user if AI generation fails (e.g., Basic user)
                }
            }

            router.push("/dashboard");
        } catch (err) {
            console.error("Failed to sync onboarding data", err);
            router.push("/dashboard"); // Fallback
        }
    };

    const StepIcon = STEPS[step].icon;

    return (
        <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-0 tactical-grid opacity-10"></div>

            <div className="relative z-10 max-w-xl w-full">
                {/* Progress Bar */}
                <div className="flex justify-between mb-12">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center flex-1">
                            <div className={`h-1 w-full rounded-full transition-all duration-500 ${i <= step ? 'bg-primary shadow-[0_0_10px_rgba(255,59,48,0.5)]' : 'bg-surface-accent'}`}></div>
                            <span className={`text-[11px] uppercase font-heading font-bold mt-2 tracking-widest ${i <= step ? 'text-primary' : 'text-text-muted'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="glass-tactical p-8 md:p-12 relative">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <StepIcon className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-extrabold italic">{STEPS[step].title}</h2>
                    </div>

                    <div className="space-y-6 min-h-[300px]">
                        {step === 0 && (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-xs uppercase font-heading font-bold text-text-muted mb-2 tracking-widest">Operator Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/40 border border-white/10 p-4 focus:border-primary/50 outline-none transition-all placeholder:text-white/10"
                                        placeholder="ENTER FULL NAME"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-heading font-bold text-text-muted mb-2 tracking-widest">Age</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black/40 border border-white/10 p-4 focus:border-primary/50 outline-none transition-all"
                                        placeholder="YEARS"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-heading font-bold text-text-muted mb-2 tracking-widest">Weight (KG)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black/40 border border-white/10 p-4 focus:border-primary/50 outline-none transition-all"
                                        placeholder="KG"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4">
                                {["WEIGHT_LOSS", "MUSCLE_GAIN", "ENDURANCE", "MAINTAIN"].map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => setFormData({ ...formData, goal })}
                                        className={`w-full p-4 border text-left flex items-center justify-between transition-all group ${formData.goal === goal ? 'bg-primary/10 border-primary text-primary' : 'bg-black/20 border-white/10 hover:border-white/30'}`}
                                    >
                                        <span className="font-heading font-bold uppercase tracking-wider">{goal.replace('_', ' ')}</span>
                                        <div className={`w-4 h-4 rounded-full border-2 ${formData.goal === goal ? 'border-primary bg-primary' : 'border-white/20'}`}></div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                {["OMNIVORE", "VEGAN", "KETO", "PALEO"].map((diet) => (
                                    <button
                                        key={diet}
                                        onClick={() => setFormData({ ...formData, dietType: diet })}
                                        className={`w-full p-4 border text-left flex items-center justify-between transition-all group ${formData.dietType === diet ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-black/20 border-white/10 hover:border-white/30'}`}
                                    >
                                        <span className="font-heading font-bold uppercase tracking-wider">{diet}</span>
                                        <div className={`w-4 h-4 rounded-full border-2 ${formData.dietType === diet ? 'border-secondary bg-secondary' : 'border-white/20'}`}></div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                {["BEGINNER", "INTERMEDIATE", "ADVANCED", "ELITE"].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setFormData({ ...formData, experienceLevel: level })}
                                        className={`w-full p-4 border text-left flex items-center justify-between transition-all group ${formData.experienceLevel === level ? 'bg-primary/10 border-primary text-primary' : 'bg-black/20 border-white/10 hover:border-white/30'}`}
                                    >
                                        <span className="font-heading font-bold uppercase tracking-wider">{level}</span>
                                        <div className={`w-4 h-4 rounded-full border-2 ${formData.experienceLevel === level ? 'border-primary bg-primary' : 'border-white/20'}`}></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4 mt-12 pt-8 border-t border-white/10">
                        {step > 0 && (
                            <button onClick={prevStep} className="p-4 border border-white/10 hover:bg-white/5 transition-all">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        <button onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center">
                            {step === STEPS.length - 1 ? "INITIALIZE DATA" : "NEXT PHASE"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-secondary/10 blur-[100px] pointer-events-none"></div>
        </main>
    );
}
