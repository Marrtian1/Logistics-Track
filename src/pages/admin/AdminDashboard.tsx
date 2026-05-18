"use client";

import Sidebar from "@/components/Sidebar";
import { useShipStore } from "@/store/shipStore";
import { Ship, Package, Map, Plus, Activity, AlertCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { ships, shipments, routes } = useShipStore();
  const navigate = useNavigate();

  const stats = [
    { label: "Total Vessels", value: ships.length, icon: Ship, color: "text-accent" },
    { label: "Active Shipments", value: shipments.filter(s => s.status === 'sailing').length, icon: Package, color: "text-emerald-600" },
    { label: "Defined Routes", value: routes.length, icon: Map, color: "text-primary" },
    { label: "Active Delays", value: shipments.filter(s => s.status === 'delayed').length, icon: AlertCircle, color: "text-rose-600" },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-primary">Command Center</h1>
            <p className="text-xs text-muted-foreground font-medium">Global fleet and shipment administration</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/admin/create-route")} variant="outline" size="sm" className="h-9 font-bold uppercase tracking-wider text-[10px]">
              <Navigation size={14} className="mr-2" /> Create Route
            </Button>
            <Button onClick={() => navigate("/admin/create-shipment")} size="sm" className="h-9 font-bold uppercase tracking-wider text-[10px]">
              <Plus size={14} className="mr-2" /> New Shipment
            </Button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white border shadow-sm p-6 rounded">
                  <stat.icon className={`${stat.color} mb-4`} size={20} />
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</div>
                  <div className="text-3xl font-bold mt-1 text-primary">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border shadow-sm rounded flex flex-col">
                <div className="p-4 border-b bg-secondary/30 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                    <Activity size={14} className="text-accent" />
                    Recent Shipments
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase" onClick={() => navigate("/admin/shipments")}>
                    View All
                  </Button>
                </div>
                <div className="p-4 space-y-3">
                  {shipments.slice(0, 5).map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded border border-dashed">
                      <div>
                        <div className="font-mono text-xs text-accent font-bold">{s.trackingNumber}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">Created: {new Date(s.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase text-primary">{s.status}</div>
                        <div className="text-[9px] text-muted-foreground font-mono">SHIP: {s.shipId}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border shadow-sm rounded flex flex-col">
                <div className="p-4 border-b bg-secondary/30 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                    <Ship size={14} className="text-emerald-600" />
                    Fleet Status
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase" onClick={() => navigate("/admin/ships")}>
                    Manage
                  </Button>
                </div>
                <div className="p-4 space-y-3">
                  {ships.slice(0, 5).map((ship) => (
                    <div key={ship.id} className="flex items-center gap-4 p-3 bg-secondary/20 rounded border border-dashed">
                      <div className="p-1.5 bg-white border rounded">
                        <Ship size={14} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-primary">{ship.name}</div>
                        <div className="text-[10px] text-muted-foreground font-medium">{ship.type}</div>
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{ship.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;