"use client";

import { useState } from "react";
import { Bell, Dumbbell, Utensils, Brain, ChevronLeft } from "lucide-react";
import Link from "next/link";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";

export default function NotificationsSettingsPage() {
    const { data: session } = useSession();
    const user = session?.user as any;

    const [settings, setSettings] = useState({
        workout: user?.notificationWorkout ?? true,
        diet: user?.notificationDiet ?? false,
        ai: user?.notificationAi ?? true,
        marketing: user?.notificationMarketing ?? false
    });

    useEffect(() => {
        if (user) {
            setSettings({
                workout: user.notificationWorkout ?? true,
                diet: user.notificationDiet ?? false,
                ai: user.notificationAi ?? true,
                marketing: user.notificationMarketing ?? false
            });
        }
    }, [user]);

    const toggle = async (key: keyof typeof settings) => {
        const newValue = !settings[key];
        const updatedSettings = { ...settings, [key]: newValue };
        setSettings(updatedSettings);

        try {
            await api.put(`/users/${user.email}/notifications`, {
                notificationWorkout: updatedSettings.workout,
                notificationDiet: updatedSettings.diet,
                notificationAi: updatedSettings.ai,
                notificationMarketing: updatedSettings.marketing
            });
        } catch (err) {
            console.error("Failed to update notifications", err);
        }
    };

    const notificationTypes = [
        { id: 'workout', label: 'Workout Reminders', description: 'Get notified when it\'s time to train and track your progress.', icon: Dumbbell, color: 'text-blue-400' },
        { id: 'diet', label: 'Diet & Nutrition', description: 'Meal reminders and daily water intake alerts.', icon: Utensils, color: 'text-green-400' },
        { id: 'ai', label: 'AI Insights', description: 'Personalized recommendations and form correction feedback.', icon: Brain, color: 'text-purple-400' },
        { id: 'marketing', label: 'Promotions', description: 'Updates about new features and premium offers.', icon: Bell, color: 'text-yellow-400' }
    ] as const;

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/profile" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-3xl font-black text-white tracking-tight">Notifications</h1>
            </div>

            <div className="glass rounded-[2rem] p-8 border border-white/10 relative">
                <div className="space-y-6">
                    {notificationTypes.map((type) => (
                        <div key={type.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${type.color}`}>
                                    <type.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">{type.label}</h3>
                                    <p className="text-sm text-gray-500">{type.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggle(type.id)}
                                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative shrink-0 ${settings[type.id] ? 'bg-primary' : 'bg-gray-600'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${settings[type.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
