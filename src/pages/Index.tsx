"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useShipStore } from "@/store/shipStore";
import { fetchInitialData } from "@/services/shipService";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

const Index = () => {
  const [trackingId, setTrackingId] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();
  const { shipments, setShips, setRoutes, setShipments, setPorts, setAlerts } = useShipStore();

  // Ensure data is seeded if the store is empty or outdated
  const seedData = () => {
    setIsSyncing(true);
    const data = fetchInitialData();
    setShips(data.ships);
    setRoutes(data.routes);
    setShipments(data.shipments);
    setPorts(data.ports);
    setAlerts(data.alerts);
    setTimeout(() => setIsSyncing(false), 500);
  };

  useEffect(() => {
    // If we have no shipments or very few (indicating old data), re-seed
    if (shipments.length < 5) {
      seedData();
    }
  }, []);

  const isUPUFormat = useMemo(() => {
    const regex = /^[A-Z]{2}\d{9}[A-Z]{2}$/;
    return regex.test(trackingId.trim().toUpperCase());
  }, [trackingId]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = trackingId.trim().toUpperCase();
    if (!cleanId) return;
    
    // Search in the current shipments array
    const shipment = shipments.find(s => s.trackingNumber === cleanId);
    
    if (shipment) {
      toast.success(`Shipment ${cleanId} located`);
      navigate(`/dashboard?tracking=${cleanId}`);
    } else {
      toast.error("Tracking number not found in registry. Please check the reference and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header showAdminLink />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Global Vessel Tracking & Logistics
            </h1>
            <p className="text-muted-foreground text-lg">
              Real-time monitoring for enterprise fleet operations. Enter your tracking reference to begin.
            </p>
          </div>

          <div className="bg-white border rounded-lg shadow-sm p-8 space-y-6 relative overflow-hidden">
            {isUPUFormat && (
              <div className="absolute top-0 left-0 w-full h-1 bg-accent animate-in fade-in slide-in-from-top-1 duration-500" />
            )}
            
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tracking Reference</label>
                  <div className="flex gap-2">
                    {isUPUFormat && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-bold uppercase tracking-widest flex gap-1 items-center">
                        <CheckCircle2 size={10} /> UPU Standard Recognized
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="text" 
                    placeholder="Enter tracking number..." 
                    className="pl-10 h-12 text-lg uppercase font-mono transition-all focus:ring-accent" 
                    value={trackingId} 
                    onChange={(e) => setTrackingId(e.target.value)} 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isSyncing}>
                {isSyncing ? "Syncing Registry..." : "Track Shipment"} 
                {!isSyncing && <ArrowRight size={18} className="ml-2" />}
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Live Telemetry</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">System Uptime</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-primary">{shipments.length}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Shipments</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-16 border-t bg-white px-6 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest">
        <div>© 2024 Maritrack Systems International</div>
        <div className="flex gap-6">
          <button onClick={() => navigate("/privacy")} className="hover:text-primary transition-colors">Privacy Policy</button>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;