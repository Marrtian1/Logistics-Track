"use client";

import { Anchor, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotificationCenter from "./NotificationCenter";
import { useAuthStore } from "@/store/authStore";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showAdminLink?: boolean;
}

export default function Header({ title, subtitle, showAdminLink = false }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-4">
        {title ? (
          <div>
            <h1 className="text-sm font-bold text-primary uppercase tracking-widest">{title}</h1>
            {subtitle && <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{subtitle}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Anchor className="text-accent" size={20} />
            <span className="text-sm font-bold tracking-tight text-primary uppercase">
              Maritrack <span className="text-accent">Systems</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {showAdminLink && !isAuthenticated && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
            onClick={() => navigate("/admin/login")}
          >
            <Lock size={14} className="mr-2" /> Admin Access
          </Button>
        )}

        <NotificationCenter />

        <div className="h-8 w-[1px] bg-border mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold text-primary uppercase tracking-tight">
              {user?.email?.split('@')[0] || "Guest Observer"}
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
              {user?.role || "Public Access"}
            </div>
          </div>
          <div className="h-9 w-9 rounded bg-secondary flex items-center justify-center border shadow-sm">
            <User size={18} className="text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}