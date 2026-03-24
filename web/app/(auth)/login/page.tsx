"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Dumbbell, Mail, Lock, ChevronRight, Zap } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(searchParams.get("error") ? "Authentication suspended." : "");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError(res.error);
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError("Authentication failed. Ensure secure credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = (provider: string) => {
        signIn(provider, { callbackUrl: "/dashboard" });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black selection:bg-primary/30">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#1a1a2e] opacity-90" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
            </div>

            <div className="relative z-10 w-full max-w-xl px-6">
                <div className="glass rounded-[3rem] p-12 border border-white/10 shadow-2xl backdrop-blur-3xl bg-white/[0.02]">
                    <div className="text-center mb-12">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-glow mb-8 animate-bounce-subtle">
                            <Dumbbell className="text-white h-8 w-8" />
                        </div>
                        <h1 className="text-6xl font-extrabold text-white tracking-tighter mb-4 italic uppercase">
                            Shred <span className="text-primary">Pro</span>
                        </h1>
                        <p className="text-gray-400 font-medium text-lg">
                            Elevate your performance to elite levels.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                    placeholder="Activation Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                    placeholder="Secure Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold animate-shake">
                                <Zap size={16} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:scale-[1.02] active:scale-[0.98] text-black font-extrabold py-4 rounded-2xl transition-all shadow-glow flex items-center justify-center gap-3 group text-lg mt-8"
                        >
                            {loading ? "Syncing..." : "Access Dashboard"}
                            {!loading && <ChevronRight className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-10 mb-8 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <p className="text-gray-400 text-lg font-medium">Elite performance tracking by <span className="text-primary font-extrabold italic">Shred Pro</span>.</p>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    <div className="mt-10 mb-8 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Or integrate via</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                        <button onClick={() => handleOAuth('google')} className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center group">
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        </button>
                        <button onClick={() => handleOAuth('apple')} className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center group">
                            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.29-.88 3.57-.84 1.51.15 2.65.65 3.4 1.76-2.92 1.94-2.42 5.92.54 7.23-.74 1.54-1.58 3-2.59 4.04zm-3.87-14.7c.36-1.54-.42-3.16-1.9-4.08-.44 1.76.62 3.16 1.9 4.08z" /></svg>
                        </button>
                        <button onClick={() => handleOAuth('facebook')} className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center group">
                            <svg className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </button>
                        <button onClick={() => handleOAuth('twitter')} className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center group">
                            <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </button>
                        <button onClick={() => handleOAuth('instagram')} className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                            <svg className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.956a1.44 1.44 0 10-2.88 0 1.44 1.44 0 002.88 0z" /></svg>
                        </button>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-500 font-bold text-sm">
                            Don't have an elite account?{" "}
                            <Link href="/register" className="text-primary hover:text-white transition-colors underline decoration-2 underline-offset-4">
                                Join the Collective
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Badges */}
                <div className="mt-12 flex justify-center gap-8 opacity-40">
                    <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">AI Architecture</div>
                    <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">Secure Encryption</div>
                    <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">Elite Protocol</div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-primary">Loading Core Protocols...</div>}>
            <LoginForm />
        </Suspense>
    );
}
