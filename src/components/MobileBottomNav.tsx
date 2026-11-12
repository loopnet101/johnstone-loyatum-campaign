import { Link } from "@tanstack/react-router";
import { BellRing, House, UsersRound, Waypoints } from "lucide-react";

const tabs = [
  { to: "/" as const, label: "Home", icon: House, exact: true },
  { to: "/track" as const, label: "Track", icon: Waypoints },
  { to: "/updates" as const, label: "Updates", icon: BellRing },
  { to: "/join" as const, label: "Join", icon: UsersRound },
];

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_color-mix(in_oklab,var(--ink)_12%,transparent)] backdrop-blur md:hidden"
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch px-2">
        {tabs.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: exact ?? false }}
            activeProps={{ className: "text-bead" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={label}
          >
            <Icon aria-hidden="true" className="size-5" strokeWidth={2.2} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}