"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useShipStore } from "@/store/shipStore";
import { generateTrackingNumber } from "@/services/shipService";
import { Ship, Map, Package, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreateShipment() {
  const navigate = useNavigate();
  const { ships, routes, addShipment } = useShipStore();
  
  const [selectedShip, setSelectedShip] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [trackingNumber, setTrackingNumber] = useState(generateTrackingNumber());

  const handleCreate = () => {
    if (!selectedShip || !selectedRoute) {
      toast.error("Required fields missing");
      return;
    }

    const newShipment = {
      id: `sh-${Date.now()}`,
      trackingNumber,
      shipId: selectedShip,
      routeId: selectedRoute,
      status: "sailing" as const,
      progressIndex: 0,
      createdAt: new Date().toISOString()
    };

    addShipment(newShipment);
    toast.success(`Shipment ${trackingNumber} initialized`);
    navigate("/admin/shipments");
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center gap-4 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="h-8 w-8">
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-primary">Initialize Shipment</h1>
            <p className="text-xs text-muted-foreground font-medium">Assign a vessel to a shipping lane and generate tracking</p>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white border shadow-sm rounded p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">1. Vessel Assignment</label>
                <Select onValueChange={setSelectedShip}>
                  <SelectTrigger className="h-11 text-sm">
                    <SelectValue placeholder="Select an available vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    {ships.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-2">
                          <Ship size={14} className="text-accent" />
                          <span className="font-medium">{s.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">({s.type})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">2. Route Definition</label>
                <Select onValueChange={setSelectedRoute}>
                  <SelectTrigger className="h-11 text-sm">
                    <SelectValue placeholder="Select a shipping lane" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map(r => (
                      <SelectItem key={r.id} value={r.id}>
                        <div className="flex items-center gap-2">
                          <Map size={14} className="text-emerald-600" />
                          <span className="font-medium">{r.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">3. Tracking Reference</label>
                <div className="flex gap-2">
                  <Input 
                    value={trackingNumber} 
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="h-11 font-mono text-sm text-accent font-bold"
                  />
                  <Button 
                    variant="outline" 
                    className="h-11 px-4 text-[10px] font-bold uppercase tracking-wider"
                    onClick={() => setTrackingNumber(generateTrackingNumber())}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleCreate} className="w-full h-11 text-sm font-bold uppercase tracking-wider">
                  <Package size={16} className="mr-2" />
                  Deploy Shipment
                </Button>
              </div>
            </div>

            {selectedShip && selectedRoute && (
              <div className="bg-emerald-50 border border-emerald-100 rounded p-6 flex items-start gap-4">
                <div className="p-2 bg-emerald-600 text-white rounded">
                  <Check size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Configuration Validated</h4>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                    Vessel <span className="font-bold">{ships.find(s => s.id === selectedShip)?.name}</span> is ready for deployment on the <span className="font-bold">{routes.find(r => r.id === selectedRoute)?.name}</span> route.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}