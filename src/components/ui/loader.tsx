
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "dots" | "spinner";
}

export function Loader({ 
  size = "md", 
  variant = "default", 
  className,
  ...props 
}: LoaderProps) {
  if (variant === "dots") {
    return (
      <div className={cn("flex items-center space-x-2", className)} {...props}>
        <div className={cn(
          "animate-pulse rounded-full bg-foreground",
          {
            "h-2 w-2": size === "sm",
            "h-3 w-3": size === "md",
            "h-4 w-4": size === "lg",
          }
        )} />
        <div className={cn(
          "animate-pulse rounded-full bg-foreground animation-delay-200",
          {
            "h-2 w-2": size === "sm",
            "h-3 w-3": size === "md",
            "h-4 w-4": size === "lg",
          }
        )} />
        <div className={cn(
          "animate-pulse rounded-full bg-foreground animation-delay-500",
          {
            "h-2 w-2": size === "sm",
            "h-3 w-3": size === "md",
            "h-4 w-4": size === "lg",
          }
        )} />
      </div>
    );
  }

  if (variant === "spinner") {
    return (
      <div className={cn("relative", className)} {...props}>
        <div className={cn(
          "animate-spin rounded-full border-t-2 border-r-2 border-foreground",
          {
            "h-4 w-4 border-2": size === "sm",
            "h-8 w-8 border-2": size === "md",
            "h-12 w-12 border-3": size === "lg",
          }
        )} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-2 border-primary/80 border-r-2 border-foreground",
        {
          "h-4 w-4 border-2": size === "sm",
          "h-8 w-8 border-2": size === "md",
          "h-12 w-12 border-3": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
