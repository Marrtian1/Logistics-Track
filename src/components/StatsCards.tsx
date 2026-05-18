"use client";

import { useShipStore } from "@/store/shipStore";
import { Ship, AlertTriangle, Anchor, Navigation } from "lucide-react";

export default function StatsCards() {
  const ships = useShipStore((s) => s.ships);
  const alerts = useShipStore((s) => s.alerts);

  const stats = [
    {
      label: "Active Vessels",
      value: ships.filter(s => s.status === 'sailing').length,
      icon: Navigation,
      color: "text-accent",
    },
    {
      label: "Port Operations",
      value: ships.filter(s => s.status === 'docked').length,
      icon: Anchor,
      color: "text-emerald-600",
    },
    {
      label: "System Alerts",
      value: alerts.length,
      icon: AlertTriangle,
      color: "text-rose-600",
    }
  ];

  return (
    <div className="flex flex-col gap-3">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white border shadow-sm p-4 rounded flex items-center gap-4 min-w-[200px]">
          <div className="p-2 bg-secondary/50 rounded border border-dashed">
            <stat.icon className={stat.color} size={16} />
          </div>
          <div>
            <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</div>
            <div className="text-xl font-bold text-primary leading-none mt-0.5">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}