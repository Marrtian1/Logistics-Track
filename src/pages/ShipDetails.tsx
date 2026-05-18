"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useShipStore } from "@/store/shipStore";
import Sidebar from "@/components/Sidebar";
import { 
  ArrowLeft, Ship as ShipIcon, Navigation, 
  Gauge, Clock, Package, Anchor, Activity 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from "recharts";
import { cn } from "@/lib/utils";

export default function ShipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ships = useShipStore((s) => s.ships);
  const ship = ships.find((s) => s.id === id);

  if (!ship) return null;

  const statusColors = {
    sailing: "bg-blue-50 text-blue-700 border-blue-200",
    docked: "bg-emerald-50 text-emerald-700 border-emerald-200",
    delayed: "bg-amber-50 text-amber-700 border-amber-200",
    anchored: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="h-8 w-8"
            >
              <ArrowLeft size={16} />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-primary uppercase tracking-tight">{ship.name}</h1>
                <Badge variant="outline" className="text-[10px] font-bold rounded px-2 py-0 bg-secondary/50">
                  {ship.type}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-widest">IMO: {ship.id}</p>
            </div>
          </div>
          <Button size="sm" className="h-9 font-bold uppercase tracking-wider text-[10px]" onClick={() => navigate(`/dashboard?tracking=${ship.id}`)}>
            <Navigation size={14} className="mr-2" /> Live Track
          </Button>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Current Speed", value: `${ship.speed} kn`, icon: Gauge, color: "text-accent" },
                    { label: "Status", value: ship.status.toUpperCase(), icon: Activity, color: "text-emerald-600" },
                    { label: "ETA", value: ship.eta.split(',')[0], icon: Clock, color: "text-amber-600" },
                    { label: "Destination", value: ship.destination.split(',')[0], icon: Anchor, color: "text-rose-600" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border shadow-sm p-4 rounded">
                      <stat.icon className={`${stat.color} mb-2`} size={16} />
                      <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</div>
                      <div className="text-base font-bold text-primary mt-0.5">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Speed Chart */}
                <div className="bg-white border shadow-sm rounded flex flex-col">
                  <div className="p-4 border-b bg-secondary/30">
                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                      <Activity size={14} className="text-accent" />
                      Speed Telemetry (24h)
                    </h3>
                  </div>
                  <div className="p-6 h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ship.history}>
                        <defs>
                          <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="speed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpeed)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Cargo Info */}
                <div className="bg-white border shadow-sm rounded flex flex-col">
                  <div className="p-4 border-b bg-secondary/30">
                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                      <Package size={14} className="text-emerald-600" />
                      Cargo Manifest
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">Current Load</div>
                      <div className="text-sm font-bold text-primary">{ship.cargo}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Weight</div>
                        <div className="text-sm font-mono font-bold text-primary">42,500 MT</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Capacity</div>
                        <div className="text-sm font-mono font-bold text-primary">85%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Timeline */}
                <div className="bg-white border shadow-sm rounded flex flex-col">
                  <div className="p-4 border-b bg-secondary/30">
                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                      <Navigation size={14} className="text-accent" />
                      Route Timeline
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="relative space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white shadow-sm" />
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Origin</div>
                        <div className="text-sm font-bold text-primary">{ship.origin}</div>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-accent rounded-full border-2 border-white shadow-sm animate-pulse" />
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Current Position</div>
                        <div className="text-sm font-bold text-primary">North Pacific Ocean</div>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-secondary border-2 border-white rounded-full shadow-sm" />
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Destination</div>
                        <div className="text-sm font-bold text-primary">{ship.destination}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}