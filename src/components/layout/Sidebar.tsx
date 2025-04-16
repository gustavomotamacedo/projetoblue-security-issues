
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

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-screen flex-shrink-0 bg-white border-r">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-bold tracking-tight text-blue-600">
          BLUE
        </h1>
      </div>
      <nav className="flex-1 overflow-auto py-4 px-3">
        <div className="flex flex-col gap-1">
          <NavLink
            to="/"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/register-asset"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/register-asset")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Cadastrar Ativo</span>
          </NavLink>
          <NavLink
            to="/inventory"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/inventory")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <PackageSearch className="h-4 w-4" />
            <span>Inventário</span>
          </NavLink>
          <NavLink
            to="/clients"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/clients")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Clientes</span>
          </NavLink>
          <NavLink
            to="/association"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/association")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Link className="h-4 w-4" />
            <span>Vincular Ativos</span>
          </NavLink>
          <NavLink
            to="/subscriptions"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/subscriptions")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Assinaturas</span>
          </NavLink>
          <NavLink
            to="/history"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/history")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Histórico</span>
          </NavLink>
          <NavLink
            to="/monitoring"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/monitoring")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ActivitySquare className="h-4 w-4" />
            <span>Monitoramento</span>
          </NavLink>
          <NavLink
            to="/data-usage"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/data-usage")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Consumo de Dados</span>
          </NavLink>
          <NavLink
            to="/wifi-analyzer"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive("/wifi-analyzer")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Wifi className="h-4 w-4" />
            <span>WiFi Analyzer</span>
          </NavLink>
        </div>
      </nav>
      <div className="border-t p-4">
        <div className="text-xs text-gray-500">
          © 2025 - BLUE
          <br />
          Ver. 2.0
        </div>
      </div>
    </div>
  );
}
