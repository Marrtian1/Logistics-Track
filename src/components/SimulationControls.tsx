"use client";

import { useShipStore } from "@/store/shipStore";
import { Play, Pause, FastForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SimulationControls() {
  const { simulationRunning, simulationSpeed, startSimulation, stopSimulation, setSpeed } = useShipStore();

  return (
    <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded border">
      <div className="flex items-center px-2 mr-1">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Simulation</span>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 rounded transition-colors",
          simulationRunning ? "text-accent bg-white shadow-sm border" : "text-muted-foreground hover:text-primary"
        )}
        onClick={simulationRunning ? stopSimulation : startSimulation}
      >
        {simulationRunning ? <Pause size={14} /> : <Play size={14} />}
      </Button>
      
      <div className="h-4 w-[1px] bg-border mx-1" />
      
      {[1, 2, 5, 10].map((speed) => (
        <Button
          key={speed}
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2 text-[10px] font-bold rounded transition-all",
            simulationSpeed === speed ? "bg-white text-accent shadow-sm border" : "text-muted-foreground hover:text-primary"
          )}
          onClick={() => setSpeed(speed)}
        >
          {speed}X
        </Button>
      ))}
    </div>
  );
}