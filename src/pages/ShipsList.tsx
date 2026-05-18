"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShipStore } from "@/store/shipStore";
import Sidebar from "@/components/Sidebar";
import { Search, Filter, Ship as ShipIcon, ChevronRight, MapPin, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ShipsList() {
  const navigate = useNavigate();
  const ships = useShipStore((s) => s.ships);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filteredShips = ships.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || s.status === filter;
    return matchesSearch && matchesFilter;
  });

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
          <div>
            <h1 className="text-lg font-bold text-primary">Fleet Inventory</h1>
            <p className="text-xs text-muted-foreground font-medium">Manage and monitor all registered vessels</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Search vessel ID or name..." 
                className="pl-9 h-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter size={14} className="mr-2" /> Filter
            </Button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Status Tabs */}
            <div className="flex gap-1 p-1 bg-secondary/50 rounded border w-fit">
              {['all', 'sailing', 'docked', 'delayed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "px-4 py-1.5 rounded text-xs font-bold transition-all uppercase tracking-wider",
                    filter === s ? "bg-white text-primary shadow-sm border" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Vessel Table */}
            <div className="bg-white border rounded shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 border-b">
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Vessel Name</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Type</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Status</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Speed</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Destination</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredShips.map((ship) => (
                    <tr 
                      key={ship.id}
                      className="hover:bg-secondary/10 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/ships/${ship.id}`)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary rounded">
                            <ShipIcon size={16} className="text-primary" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-primary">{ship.name}</div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase">{ship.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground font-medium">{ship.type}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={cn("text-[10px] font-bold rounded px-2 py-0.5", statusColors[ship.status])}>
                          {ship.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm font-mono font-medium text-primary">{ship.speed} kn</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={14} />
                          <span>{ship.destination.split(',')[0]}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredShips.length === 0 && (
                <div className="p-12 text-center text-muted-foreground text-sm font-medium">
                  No vessels found matching the current criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}