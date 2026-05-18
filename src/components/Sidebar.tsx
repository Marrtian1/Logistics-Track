"use client";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, Ship, Map, Bell, ChevronLeft, ChevronRight, Anchor, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const links = [
  { to: "/dashboard", label: "Fleet Map", icon: LayoutDashboard },
  { to: "/ships", label: "Vessels", icon: Ship },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/admin", label: "Administration", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Session terminated");
    navigate("/");
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 bg-sidebar-background border-r border-sidebar-border text-sidebar-foreground transition-all duration-200 z-[2000] flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Anchor size={20} className="text-accent" />
            <span className="font-semibold tracking-tight text-sm uppercase">Maritrack Pro</span>
          </div>
        )}
        <button
          className="p-1.5 hover:bg-sidebar-accent rounded transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 py-2 px-3 rounded text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-white" 
                  : "text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-accent/50"
              )
            }
          >
            <l.icon size={18} className="shrink-0" />
            {!collapsed && <span>{l.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-1">
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 py-2 px-3 rounded text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors",
              collapsed && "justify-center"
            )}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        )}
        
        <div className={cn(
          "flex items-center gap-3 p-2 rounded bg-sidebar-accent/30",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center shrink-0 text-xs font-bold">
            {user?.email?.[0].toUpperCase() || "O"}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-xs font-semibold truncate">{user?.email || "Observer"}</div>
              <div className="text-[10px] text-sidebar-foreground/40 truncate uppercase tracking-wider">
                {user?.role || "Guest"}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}