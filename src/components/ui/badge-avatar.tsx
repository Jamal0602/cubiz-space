
"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeAvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  badgeContent: React.ReactNode;
  badgeClassName?: string;
}

const BadgeAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  BadgeAvatarProps
>(({ className, badgeContent, badgeClassName, ...props }, ref) => (
  <div className="relative">
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
    <Badge className={cn("absolute -top-1 left-full min-w-5 -translate-x-4 border-background px-1", badgeClassName)}>
      {badgeContent}
    </Badge>
  </div>
));

BadgeAvatar.displayName = "BadgeAvatar";

export { BadgeAvatar };
