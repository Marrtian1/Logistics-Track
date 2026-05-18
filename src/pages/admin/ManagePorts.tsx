"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useShipStore, Port } from "@/store/shipStore";
import { Anchor, Search, Plus, Trash2, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

export default function ManagePorts() {
  const { ports, addPort, deletePort } = useShipStore();
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [newPort, setNewPort] = useState({
    name: "",
    code: "",
    country: "",
    lat: "",
    lng: ""
  });

  const filteredPorts = ports.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPort.name || !newPort.code || !newPort.lat || !newPort.lng) {
      toast.error("Please fill in all required fields");
      return;
    }

    const port: Port = {
      id: `port-${Date.now()}`,
      name: newPort.name,
      code: newPort.code.toUpperCase(),
      country: newPort.country,
      coordinates: {
        lat: parseFloat(newPort.lat),
        lng: parseFloat(newPort.lng)
      }
    };

    addPort(port);
    toast.success(`Port ${port.name} added to registry`);
    setIsAdding(false);
    setNewPort({ name: "", code: "", country: "", lat: "", lng: "" });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Remove ${name} from global port registry?`)) {
      deletePort(id);
      toast.success(`Port ${name} removed`);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 flex flex-col">
        <Header title="Port Registry" subtitle="Global maritime infrastructure management" />

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  placeholder="Search ports by name, code, or country..." 
                  className="pl-9 h-10 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsAdding(!isAdding)} className="h-10 font-bold uppercase tracking-wider text-[10px]">
                <Plus size={14} className="mr-2" /> {isAdding ? "Cancel" : "Register Port"}
              </Button>
            </div>

            {isAdding && (
              <div className="bg-white border rounded shadow-sm p-6 animate-in fade-in slide-in-from-top-2">
                <form onSubmit={handleAddPort} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Port Name</label>
                    <Input 
                      placeholder="e.g. Port of Singapore" 
                      value={newPort.name}
                      onChange={e => setNewPort({...newPort, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">UN/LOCODE</label>
                    <Input 
                      placeholder="e.g. SGSIN" 
                      value={newPort.code}
                      onChange={e => setNewPort({...newPort, code: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Country</label>
                    <Input 
                      placeholder="e.g. Singapore" 
                      value={newPort.country}
                      onChange={e => setNewPort({...newPort, country: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Latitude</label>
                    <Input 
                      type="number" 
                      step="any"
                      placeholder="1.2902" 
                      value={newPort.lat}
                      onChange={e => setNewPort({...newPort, lat: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Longitude</label>
                    <Input 
                      type="number" 
                      step="any"
                      placeholder="103.8519" 
                      value={newPort.lng}
                      onChange={e => setNewPort({...newPort, lng: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full h-10 font-bold uppercase tracking-widest text-[10px]">
                      Confirm Registration
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white border rounded shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 border-b">
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Port / Code</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Location</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Coordinates</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPorts.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/10 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary rounded">
                            <Anchor size={16} className="text-primary" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-primary">{p.name}</div>
                            <div className="text-[10px] font-mono text-accent font-bold uppercase">{p.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <Globe size={14} />
                          <span>{p.country}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground">
                          <MapPin size={12} />
                          <span>{p.coordinates.lat.toFixed(4)}°, {p.coordinates.lng.toFixed(4)}°</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPorts.length === 0 && (
                <div className="p-12 text-center text-muted-foreground text-sm font-medium">
                  No ports found in the registry.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}