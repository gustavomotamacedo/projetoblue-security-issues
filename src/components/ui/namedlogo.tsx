
import React from "react";
import { cn } from "@/lib/utils";

export interface NamedLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function NamedLogo({ className, size = "md", ...props }: NamedLogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <img 
        src="/logo.png" 
        alt="Telecom Asset Nexus Logo" 
        className={cn("mr-2", sizeClasses[size])}
      />
      <span className={cn(
        "font-bold text-primary",
        size === "sm" && "text-lg",
        size === "md" && "text-xl",
        size === "lg" && "text-3xl"
      )}>
        Telecom Asset Nexus
      </span>
    </div>
  );
}
