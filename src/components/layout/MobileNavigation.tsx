
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Warehouse, 
  Users, 
  Link as LinkIcon,
  AlertTriangle,
  Menu,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const navigationItems = [
    { href: "/", icon: <LayoutDashboard size={20} />, title: "Dashboard" },
    { href: "/register-asset", icon: <PlusCircle size={20} />, title: "Cadastrar Ativo" },
    { href: "/inventory", icon: <Warehouse size={20} />, title: "Inventário" },
    { href: "/clients", icon: <Users size={20} />, title: "Clientes" },
    { href: "/association", icon: <LinkIcon size={20} />, title: "Vincular Ativos" },
    { href: "/monitoring", icon: <AlertTriangle size={20} />, title: "Monitoramento" },
  ];

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 border-r-0 w-64">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-bold text-telecom-800">Telecom Nexus</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    pathname === item.href || 
                      (item.href !== "/" && pathname.startsWith(item.href))
                      ? "bg-telecom-100 text-telecom-900 font-medium" 
                      : "text-gray-500 hover:text-telecom-900 hover:bg-telecom-50"
                  )}
                >
                  <div className={cn(
                    "h-6 w-6",
                    pathname === item.href || 
                      (item.href !== "/" && pathname.startsWith(item.href))
                      ? "text-telecom-600" 
                      : "text-gray-400"
                  )}>
                    {item.icon}
                  </div>
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
