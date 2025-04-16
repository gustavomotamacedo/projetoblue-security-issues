
import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

export interface NamedLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function NamedLogo({ className, size = "md", ...props }: NamedLogoProps) {
  const { theme } = useTheme();
  const sizeClasses = {
    sm: "h-8",
    md: "h-16",
    lg: "h-24",
  };

  // Invertendo as imagens conforme solicitado
  const logoSrc = theme === 'dark' 
    ? "/lovable-uploads/9cefa99b-4f17-4b65-98ed-e727936c5163.png" 
    : "/lovable-uploads/6e637c63-2cf9-4645-8248-02ba712b8b7c.png";

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <img 
        src={logoSrc} 
        alt="BLUE Logo" 
        className={cn(sizeClasses[size])}
      />
    </div>
  );
}
