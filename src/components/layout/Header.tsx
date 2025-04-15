
import { MobileNavigation } from "./MobileNavigation";
import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center bg-white border-b px-4 lg:px-6">
      <MobileNavigation />
      <div className="ml-auto flex items-center space-x-4">
        <button className="p-2 rounded-md hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-telecom-500 flex items-center justify-center text-white">
            <span className="text-sm font-medium">A</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-500">admin@operadoralegal.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
