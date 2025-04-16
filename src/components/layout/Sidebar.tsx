
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  PackageSearch,
  Users,
  Link,
  Clock,
  ActivitySquare,
  History,
  Database,
  Wifi,
} from "lucide-react";
import { NamedLogo } from "@/components/ui/namedlogo";

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-screen flex-shrink-0 bg-sidebar border-r">
      <div className="flex h-16 items-center border-b px-4">
        <NamedLogo size="sm" />
      </div>
      <nav className="flex-1 overflow-auto py-4 px-3">
        <div className="flex flex-col gap-1">
          <NavLink
            to="/"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/register-asset"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/register-asset")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Cadastrar Ativo</span>
          </NavLink>
          <NavLink
            to="/inventory"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/inventory")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <PackageSearch className="h-4 w-4" />
            <span>Inventário</span>
          </NavLink>
          <NavLink
            to="/clients"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/clients")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Clientes</span>
          </NavLink>
          <NavLink
            to="/association"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/association")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <Link className="h-4 w-4" />
            <span>Vincular Ativos</span>
          </NavLink>
          <NavLink
            to="/subscriptions"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/subscriptions")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Assinaturas</span>
          </NavLink>
          <NavLink
            to="/history"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/history")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Histórico</span>
          </NavLink>
          <NavLink
            to="/monitoring"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/monitoring")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <ActivitySquare className="h-4 w-4" />
            <span>Monitoramento</span>
          </NavLink>
          <NavLink
            to="/data-usage"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/data-usage")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Consumo de Dados</span>
          </NavLink>
          <NavLink
            to="/wifi-analyzer"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/wifi-analyzer")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <Wifi className="h-4 w-4" />
            <span>WiFi Analyzer</span>
          </NavLink>
        </div>
      </nav>
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} - Telecom Asset Nexus
          <br />
          Ver. 2.0
        </div>
      </div>
    </div>
  );
}
