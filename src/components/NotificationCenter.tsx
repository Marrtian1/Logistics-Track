"use client";

import { Bell, Check, Info, AlertTriangle, ShieldAlert } from "lucide-react";
import { useShipStore } from "@/store/shipStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function NotificationCenter() {
  const { alerts, markAlertAsRead } = useShipStore();
  const unreadCount = alerts.filter((a) => !a.read).length;

  const getIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <ShieldAlert className="text-rose-500" size={16} />;
      case "medium":
        return <AlertTriangle className="text-amber-500" size={16} />;
      default:
        return <Info className="text-blue-500" size={16} />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell size={18} className="text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="p-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-[10px] font-bold">
              {unreadCount} New
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[400px] overflow-y-auto">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <DropdownMenuItem
                key={alert.id}
                className={cn(
                  "p-4 flex flex-col items-start gap-1 cursor-pointer transition-colors",
                  !alert.read ? "bg-secondary/30" : "opacity-70"
                )}
                onClick={() => markAlertAsRead(alert.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {getIcon(alert.severity)}
                    <span className="text-[10px] font-bold uppercase tracking-tight text-primary">
                      {alert.type}
                    </span>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-medium">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-snug">
                  {alert.message}
                </p>
                <div className="text-[9px] font-bold text-primary/60 mt-1">
                  VESSEL: {alert.shipName}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-8 text-center">
              <Check className="mx-auto mb-2 text-emerald-500" size={24} />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                All systems clear
              </p>
            </div>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem className="p-3 justify-center text-[10px] font-bold uppercase tracking-widest text-accent hover:bg-secondary/50">
          View All Alerts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}