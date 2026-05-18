"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useShipStore, Coordinates } from "@/store/shipStore";
import { MapContainer, TileLayer, Polyline, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Map as MapIcon, Save, RotateCcw, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import L from "leaflet";

const pointIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3b82f6; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5]
});

function MapClickHandler({ onAddPoint }: { onAddPoint: (coord: Coordinates) => void }) {
  useMapEvents({
    click(e) {
      onAddPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function CreateRoute() {
  const navigate = useNavigate();
  const addRoute = useShipStore((s) => s.addRoute);
  const [routeName, setRouteName] = useState("");
  const [points, setPoints] = useState<Coordinates[]>([]);

  const handleAddPoint = (coord: Coordinates) => {
    setPoints([...points, coord]);
  };

  const handleRemovePoint = (index: number) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!routeName) {
      toast.error("Route name required");
      return;
    }
    if (points.length < 2) {
      toast.error("Minimum 2 waypoints required");
      return;
    }

    const newRoute = {
      id: `route-${Date.now()}`,
      name: routeName,
      coordinates: points
    };

    addRoute(newRoute);
    toast.success(`Route "${routeName}" saved`);
    navigate("/admin");
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="h-8 w-8">
              <ArrowLeft size={16} />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-primary">Route Architect</h1>
              <p className="text-xs text-muted-foreground font-medium">Define shipping lane waypoints via map interaction</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 text-[10px] font-bold uppercase tracking-wider"
              onClick={() => setPoints([])}
            >
              <RotateCcw size={14} className="mr-2" /> Reset
            </Button>
            <Button onClick={handleSave} size="sm" className="h-9 text-[10px] font-bold uppercase tracking-wider">
              <Save size={14} className="mr-2" /> Save Route
            </Button>
          </div>
        </header>

        <div className="flex-1 flex relative">
          <div className="flex-1 z-0">
            <MapContainer
              center={[20, 0]}
              zoom={3}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <MapClickHandler onAddPoint={handleAddPoint} />
              
              {points.length > 0 && (
                <>
                  <Polyline 
                    positions={points.map(p => [p.lat, p.lng] as [number, number])} 
                    color="#3b82f6" 
                    weight={2}
                    dashArray="5, 10"
                  />
                  {points.map((p, i) => (
                    <Marker 
                      key={i} 
                      position={[p.lat, p.lng]} 
                      icon={pointIcon}
                    />
                  ))}
                </>
              )}
            </MapContainer>
          </div>

          <div className="w-80 bg-white border-l p-6 overflow-y-auto z-10 shadow-xl">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Route Designation</label>
                <Input 
                  placeholder="e.g. North Atlantic Express" 
                  className="h-10 text-sm"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Waypoints ({points.length})</label>
                  <MapIcon size={14} className="text-accent" />
                </div>
                
                <div className="space-y-2">
                  {points.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary/20 rounded border border-dashed group">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded bg-primary text-white text-[9px] flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                        <div className="font-mono text-[10px] text-primary font-medium">
                          {p.lat.toFixed(3)}°, {p.lng.toFixed(3)}°
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemovePoint(i)}
                        className="opacity-0 group-hover:opacity-100 text-rose-600 hover:text-rose-700 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {points.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                      Click map to add points
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}