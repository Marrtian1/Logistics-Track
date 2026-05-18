import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Coordinates = { lat: number; lng: number };
export type ShipStatus = "sailing" | "docked" | "delayed" | "anchored";
export type ShipmentStatus = "preparing" | "sailing" | "delivered" | "delayed";

export interface HistoryPoint {
  time: string;
  speed: number;
}

export interface Alert {
  id: string;
  shipId: string;
  shipName: string;
  type: string;
  message: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
  read?: boolean;
}

export interface Port {
  id: string;
  name: string;
  code: string;
  coordinates: Coordinates;
  country: string;
}

export interface Ship {
  id: string;
  name: string;
  status: ShipStatus;
  coordinates: Coordinates;
  type: string;
  speed: number;
  eta: string;
  destination: string;
  origin: string;
  cargo: string;
  history: HistoryPoint[];
  progressIndex: number;
  route: Coordinates[];
}

export interface Route {
  id: string;
  name: string;
  coordinates: Coordinates[];
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  shipId: string;
  routeId: string;
  status: ShipmentStatus;
  progressIndex: number;
  createdAt: string;
}

interface ShipState {
  ships: Ship[];
  routes: Route[];
  shipments: Shipment[];
  alerts: Alert[];
  ports: Port[];
  selectedShipmentId: string | null;
  selectedShipId: string | null;
  simulationRunning: boolean;
  simulationSpeed: number;
  followVessel: boolean;
  
  // Actions
  setShips: (ships: Ship[]) => void;
  setRoutes: (routes: Route[]) => void;
  setShipments: (shipments: Shipment[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  setPorts: (ports: Port[]) => void;
  
  addShip: (ship: Ship) => void;
  addRoute: (route: Route) => void;
  addShipment: (shipment: Shipment) => void;
  addAlert: (alert: Alert) => void;
  addPort:(port: Port) => void;
  markAlertAsRead: (id: string) => void;
  
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;
  deletePort: (id: string) => void;
  
  setSelectedShipment: (id: string | null) => void;
  setSelectedShip: (id: string | null) => void;
  setFollowVessel: (follow: boolean) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  setSpeed: (speed: number) => void;
  tick: () => void;
}

export const useShipStore = create<ShipState>()(
  devtools(
    persist(
      (set, get) => ({
        ships: [],
        routes: [],
        shipments: [],
        alerts: [],
        ports: [],
        selectedShipmentId: null,
        selectedShipId: null,
        simulationRunning: true,
        simulationSpeed: 1,
        followVessel: true,

        setShips: (ships) => set({ ships }),
        setRoutes: (routes) => set({ routes }),
        setShipments: (shipments) => set({ shipments }),
        setAlerts: (alerts) => set({ alerts }),
        setPorts: (ports) => set({ ports }),

        addShip: (ship) => set((state) => ({ ships: [...state.ships, ship] })),
        addRoute: (route) => set((state) => ({ routes: [...state.routes, route] })),
        addShipment: (shipment) => set((state) => ({ shipments: [...state.shipments, shipment] })),
        addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
        addPort: (port) => set((state) => ({ ports: [...state.ports, port] })),
        
        markAlertAsRead: (id) => set((state) => ({
          alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a)
        })),

        updateShipment: (id, updates) => set((state) => ({
          shipments: state.shipments.map(s => s.id === id ? { ...s, ...updates } : s)
        })),

        deleteShipment: (id) => set((state) => ({
          shipments: state.shipments.filter(s => s.id !== id)
        })),

        deletePort: (id) => set((state) => ({
          ports: state.ports.filter(p => p.id !== id)
        })),

        setSelectedShipment: (id) => set({ selectedShipmentId: id }),
        setSelectedShip: (id) => set({ selectedShipId: id }),
        setFollowVessel: (follow) => set({ followVessel: follow }),
        startSimulation: () => set({ simulationRunning: true }),
        stopSimulation: () => set({ simulationRunning: false }),
        setSpeed: (speed) => set({ simulationSpeed: speed }),

        tick: () => {
          const state = get();
          if (!state.simulationRunning) return;

          const updatedShipments = state.shipments.map((shipment) => {
            if (shipment.status !== "sailing") return shipment;

            const route = state.routes.find(r => r.id === shipment.routeId);
            if (!route) return shipment;

            const nextIndex = shipment.progressIndex + (0.01 * state.simulationSpeed);
            
            if (nextIndex >= route.coordinates.length - 1) {
              return { ...shipment, progressIndex: route.coordinates.length - 1, status: "delivered" as ShipmentStatus };
            }

            return { ...shipment, progressIndex: nextIndex };
          });

          const updatedShips = state.ships.map(ship => {
            const activeShipment = updatedShipments.find(s => s.shipId === ship.id && s.status === "sailing");
            if (activeShipment) {
              const route = state.routes.find(r => r.id === activeShipment.routeId);
              if (route) {
                const idx = Math.floor(activeShipment.progressIndex);
                const nextIdx = Math.min(idx + 1, route.coordinates.length - 1);
                const t = activeShipment.progressIndex - idx;
                
                const p1 = route.coordinates[idx];
                const p2 = route.coordinates[nextIdx];
                
                return {
                  ...ship,
                  coordinates: {
                    lat: p1.lat + (p2.lat - p1.lat) * t,
                    lng: p1.lng + (p2.lng - p1.lng) * t
                  },
                  status: "sailing" as ShipStatus,
                  progressIndex: activeShipment.progressIndex,
                  route: route.coordinates
                };
              }
            }
            return ship;
          });

          set({ shipments: updatedShipments, ships: updatedShips });
        },
      }),
      { name: "maritrack-storage" }
    )
  )
);