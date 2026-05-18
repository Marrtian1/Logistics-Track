"use client";

import { memo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Ship } from "@/store/shipStore";

// Professional vessel icon with direction indicator and pulse
const createShipIcon = (status: string) => new L.DivIcon({
  className: 'custom-ship-icon',
  html: `
    <div class="relative flex items-center justify-center">
      ${status === 'sailing' ? '<div class="absolute w-8 h-8 bg-accent/20 rounded-full animate-ping"></div>' : ''}
      <div class="relative w-6 h-6 bg-white border-2 border-primary rounded shadow-sm flex items-center justify-center z-10">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="${status === 'sailing' ? 'text-accent' : 'text-muted-foreground'}">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface Props {
  ship: Ship;
  onClick: (ship: Ship) => void;
}

const ShipMarker = memo(({ ship, onClick }: Props) => {
  return (
    <Marker
      position={[ship.coordinates.lat, ship.coordinates.lng]}
      icon={createShipIcon(ship.status)}
      eventHandlers={{
        click: () => onClick(ship),
      }}
    >
      <Popup className="enterprise-popup">
        <div className="p-1 min-w-[140px]">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Vessel Registry</div>
            {ship.status === 'sailing' && (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[8px] font-bold text-emerald-600 uppercase">Live</span>
              </div>
            )}
          </div>
          <div className="text-sm font-bold text-primary mb-3 border-b pb-2">{ship.name}</div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Status</span>
              <span className="text-[10px] font-bold text-accent uppercase">{ship.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Speed</span>
              <span className="text-[10px] font-bold text-primary font-mono">{ship.speed} kn</span>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t">
            <div className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Destination</div>
            <div className="text-[10px] font-bold text-primary truncate">{ship.destination.split(',')[0]}</div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
});

export default ShipMarker;