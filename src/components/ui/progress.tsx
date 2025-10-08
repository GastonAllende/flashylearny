"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

type ProgressColor = "primary" | "green";

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  color?: ProgressColor;
}

function Progress({
  className,
  value,
  color = "primary",
  ...props
}: ProgressProps) {
  const rootColorClass = color === "green" ? "bg-green-200 dark:bg-green-900/30" : "bg-primary/20";
  const indicatorColorClass = color === "green" ? "bg-green-600 dark:bg-green-500" : "bg-primary";
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        rootColorClass,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 transition-all", indicatorColorClass)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
