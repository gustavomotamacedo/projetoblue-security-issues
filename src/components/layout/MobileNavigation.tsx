
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { NamedLogo } from "@/components/ui/namedlogo";

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label="Menu de Navegação"
        >
          <Menu size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
        <div className="flex h-16 items-center border-b p-4">
          <NamedLogo size="sm" />
        </div>
        <nav className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/register-asset"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              Cadastrar Ativo
            </NavLink>
            <NavLink
              to="/inventory"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              Inventário
            </NavLink>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              Clientes
            </NavLink>
            <NavLink
              to="/association"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              Vincular Ativos
            </NavLink>
            <NavLink
              to="/subscriptions"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              Assinaturas
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              Histórico
            </NavLink>
            <NavLink
              to="/monitoring"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              Monitoramento
            </NavLink>
            <NavLink
              to="/data-usage"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              Consumo de Dados
            </NavLink>
            <NavLink
              to="/wifi-analyzer"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`
              }
            >
              WiFi Analyzer
            </NavLink>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
