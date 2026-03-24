"use client";

import { useState } from "react";
import { Shield, Key, Smartphone, ChevronLeft, Check } from "lucide-react";
import Link from "next/link";

import { useSession } from "next-auth/react";
import api from "@/lib/api";

export default function SecuritySettingsPage() {
    const { data: session } = useSession();
    const user = session?.user as any;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handlePasswordUpdate = async () => {
        if (!newPassword || newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }
        setLoading(true);
        try {
            await api.put(`/users/${user.email}/security`, {
                newPassword: newPassword
            });
            setMessage({ type: "success", text: "Password updated successfully." });
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setMessage({ type: "error", text: "Failed to update password." });
        } finally {
            setLoading(false);
        }
    };

    const handle2FAToggle = async () => {
        const newState = !twoFactor;
        try {
            await api.put(`/users/${user.email}/security`, {
                twoFactorEnabled: newState
            });
            setTwoFactor(newState);
        } catch (err) {
            console.error("Failed to toggle 2FA", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/profile" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-3xl font-black text-white tracking-tight">Account Security</h1>
            </div>

            <div className="glass rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent opacity-50" />

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Key className="text-primary" size={24} /> Password Management
                </h2>

                <div className="space-y-4 max-w-xl relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handlePasswordUpdate}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-primary text-black font-bold mt-4 hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
                    >
                        <Check size={18} /> {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </div>

            <div className="glass rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <Smartphone className="text-primary" size={24} /> Two-Factor Authentication (2FA)
                        </h2>
                        <p className="text-gray-400 text-sm max-w-md">Add an extra layer of security to your account by requiring a verification code when you sign in.</p>
                    </div>
                    <button
                        onClick={handle2FAToggle}
                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${twoFactor ? 'bg-primary' : 'bg-gray-600'}`}
                    >
                        <div className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {twoFactor && (
                    <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                        <Shield className="text-emerald-500" size={24} />
                        <div>
                            <p className="text-sm font-bold text-emerald-500">2FA is currently enabled</p>
                            <p className="text-xs text-emerald-500/70">Authenticator app protection active</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
