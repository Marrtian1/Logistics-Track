"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Anchor, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (email === "admin@maritrack.com" && password === "admin123") {
        login(email, "mock-jwt-token-" + Date.now());
        toast.success("Authentication successful");
        navigate("/admin");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary rounded mb-4">
            <Anchor className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary uppercase">Admin Portal</h1>
          <p className="text-sm text-muted-foreground font-medium">Secure access for authorized personnel only</p>
        </div>

        <div className="bg-white border shadow-sm p-8 rounded space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-0.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    type="email" 
                    placeholder="admin@maritrack.com" 
                    className="pl-10 h-11 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-0.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-sm font-bold uppercase tracking-wider"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Sign In"}
              {!isLoading && <ArrowRight className="ml-2" size={16} />}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
              Maritrack Security Protocol v4.2
            </p>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => navigate("/")}
            className="text-xs text-muted-foreground hover:text-primary font-bold uppercase tracking-wider transition-colors"
          >
            Return to Public Portal
          </button>
        </div>
      </div>
    </div>
  );
}