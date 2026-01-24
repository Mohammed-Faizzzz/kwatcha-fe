import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            // Primary neon gradient button
            "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:brightness-110 shadow-lg":
              variant === "default",
            // Outline: semi-transparent glass border
            "border border-white/30 bg-white/5 text-white hover:bg-white/10":
              variant === "outline",
            // Ghost: hover glass effect
            "hover:bg-white/10 text-white":
              variant === "ghost",
            // Link: neon blue text
            "underline-offset-4 hover:underline text-blue-400":
              variant === "link",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
