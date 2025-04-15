
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <nav className="flex flex-col gap-6 mt-6">
          <h3 className="font-semibold text-primary mb-2">Operadora LEGAL</h3>
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
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
