
"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AvatarGroupProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}

export function AvatarGroup({ children, className, reverse = false }: AvatarGroupProps) {
  return (
    <div 
      className={cn(
        reverse 
          ? "flex flex-row-reverse justify-end -space-x-3 space-x-reverse *:ring *:ring-background" 
          : "flex -space-x-3 *:ring *:ring-background",
        className
      )}
    >
      {children}
    </div>
  );
}
