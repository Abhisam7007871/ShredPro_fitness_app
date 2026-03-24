"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Droplets, Footprints, HeartPulse, Moon, Search } from "lucide-react";
import Card from "@/components/ui/Card";
import ProgressRing from "@/components/ui/ProgressRing";
import SegmentedTabs from "@/components/ui/SegmentedTabs";
import { getActivitySummary } from "@/lib/data/activity";

type Range = "today" | "weekly" | "monthly";

export default function ActivityPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id as string | undefined;

  const [range, setRange] = useState<Range>("today");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getActivitySummary(userId)
      .then((s) => mounted && setSummary(s))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [userId, range]);

  const caloriesRemaining = Math.max(
    0,
    (summary?.caloriesGoal ?? 0) - (summary?.caloriesConsumed ?? 0),
  );
  const caloriesProgress = useMemo(() => {
    const goal = summary?.caloriesGoal ?? 1;
    const consumed = summary?.caloriesConsumed ?? 0;
    return Math.min(1, consumed / goal);
  }, [summary]);

  const tabs = [
    { value: "today" as const, label: "Today" },
    { value: "weekly" as const, label: "Weekly" },
    { value: "monthly" as const, label: "Monthly" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
            My Activity
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Daily Tracker
          </h1>
        </div>
        <button className="h-10 w-10 rounded-xl bg-surface-accent border border-[rgb(var(--border))] flex items-center justify-center text-text-muted hover:text-text-main hover:bg-surface transition-all">
          <Search size={18} />
        </button>
      </div>

      <SegmentedTabs value={range} options={tabs} onChange={setRange} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-text-muted">
                Calories
              </p>
              <p className="text-sm text-text-muted font-semibold">
                Remaining today
              </p>
            </div>
            <span className="text-xs font-bold text-text-muted">
              {loading ? "…" : `${summary?.caloriesConsumed ?? 0} / ${summary?.caloriesGoal ?? 0}`}
            </span>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <ProgressRing
              progress={caloriesProgress}
              label={loading ? "…" : caloriesRemaining}
              sublabel="Remaining"
            />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                <Footprints size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Steps
                </p>
                <p className="text-lg font-extrabold text-text-main">
                  {loading ? "…" : (summary?.steps ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-muted font-bold">
              Goal {loading ? "…" : (summary?.stepsGoal ?? 0).toLocaleString()}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Droplets size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Water
                </p>
                <p className="text-lg font-extrabold text-text-main">
                  {loading ? "…" : `${summary?.waterLiters ?? 0}L`}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-muted font-bold">
              Goal {loading ? "…" : `${summary?.waterGoalLiters ?? 0}L`}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <HeartPulse size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Heart Rate
                </p>
                <p className="text-lg font-extrabold text-text-main">
                  {loading ? "…" : `${summary?.heartRateBpm ?? 0}`}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-muted font-bold">bpm</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-300">
                <Moon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Sleep
                </p>
                <p className="text-lg font-extrabold text-text-main">
                  {loading
                    ? "…"
                    : `${Math.floor((summary?.sleepMinutes ?? 0) / 60)}h ${(
                        summary?.sleepMinutes ?? 0
                      ) % 60}m`}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-muted font-bold">Last night</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

