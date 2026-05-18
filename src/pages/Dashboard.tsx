"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ShipMarker from "@/components/ShipMarker";
import Sidebar from "@/components/Sidebar";
import ShipDetailsPanel from "@/components/ShipDetailsPanel";
import SimulationControls from "@/components/SimulationControls";
import StatsCards from "@/components/StatsCards";
import { useShipStore } from "@/store/shipStore";
import { useSimulationEngine } from "@/services/simulationService";
import { Badge } from "@/components/ui/badge";
import { Activity, Radio } from "lucide-react";

// Component to handle map centering
function MapController({ center }: { center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const { ships, shipments, routes, setSelectedShipment, selectedShipmentId, followVessel, setFollowVessel } = useShipStore();

  useEffect(() => {
    const trackingNum = searchParams.get("tracking");
    if (trackingNum) {
      const shipment = shipments.find(s => s.trackingNumber === trackingNum);
      if (shipment) {
        setSelectedShipment(shipment.id);
      }
    }
  }, [searchParams, shipments, setSelectedShipment]);

  useSimulationEngine();

  const selectedShipment = shipments.find(s => s.id === selectedShipmentId);
  const selectedShip = selectedShipment ? ships.find(s => s.id === selectedShipment.shipId) : null;
  const selectedRoute = selectedShipment ? routes.find(r => r.id === selectedShipment.routeId) : null;

  const mapCenter: [number, number] | undefined = (followVessel && selectedShip) 
    ? [selectedShip.coordinates.lat, selectedShip.coordinates.lng] 
    : undefined;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 relative ml-16 md:ml-64 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-primary uppercase tracking-widest">Fleet Operations</h1>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-bold uppercase flex gap-1 items-center">
                <Radio size={10} className="animate-pulse" /> Live AIS Feed
              </Badge>
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              {ships.filter(s => s.status === 'sailing').length} Active Transponders
            </div>
          </div>
          <SimulationControls />
        </header>

        <div className="flex-1 relative">
          <div className="absolute inset-0 z-0">
            <MapContainer
              center={[20, 0]}
              zoom={3}
              zoomControl={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <ZoomControl position="bottomleft" />
              <MapController center={mapCenter} />
              
              {ships.map((ship) => (
                <ShipMarker 
                  key={ship.id} 
                  ship={ship} 
                  onClick={() => {
                    const shipment = shipments.find(s => s.shipId === ship.id && s.status === 'sailing');
                    if (shipment) setSelectedShipment(shipment.id);
                  }} 
                />
              ))}

              {selectedRoute && (
                <Polyline
                  positions={selectedRoute.coordinates.map((p) => [p.lat, p.lng] as [number, number])}
                  color="#3b82f6"
                  weight={2}
                  dashArray="5, 10"
                  opacity={0.5}
                />
              )}
            </MapContainer>
          </div>

          {/* Floating Stats */}
          <div className="absolute top-6 left-6 z-10">
            <StatsCards />
          </div>

          {/* Follow Toggle */}
          {selectedShip && (
            <div className="absolute bottom-6 right-6 z-10">
              <button 
                onClick={() => setFollowVessel(!followVessel)}
                className={`px-4 py-2 rounded shadow-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  followVessel ? 'bg-accent text-white' : 'bg-white text-primary border'
                }`}
              >
                {followVessel ? 'AIS Lock Active' : 'Manual Camera'}
              </button>
            </div>
          )}

          {/* Details Panel */}
          {selectedShipment && (
            <ShipDetailsPanel />
          )}
        </div>
      </main>
    </div>
  );
}