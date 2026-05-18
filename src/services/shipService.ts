import { Ship, Route, Shipment, Alert, Port } from "@/store/shipStore";

export const INITIAL_PORTS: Port[] = [
  { id: "port-1", name: "Port of Shanghai", code: "CNSHA", country: "China", coordinates: { lat: 31.2304, lng: 121.4737 } },
  { id: "port-2", name: "Port of Los Angeles", code: "USLAX", country: "USA", coordinates: { lat: 34.0522, lng: -118.2437 } },
  { id: "port-3", name: "Port of Rotterdam", code: "NLRTM", country: "Netherlands", coordinates: { lat: 51.9225, lng: 4.4791 } },
  { id: "port-4", name: "Port of Dubai", code: "AEJEA", country: "UAE", coordinates: { lat: 25.2048, lng: 55.2708 } },
  { id: "port-5", name: "Port of Tokyo", code: "JPTOK", country: "Japan", coordinates: { lat: 35.6762, lng: 139.6503 } },
  { id: "port-6", name: "Port of Sydney", code: "AUSYD", country: "Australia", coordinates: { lat: -33.8688, lng: 151.2093 } },
  { id: "port-7", name: "Port of New York", code: "USNYC", country: "USA", coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: "port-8", name: "Port of Southampton", code: "GBSOU", country: "UK", coordinates: { lat: 50.9097, lng: -1.4044 } }
];

export const INITIAL_SHIPS: Ship[] = [
  { 
    id: "ship-1", 
    name: "SS Aurora", 
    status: "sailing", 
    type: "Container Ship", 
    coordinates: { lat: 31.2304, lng: 121.4737 },
    speed: 18.5,
    eta: "Oct 24, 14:00",
    destination: "Los Angeles, USA",
    origin: "Shanghai, China",
    cargo: "Electronics & Textiles",
    history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, speed: 15 + Math.random() * 5 })),
    progressIndex: 0,
    route: []
  },
  { 
    id: "ship-2", 
    name: "MV Horizon", 
    status: "sailing", 
    type: "Oil Tanker", 
    coordinates: { lat: 25.2048, lng: 55.2708 },
    speed: 14.2,
    eta: "Oct 28, 09:00",
    destination: "Rotterdam, Netherlands",
    origin: "Dubai, UAE",
    cargo: "Crude Oil",
    history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, speed: 12 + Math.random() * 4 })),
    progressIndex: 0,
    route: []
  },
  { 
    id: "ship-3", 
    name: "FV Neptune", 
    status: "docked", 
    type: "Fishing Vessel", 
    coordinates: { lat: 64.1265, lng: -21.8174 },
    speed: 10.0,
    eta: "Oct 22, 18:30",
    destination: "Reykjavik, Iceland",
    origin: "North Atlantic",
    cargo: "Fresh Seafood",
    history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, speed: 8 + Math.random() * 3 })),
    progressIndex: 0,
    route: []
  },
  { 
    id: "ship-4", 
    name: "Pacific Voyager", 
    status: "sailing", 
    type: "Bulk Carrier", 
    coordinates: { lat: -33.8688, lng: 151.2093 },
    speed: 12.8,
    eta: "Nov 02, 06:00",
    destination: "Tokyo, Japan",
    origin: "Sydney, Australia",
    cargo: "Iron Ore",
    history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, speed: 11 + Math.random() * 3 })),
    progressIndex: 0,
    route: []
  },
  { 
    id: "ship-5", 
    name: "Atlantic Star", 
    status: "sailing", 
    type: "Ro-Ro Vessel", 
    coordinates: { lat: 40.7128, lng: -74.0060 },
    speed: 20.1,
    eta: "Oct 26, 22:00",
    destination: "Southampton, UK",
    origin: "New York, USA",
    cargo: "Automobiles",
    history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, speed: 18 + Math.random() * 4 })),
    progressIndex: 0,
    route: []
  }
];

export const INITIAL_ROUTES: Route[] = [
  {
    id: "route-1",
    name: "Shanghai to LA",
    coordinates: [
      { lat: 31.2304, lng: 121.4737 },
      { lat: 34.0522, lng: 160.0000 },
      { lat: 37.0000, lng: -160.0000 },
      { lat: 34.0522, lng: -118.2437 },
    ]
  },
  {
    id: "route-2",
    name: "Dubai to Rotterdam",
    coordinates: [
      { lat: 25.2048, lng: 55.2708 },
      { lat: 12.0000, lng: 45.0000 },
      { lat: 35.0000, lng: 15.0000 },
      { lat: 51.9225, lng: 4.4791 },
    ]
  },
  {
    id: "route-3",
    name: "Sydney to Tokyo",
    coordinates: [
      { lat: -33.8688, lng: 151.2093 },
      { lat: -10.0000, lng: 155.0000 },
      { lat: 15.0000, lng: 145.0000 },
      { lat: 35.6762, lng: 139.6503 },
    ]
  },
  {
    id: "route-4",
    name: "New York to Southampton",
    coordinates: [
      { lat: 40.7128, lng: -74.0060 },
      { lat: 45.0000, lng: -45.0000 },
      { lat: 50.0000, lng: -15.0000 },
      { lat: 50.9097, lng: -1.4044 },
    ]
  }
];

export function generateTrackingNumber() {
  const prefixes = ["RH", "CP", "RR"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const serial = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}${serial}CN`;
}

export function fetchInitialData() {
  const trackingNumbers = [
    "RH919403200CN",
    "RH823438247CN",
    "RH448717927CN",
    "RH983379844CN",
    "RH960531045CN",
    "RH572101444CN",
    "RH147113762CN",
    "RH243078728CN",
    "RH032869760CN",
    "RH078567363CN"
  ];

  const shipments: Shipment[] = trackingNumbers.map((num, i) => ({
    id: `sh-${i + 1}`,
    trackingNumber: num,
    shipId: `ship-${(i % INITIAL_SHIPS.length) + 1}`,
    routeId: `route-${(i % INITIAL_ROUTES.length) + 1}`,
    status: i % 4 === 0 ? "delayed" : "sailing",
    progressIndex: Math.random() * 2,
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }));

  return {
    ships: INITIAL_SHIPS,
    routes: INITIAL_ROUTES,
    shipments: shipments,
    ports: INITIAL_PORTS,
    alerts: [
      {
        id: "alt-1",
        shipId: "ship-1",
        shipName: "SS Aurora",
        type: "Weather",
        message: "Approaching high-pressure system in North Pacific.",
        timestamp: new Date().toISOString(),
        severity: "medium",
        read: false
      },
      {
        id: "alt-2",
        shipId: "ship-4",
        shipName: "Pacific Voyager",
        type: "Engine",
        message: "Minor vibration detected in secondary propulsion unit.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        severity: "low",
        read: false
      }
    ] as Alert[]
  };
}