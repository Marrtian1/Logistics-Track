"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Anchor, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: Resource not found at path:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex p-4 bg-secondary/50 text-primary rounded-full">
            <AlertCircle size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary tracking-tight">404</h1>
            <p className="text-lg font-bold text-muted-foreground uppercase tracking-widest">Resource Not Found</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The requested resource at <span className="font-mono font-bold text-primary">{location.pathname}</span> could not be located within the Maritrack network.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            onClick={() => navigate("/")} 
            className="h-11 px-8 font-bold uppercase tracking-wider text-xs"
          >
            <ArrowLeft size={16} className="mr-2" /> Return to Portal
          </Button>
        </div>

        <div className="pt-12 border-t">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Anchor size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Maritrack Systems International</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;