import Link from "next/link";
import { ChevronRight, Target, Zap, Shield, Activity, BarChart3, Brain, Crown, Globe, Users, CheckCircle2, Trophy } from "lucide-react";

export default function Home() {
    return (
        <main className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/30">
            {/* Ambient Animated Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse-slow delay-700"></div>
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full"></div>

            {/* Tactical Grid Overlay */}
            <div className="absolute inset-0 tactical-grid opacity-10 pointer-events-none"></div>

            {/* Navigation Placeholder (Floating) */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:py-6 flex justify-between items-center bg-surface/80 backdrop-blur-xl border-b border-[rgb(var(--border))]">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center font-extrabold text-primary italic border border-[rgb(var(--border))]">S</div>
                    <span className="text-3xl font-extrabold tracking-tight italic text-text-main">SHRED <span className="text-primary italic">PRO</span></span>
                </div>
                <div className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-[0.15em] text-text-main">
                    <a href="#philosophy" className="hover:text-primary transition-colors">Philosophy</a>
                    <a href="#intel" className="hover:text-primary transition-colors">Intelligence</a>
                    <a href="#membership" className="hover:text-primary transition-colors">Elite Access</a>
                </div>
                <Link href="/login" className="px-6 py-2 rounded-full border border-[rgb(var(--border))] bg-surface-accent hover:bg-surface text-xs font-bold uppercase tracking-wider transition-all text-text-main">
                    Access Intel
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="container mx-auto text-center space-y-8 animate-fade-in">
                    <div className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-full bg-surface/70 border border-[rgb(var(--border))] backdrop-blur-md">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">System Online: v2.4.0 Lab Beta</p>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold leading-[0.9] tracking-tight">
                        ENGINEERING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--foreground))] to-[rgb(var(--foreground))]/60 italic pr-2">THE ELITE</span> <br />
                        <span className="text-primary italic pr-2">HUMAN</span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-muted font-medium leading-relaxed italic">
                        The ultimate high-performance lab for athletes who demand precision.
                        AI-driven biometric protocols, real-time physiological tracking, and a
                        global leaderboard of dominance.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                        <Link href="/onboarding" className="group relative px-10 py-5 bg-primary text-white font-extrabold uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(77,170,86,0.25)]">
                            Commence Training
                            <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/dashboard" className="px-10 py-5 bg-primary text-white font-extrabold uppercase tracking-widest rounded-2xl hover:brightness-95 transition-all shadow-[0_0_26px_rgba(77,170,86,0.18)]">
                            View Case Studies
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us - The Comparison */}
            <section id="philosophy" className="py-32 px-6 relative z-10 border-t border-[rgb(var(--border))]">
                <div className="container mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-4">Core Philosophy</h2>
                        <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight">WHY SHRED PRO?</h3>
                        <p className="text-text-muted mt-4 max-w-xl mx-auto italic font-medium text-lg">Standard apps are passive tracking. Shred Pro is active engineering.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Traditional Apps */}
                        <div className="glass-tactical p-12 border-red-500/10">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-3 bg-red-500/10 rounded-xl">
                                    <Globe className="w-6 h-6 text-red-400" />
                                </div>
                                <h4 className="text-xl font-extrabold uppercase tracking-widest text-red-400">Traditional Apps</h4>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "Generic static workout templates",
                                    "Passive step and calorie counting",
                                    "Social media focused 'influencer' plans",
                                    "Inconsistent tracking metrics",
                                    "No physiological intelligence"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start space-x-4 opacity-40">
                                        <div className="mt-1 w-4 h-4 rounded-full border border-red-500/50 flex-shrink-0" />
                                        <span className="text-sm font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Shred Pro Intelligence */}
                        <div className="glass-tactical p-12 active-glow border-primary/20 bg-primary/5">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-3 bg-primary/20 rounded-xl">
                                    <Brain className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="text-xl font-extrabold uppercase tracking-widest text-primary">Shred Pro Intel</h4>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "GPT-5.2 Real-time biometric protocols",
                                    "365-Day Performance Persistence Heatmap",
                                    "Elite Muscle Architecture Analytics",
                                    "Global Dominance Leaderboards & XP",
                                    "Cinematic Ultra-HD Form Demonstrations"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start space-x-4">
                                        <div className="mt-1 p-0.5 bg-primary/20 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-base font-bold italic tracking-wide">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intelligence Feature Breakdown */}
            <section id="intel" className="py-32 bg-surface/40 border-t border-[rgb(var(--border))]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-8">
                            <h3 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                                BIO-ENGINEERED <br />
                                <span className="text-primary italic">PRECISION.</span>
                            </h3>
                            <p className="text-text-muted text-xl italic leading-relaxed">
                                Our platform doesn't just track sets and reps. It analyzes your unique
                                metabolic window, muscle fatigue recovery, and nutritional architecture
                                to generate the exact protocol your DNA demands.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                                <div className="space-y-3">
                                    <BarChart3 className="text-secondary w-10 h-10" />
                                    <h5 className="font-bold text-base uppercase tracking-widest text-text-main">Heatmap Persistence</h5>
                                    <p className="text-sm text-text-muted leading-relaxed font-semibold italic">Visualize every moment of effort over a 12-month tactical grid.</p>
                                </div>
                                <div className="space-y-3">
                                    <Users className="text-primary w-10 h-10" />
                                    <h5 className="font-bold text-base uppercase tracking-widest text-text-main">Global Dominance</h5>
                                    <p className="text-sm text-text-muted leading-relaxed font-semibold italic">Compete in high-stakes rankings against the top 0.1% of athletes.</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive UI Preview Placeholder */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/20 blur-[60px] rounded-full opacity-50"></div>
                            <div className="relative glass-tactical p-8 rounded-[3rem] overflow-hidden shadow-2xl">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-secondary/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-blue-500/50"></div>
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-surface-accent border border-[rgb(var(--border))] text-xs font-bold text-text-main uppercase tracking-widest">Live Bio-Feed</div>
                                </div>

                                <div className="space-y-6">
                                    <div className="h-4 w-full bg-surface-accent rounded-full overflow-hidden border border-[rgb(var(--border))]">
                                        <div className="h-full w-2/3 bg-gradient-to-r from-primary to-secondary animate-shimmer"></div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        {[...Array(24)].map((_, i) => (
                                            <div key={i} className={`h-8 rounded-md border border-[rgb(var(--border))] ${i % 3 === 0 ? 'bg-primary/25' : i % 5 === 0 ? 'bg-secondary/20' : 'bg-surface-accent'}`}></div>
                                        ))}
                                    </div>
                                    <div className="h-32 w-full bg-surface-accent rounded-2xl flex items-center justify-center border border-[rgb(var(--border))] italic text-xs text-text-muted font-bold tracking-tight">SYSTEM_VISUALIZATION_OFFLINE_LAB_SIM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Membership Access */}
            <section id="membership" className="py-32 px-6">
                <div className="container mx-auto text-center">
                    <h2 className="text-6xl md:text-8xl font-extrabold mb-16 tracking-tight">SELECT YOUR <span className="text-primary italic">TIER.</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* BASIC */}
                        <div className="glass-tactical p-10 flex flex-col group hover:scale-[1.02] transition-transform">
                            <div className="mb-8">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Level 01</span>
                                <h4 className="text-4xl font-extrabold mt-2">BASIC</h4>
                            </div>
                            <div className="text-5xl font-extrabold mb-10 text-text-main italic">$4<span className="text-sm font-medium text-text-muted uppercase tracking-widest">/mo</span></div>
                            <ul className="space-y-4 text-left flex-1 mb-12">
                                {["A-Z Exercise Library", "Basic Session Tracking", "Standard Heatmap", "Basic Body Metrics"].map((f, i) => (
                                    <li key={i} className="flex items-center space-x-3 text-sm text-text-muted font-bold italic">
                                        <CheckCircle2 className="w-4 h-4 text-text-muted" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register?tier=basic" className="w-full py-4 rounded-xl border border-[rgb(var(--border))] bg-surface-accent text-text-main text-xs font-bold uppercase tracking-widest hover:bg-surface transition-colors">Select Protocol</Link>
                        </div>

                        {/* PRO */}
                        <div className="glass-tactical p-10 flex flex-col border-primary/30 relative overflow-hidden group hover:scale-[1.05] transition-transform shadow-[0_0_50px_rgba(255,59,48,0.15)]">
                            <div className="absolute top-0 right-0 py-1 px-4 bg-primary text-black font-bold text-xs uppercase tracking-widest italic translate-y-4 -rotate-2 scale-110">Recommended</div>
                            <div className="mb-8">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Level 02</span>
                                <h4 className="text-4xl font-extrabold mt-2 text-primary">PRO</h4>
                            </div>
                            <div className="text-5xl font-extrabold mb-10 text-text-main italic">$9<span className="text-sm font-medium text-text-muted uppercase tracking-widest">/mo</span></div>
                            <ul className="space-y-4 text-left flex-1 mb-12">
                                {["Everything in Basic", "GPT-5.2 AI Pro Plans", "Advanced Analytics", "Streak Multipliers x1.5", "Meal Architecture"].map((f, i) => (
                                    <li key={i} className="flex items-center space-x-3 text-sm text-text-main font-bold italic">
                                        <Zap className="w-4 h-4 text-primary" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register?tier=pro" className="w-full py-4 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-widest hover:brightness-95 transition-all">Engage Intelligence</Link>
                        </div>

                        {/* ELITE */}
                        <div className="glass-tactical p-10 flex flex-col group hover:scale-[1.02] transition-transform">
                            <div className="mb-8">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Level 03</span>
                                <h4 className="text-4xl font-extrabold mt-2 text-secondary">ELITE</h4>
                            </div>
                            <div className="text-5xl font-extrabold mb-10 text-text-main italic">$15<span className="text-sm font-medium text-text-muted uppercase tracking-widest">/mo</span></div>
                            <ul className="space-y-4 text-left flex-1 mb-12">
                                {["Everything in Pro", "Real-time DNA Insights", "Elite Ranking Access", "AI Nutrition Coach", "Full Lab Integration"].map((f, i) => (
                                    <li key={i} className="flex items-center space-x-3 text-sm text-text-muted font-bold italic">
                                        <Crown className="w-4 h-4 text-secondary" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register?tier=elite" className="w-full py-4 rounded-xl border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest hover:bg-secondary/10 transition-colors">Claim Sovereignty</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-48 px-6 text-center relative border-t border-[rgb(var(--border))]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 space-y-12">
                    <div className="inline-block p-6 bg-primary/10 rounded-[2rem] mb-6">
                        <Trophy className="w-16 h-16 text-primary" />
                    </div>
                    <h3 className="text-5xl md:text-8xl font-extrabold tracking-tight italic">YOUR LEGACY <br /> STARTS <span className="text-primary italic">NOW.</span></h3>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto italic font-medium">Join 50,000+ athletes engineering their peak potential.</p>
                    <Link href="/register" className="inline-block px-12 py-6 bg-primary text-white font-extrabold uppercase tracking-[0.15em] text-sm rounded-2xl hover:brightness-95 transition-all hover:scale-105 active:scale-95 shadow-[0_0_60px_rgba(77,170,86,0.18)]">
                        Commence Extraction
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-[rgb(var(--border))] bg-surface/60">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-black italic">S</div>
                            <span className="text-2xl font-black tracking-tighter italic text-text-main">SHRED <span className="text-primary">PRO</span></span>
                        </div>
                        <p className="text-sm text-text-muted font-semibold uppercase tracking-widest leading-relaxed italic">The definitive lab for high-performance human documentation. v.2.4.0 (Performance Lab)</p>
                    </div>
                    <div>
                        <h6 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main mb-8 italic">Intelligence</h6>
                        <ul className="space-y-4 text-xs font-bold text-text-muted uppercase tracking-widest italic">
                            <li className="hover:text-primary transition-colors cursor-pointer">AI Protocols</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Bio-Telemetry</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Global Standings</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main mb-8 italic">Academy</h6>
                        <ul className="space-y-4 text-xs font-bold text-text-muted uppercase tracking-widest italic">
                            <li className="hover:text-primary transition-colors cursor-pointer">Tactical Guides</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Form Lab</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Recovery Intel</li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="text-xs font-bold uppercase tracking-[0.2em] text-text-main mb-8 italic">Protocol</h6>
                        <ul className="space-y-4 text-xs font-bold text-text-muted uppercase tracking-widest italic">
                            <li className="hover:text-primary transition-colors cursor-pointer">Legal Intercept</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Privacy Seal</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">System Status</li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto mt-20 pt-8 border-t border-[rgb(var(--border))] text-[10px] font-bold text-text-muted uppercase tracking-[0.4em] text-center">
                    COPYRIGHT PROPRIETARY SYSTEM © 2026 SHRED PRO INTEL ALL RIGHTS RESERVED
                </div>
            </footer>
        </main>
    );
}
