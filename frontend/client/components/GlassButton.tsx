import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const GlassButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", ...props }, ref) => {
    const base = "relative inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold transition-all duration-500 ease-out focus:outline-none focus:ring-2";
    const styles =
      variant === "primary"
        ? "text-white/90 bg-black/40 ring-0 hover:text-white border border-red-500/30 hover:border-red-500/60 shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]"
        : "text-white/80 bg-white/5 hover:text-white border border-white/10 hover:border-white/30";

    return (
      <button ref={ref} className={cn(base, styles, "glow-border", className)} {...props} />
    );
  },
);

export default GlassButton;
