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
            // Primary gradient button — keeps white text on colored bg intentionally
            "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:brightness-110 shadow-lg":
              variant === "default",
            // Outline: theme-aware glass border
            "border text-t-fg hover:bg-t-hover":
              variant === "outline",
            // Ghost: hover glass effect
            "hover:bg-t-hover text-t-fg":
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
        style={
          variant === "outline"
            ? { borderColor: "var(--t-linei)", ...props.style }
            : props.style
        }
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
