
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Warehouse, 
  Users, 
  Link as LinkIcon,
  AlertTriangle
} from "lucide-react";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  active: boolean;
};

const NavItem = ({ href, icon, title, active }: NavItemProps) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active 
          ? "bg-telecom-100 text-telecom-900 font-medium" 
          : "text-gray-500 hover:text-telecom-900 hover:bg-telecom-50"
      )}
    >
      <div className={cn(
        "h-6 w-6",
        active ? "text-telecom-600" : "text-gray-400"
      )}>
        {icon}
      </div>
      <span>{title}</span>
    </Link>
  );
};

export function Sidebar() {
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
    <div className="hidden md:flex flex-col gap-2 h-full bg-white border-r pt-6 px-3 overflow-y-auto">
      <div className="px-3 py-2">
        <h2 className="text-xl font-bold text-telecom-800">
          Telecom Nexus
        </h2>
        <p className="text-xs text-gray-500">Gestão de Ativos</p>
      </div>
      
      <div className="my-4 border-t border-gray-100" />
      
      <nav className="flex flex-col gap-1">
        {navigationItems.map((item, index) => (
          <NavItem
            key={index}
            href={item.href}
            icon={item.icon}
            title={item.title}
            active={
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            }
          />
        ))}
      </nav>
    </div>
  );
}
