
import { cn } from "@/lib/utils";
import { Loader2, Loader as LoaderIcon } from "lucide-react";

interface LoaderProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "spinner" | "bar";
  className?: string;
}

export function Loader({ size = "md", variant = "default", className }: LoaderProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
    xl: "h-16 w-16",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div className={cn("animate-loader-dot1 rounded-full bg-current", sizeClasses[size])} />
        <div className={cn("animate-loader-dot2 rounded-full bg-current", sizeClasses[size])} />
        <div className={cn("animate-loader-dot3 rounded-full bg-current", sizeClasses[size])} />
      </div>
    );
  }

  if (variant === "spinner") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full border-2 border-current opacity-20"></div>
        <div className="absolute inset-0 rounded-full border-t-2 border-current animate-spin"></div>
      </div>
    );
  }

  if (variant === "bar") {
    return (
      <div className={cn("relative h-1 w-full overflow-hidden bg-primary/20 rounded-full", className)}>
        <div className="absolute inset-y-0 w-1/3 bg-primary animate-loader-bar"></div>
      </div>
    );
  }

  // Default spinner
  return <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />;
}
