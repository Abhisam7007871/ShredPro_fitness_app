"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function WorkoutSettingsPage() {
    // Local state for UI toggles to match Hevy functionality visually
    const [settings, setSettings] = useState({
        warmupCalculator: false,
        keepAwake: true,
        plateCalculator: true,
        rpeTracking: true,
        smartSuperset: true,
        inlineTimer: true,
        prNotification: true,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <main className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Fixed Header matching iOS Native style */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-xl z-50 pt-4">
                    <Link href="/dashboard/profile" className="flex items-center text-primary font-bold hover:text-white transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> Back
                    </Link>
                    <h1 className="text-xl font-bold">Workout Settings</h1>
                    <button className="text-primary font-bold hover:text-white transition-colors">Done</button>
                </div>

                <div className="space-y-6">
                    {/* Warm-Up Section */}
                    <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden divide-y divide-white/10">
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
                            <span className="font-semibold text-[15px]">Warm-up Calculator</span>
                            <div className="flex items-center gap-2 text-gray-500">
                                <span>{settings.warmupCalculator ? 'On' : 'Off'}</span>
                                <ChevronRight size={20} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
                            <span className="font-semibold text-[15px]">Warm-up Sets</span>
                            <ChevronRight size={20} className="text-gray-500" />
                        </div>
                    </div>

                    {/* Main Toggles Section */}
                    <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden divide-y divide-white/10">

                        <ToggleItem
                            label="Keep Awake During Workout"
                            description="Enable this if you don't want your phone to sleep while you're in a workout"
                            isOn={settings.keepAwake}
                            onToggle={() => toggleSetting('keepAwake')}
                        />

                        <ToggleItem
                            label="Plate Calculator"
                            description="A plate calculator calculates the plates needed on a bar to achieve a specific weight. When enabled, a Calculator button will appear when inputting weight for barbell exercises."
                            isOn={settings.plateCalculator}
                            onToggle={() => toggleSetting('plateCalculator')}
                        />

                        <ToggleItem
                            label="RPE Tracking"
                            description="RPE (Rate of Perceived Exertion) is a measure of the intensity of an exercise. Enabling RPE tracking will allow you to log it for each set in your workouts."
                            isOn={settings.rpeTracking}
                            onToggle={() => toggleSetting('rpeTracking')}
                        />

                        <ToggleItem
                            label="Smart Superset Scrolling"
                            description="When you complete a set, it'll automatically scroll to the next exercise in the superset."
                            isOn={settings.smartSuperset}
                            onToggle={() => toggleSetting('smartSuperset')}
                        />

                        <ToggleItem
                            label="Inline Timer"
                            description="Duration exercises have a built-in stopwatch for tracking time for each set"
                            isOn={settings.inlineTimer}
                            onToggle={() => toggleSetting('inlineTimer')}
                        />

                        <ToggleItem
                            label="Live Personal Record Notification"
                            description="When enabled, it'll notify you when you achieve a Personal Record upon checking the set."
                            isOn={settings.prNotification}
                            onToggle={() => toggleSetting('prNotification')}
                        />

                    </div>
                </div>
            </div>
        </main>
    );
}

function ToggleItem({ label, description, isOn, onToggle }: { label: string, description: string, isOn: boolean, onToggle: () => void }) {
    return (
        <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-[15px]">{label}</span>
                <button
                    onClick={onToggle}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isOn ? 'bg-primary' : 'bg-[#39393d]'}`}
                >
                    <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
                    />
                </button>
            </div>
            {description && (
                <p className="text-[13px] text-gray-400 leading-snug">{description}</p>
            )}
        </div>
    );
}
