"use client";

import Sidebar from "@/components/Sidebar";
import { useShipStore } from "@/store/shipStore";
import { AlertTriangle, Clock, Ship, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Alerts() {
  const alerts = useShipStore((s) => s.alerts);

  const severityStyles = {
    high: "bg-rose-50 text-rose-700 border-rose-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-primary">Alerts & Notifications</h1>
            <p className="text-xs text-muted-foreground font-medium">Real-time monitoring of fleet anomalies</p>
          </div>
          <Badge variant="outline" className="bg-secondary/50 text-primary font-bold">
            {alerts.length} Active Alerts
          </Badge>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="bg-white border rounded shadow-sm p-5 flex items-start gap-5 hover:border-accent/30 transition-colors group"
              >
                <div className={cn(
                  "p-2.5 rounded",
                  alert.severity === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                )}>
                  <ShieldAlert size={20} />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-primary uppercase tracking-tight">{alert.type}</span>
                      <Badge variant="outline" className={cn("text-[9px] font-bold rounded px-1.5 py-0", severityStyles[alert.severity])}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold">
                      <Clock size={12} />
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{alert.message}</p>
                  
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                      <Ship size={12} />
                      <span>VESSEL: <span className="text-primary">{alert.shipName}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                      <AlertTriangle size={12} />
                      <span>ID: <span className="text-primary font-mono">{alert.shipId}</span></span>
                    </div>
                  </div>
                </div>

                <button className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-secondary text-primary hover:bg-accent hover:text-white rounded text-[10px] font-bold uppercase tracking-wider">
                  Acknowledge
                </button>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="py-20 text-center space-y-3">
                <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-primary">All Systems Normal</h3>
                  <p className="text-sm text-muted-foreground">No active alerts detected across the fleet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}