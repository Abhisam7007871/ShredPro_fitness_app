import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export type BottomNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export default function BottomNav({ items }: { items: BottomNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-2xl border-t border-[rgb(var(--border))] z-50 px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex justify-between items-center shadow-[0_-10px_40px_rgba(15,23,42,0.10)]">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              isActive
                ? "text-primary transform -translate-y-1"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Icon
              className={`h-6 w-6 ${
                isActive ? "drop-shadow-[0_0_12px_rgba(0,217,255,0.6)]" : ""
              }`}
            />
            <span
              className={`text-[9px] font-black tracking-widest uppercase ${
                isActive ? "opacity-100" : "opacity-0 h-0"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

