"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useShipStore } from "@/store/shipStore";
import { Package, Search, Trash2, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function ManageShipments() {
  const { shipments, ships, routes, deleteShipment } = useShipStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredShipments = shipments.filter(s => 
    s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.shipId.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, tracking: string) => {
    if (window.confirm(`Are you sure you want to delete shipment ${tracking}?`)) {
      deleteShipment(id);
      toast.success(`Shipment ${tracking} deleted`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sailing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'delayed': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-primary">Shipment Registry</h1>
            <p className="text-xs text-muted-foreground font-medium">Monitor and control all active and historical shipments</p>
          </div>
          <Button onClick={() => navigate("/admin/create-shipment")} size="sm" className="h-9 font-bold uppercase tracking-wider text-[10px]">
            <Package size={14} className="mr-2" /> New Shipment
          </Button>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded border shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  placeholder="Search by tracking number or vessel ID..." 
                  className="pl-9 h-9 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Filter size={14} className="mr-2" /> Filter
              </Button>
            </div>

            <div className="bg-white border rounded shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 border-b">
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Tracking #</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Vessel</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Route</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Status</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Created</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredShipments.map((s) => {
                    const ship = ships.find(ship => ship.id === s.shipId);
                    const route = routes.find(r => r.id === s.routeId);
                    return (
                      <tr key={s.id} className="hover:bg-secondary/10 transition-colors group">
                        <td className="p-4">
                          <div className="font-mono text-xs text-accent font-bold">{s.trackingNumber}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-bold text-primary">{ship?.name || 'Unknown'}</div>
                          <div className="text-[10px] text-muted-foreground font-medium">{ship?.type}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs font-medium text-muted-foreground">{route?.name || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={cn("text-[9px] font-bold rounded px-2 py-0", getStatusColor(s.status))}>
                            {s.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-[10px] font-bold text-muted-foreground">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-accent hover:bg-accent/10"
                              onClick={() => navigate(`/dashboard?tracking=${s.trackingNumber}`)}
                            >
                              <ExternalLink size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-rose-600 hover:bg-rose-50"
                              onClick={() => handleDelete(s.id, s.trackingNumber)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredShipments.length === 0 && (
                <div className="p-12 text-center text-muted-foreground text-sm font-medium">
                  No shipment records found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}