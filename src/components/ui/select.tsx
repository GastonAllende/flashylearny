"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

function Select({ className, children, placeholder, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  );
}

function SelectItem({ className, children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return (
    <option
      className={cn("text-foreground", className)}
      {...props}
    >
      {children}
    </option>
  );
}

// For compatibility with existing shadcn patterns
const SelectTrigger = Select;
const SelectContent = ({ children }: { children: React.ReactNode; }) => <>{children}</>;
const SelectValue = ({ placeholder }: { placeholder?: string; }) => placeholder || null;
const SelectGroup = ({ children }: { children: React.ReactNode; }) => <>{children}</>;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
};
