
import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

export interface NamedLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function NamedLogo({ className, size = "md", ...props }: NamedLogoProps) {
  const { theme } = useTheme();
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  // Usar a imagem apropriada com base no tema
  const logoSrc = theme === 'dark' 
    ? "/lovable-uploads/6e637c63-2cf9-4645-8248-02ba712b8b7c.png" 
    : "/lovable-uploads/9cefa99b-4f17-4b65-98ed-e727936c5163.png";

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <img 
        src={logoSrc} 
        alt="BLUE Logo" 
        className={cn("mr-2", sizeClasses[size])}
      />
      <span className={cn(
        "font-bold text-primary",
        size === "sm" && "text-lg",
        size === "md" && "text-xl",
        size === "lg" && "text-3xl"
      )}>
        BLUE
      </span>
    </div>
  );
}
