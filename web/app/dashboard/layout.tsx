"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Dumbbell, LayoutDashboard, User, LogOut, Utensils, Bell, Settings, Users, Zap, Activity, Sun, Moon } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import { useTheme } from "@/components/ThemeProvider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user as any;
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="min-h-screen bg-background flex items-center justify-center text-primary animate-pulse">Synchronizing Session...</div>;
    }

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/activity", label: "Activity", icon: Activity },
        { href: "/dashboard/workouts", label: "Workouts", icon: Dumbbell },
        { href: "/dashboard/nutrition", label: "Diet Plan", icon: Utensils },
        { href: "/dashboard/social", label: "Tactical Social", icon: Users },
        { href: "/dashboard/upgrade", label: "Upgrade Hub", icon: Zap },
        { href: "/dashboard/profile", label: "Profile", icon: User },
    ];

    return (
        <div className="flex min-h-screen bg-background text-text-main selection:bg-primary/30">
            {/* Sidebar */}
            <aside className="w-72 bg-surface/70 backdrop-blur-2xl border-r border-[rgb(var(--border))] hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <Link href="/dashboard" className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow shrink-0 border border-[rgb(var(--border))]">
                            <Dumbbell className="text-white h-7 w-7" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-text-main uppercase italic leading-none">
                            Shred <span className="text-primary">Pro</span>
                        </h1>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 mt-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 group ${isActive
                                    ? "bg-gradient-to-r from-primary/20 to-transparent text-primary border-l-4 border-primary shadow-[0_0_20px_rgba(0,217,255,0.1)]"
                                    : "text-text-muted hover:bg-surface-accent hover:text-text-main"
                                    }`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "group-hover:text-primary transition-colors"}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-[rgb(var(--border))] bg-surface/40">
                    <Link href="/dashboard/profile" className="flex items-center gap-3 mb-6 px-2 group cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-[rgb(var(--border))] flex items-center justify-center text-primary font-bold overflow-hidden">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                (user?.fullName?.[0] || user?.name?.[0] || "U")
                            )}
                        </div>
                        <div className="flex-1 min-w-0 group-hover:text-primary transition-colors">
                            <p className="text-sm font-bold truncate">{user?.fullName || user?.name || "Premium Athlete"}</p>
                            <p className="text-xs text-text-muted truncate">{user?.membershipLevel || user?.membership || "Elite"} Member</p>
                        </div>
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-muted hover:text-red-500 transition-colors rounded-xl hover:bg-red-500/10">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <header className="h-20 border-b border-[rgb(var(--border))] flex items-center justify-between px-6 md:px-10 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
                    <div>
                        <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest leading-none mb-1 hidden sm:block">Overview</h2>
                        <h3 className="text-xl font-bold tracking-tight text-text-main">
                            {navItems.find(i => i.href === pathname)?.label || "Dashboard"}
                        </h3>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="h-10 w-10 rounded-xl bg-surface-accent border border-[rgb(var(--border))] flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface transition-all"
                            aria-label="Toggle theme"
                            title="Toggle theme"
                        >
                            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <Link href="/dashboard/settings/notifications" className="h-10 w-10 rounded-xl bg-surface-accent border border-[rgb(var(--border))] flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary shadow-glow"></span>
                        </Link>
                        <Link href="/dashboard/settings/security" className="h-10 w-10 rounded-xl bg-surface-accent border border-[rgb(var(--border))] flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface transition-all">
                            <Settings size={20} />
                        </Link>
                        <div className="h-1 bg-surface-accent w-12 rounded-full mx-2 hidden sm:block"></div>
                        <Link href="/dashboard/profile" className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold shadow-glow overflow-hidden border border-[rgb(var(--border))] hover:scale-105 transition-transform">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                (user?.fullName?.[0] || user?.name?.[0] || "U")
                            )}
                        </Link>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-10 overflow-y-auto custom-scrollbar pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-10">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>

            <div className="md:hidden">
                <BottomNav items={navItems.slice(0, 5).map(i => ({ ...i, label: i.label.split(' ')[0] }))} />
            </div>
        </div>
    );
}
