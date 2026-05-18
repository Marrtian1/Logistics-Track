import { useShipStore } from "@/store/shipStore";
import { useEffect, useRef } from "react";

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function useSimulationEngine() {
  const start = useShipStore((s) => s.startSimulation);
  const stop = useShipStore((s) => s.stopSimulation);
  const tick = useShipStore((s) => s.tick);

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  useInterval(tick, 16);
}