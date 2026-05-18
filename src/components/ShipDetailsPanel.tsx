"use client";

import { useShipStore } from "@/store/shipStore";
import { X, Ship as ShipIcon, Navigation, Gauge, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ShipDetailsPanel() {
  const { ships, shipments, selectedShipmentId, setSelectedShipment, setFollowVessel, followVessel } = useShipStore();
  const shipment = shipments.find((s) => s.id === selectedShipmentId);
  const ship = ships.find((s) => s.id === shipment?.shipId);

  if (!ship) return null;

  const statusColors = {
    sailing: "bg-blue-50 text-blue-700 border-blue-200",
    docked: "bg-emerald-50 text-emerald-700 border-emerald-200",
    delayed: "bg-amber-50 text-amber-700 border-amber-200",
    anchored: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        className="absolute top-0 right-0 bottom-0 w-80 bg-white border-l shadow-2xl z-[1000] flex flex-col"
      >
        <div className="h-16 p-4 border-b flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white border rounded shadow-sm">
              <ShipIcon className="text-primary" size={14} />
            </div>
            <h3 className="font-bold text-primary text-xs uppercase tracking-widest">{ship.name}</h3>
          </div>
          <button 
            onClick={() => setSelectedShipment(null)}
            className="p-1.5 hover:bg-secondary rounded transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Operational Status</label>
            <Badge variant="outline" className={cn("w-full justify-center py-1.5 text-[10px] font-bold rounded border shadow-sm", statusColors[ship.status])}>
              {ship.status.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/20 p-3 rounded border border-dashed">
              <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                <Gauge size={12} />
                <span className="text-[9px] uppercase font-bold tracking-widest">Speed</span>
              </div>
              <div className="text-base font-bold text-primary">{ship.speed} <span className="text-[10px] font-normal text-muted-foreground">kn</span></div>
            </div>
            <div className="bg-secondary/20 p-3 rounded border border-dashed">
              <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                <Clock size={12} />
                <span className="text-[9px] uppercase font-bold tracking-widest">ETA</span>
              </div>
              <div className="text-base font-bold text-primary">{ship.eta.split(',')[0]}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground border-b pb-2">
              <MapPin size={12} />
              <span className="text-[9px] uppercase font-bold tracking-widest">Telemetry Data</span>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/10 rounded border">
              <div>
                <div className="text-muted-foreground text-[8px] font-bold uppercase tracking-widest">Latitude</div>
                <div className="text-xs font-mono font-bold text-primary">{ship.coordinates.lat.toFixed(4)}°</div>
              </div>
              <div>
                <div className="text-muted-foreground text-[8px] font-bold uppercase tracking-widest">Longitude</div>
                <div className="text-xs font-mono font-bold text-primary">{ship.coordinates.lng.toFixed(4)}°</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Route Progress</label>
              <span className="text-[10px] font-bold text-accent">{Math.round((ship.progressIndex / (ship.route?.length || 1)) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden border shadow-inner">
              <motion.div 
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(ship.progressIndex / (ship.route?.length || 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
              <span className="truncate max-w-[100px]">{ship.origin}</span>
              <span className="truncate max-w-[100px] text-right">{ship.destination}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-secondary/30 border-t">
          {followVessel && (
            <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground text-center">
              Tracking vessel: <span className="font-semibold text-primary">{ship.name}</span>
            </div>
          )}
          <button 
            onClick={() => setFollowVessel(true)}
            className="w-full py-2.5 bg-primary text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Navigation size={14} />
            Focus Vessel
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}