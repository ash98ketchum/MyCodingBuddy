import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export default function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass border border-red-500/20 hover:border-red-500/40 transition-colors duration-300",
        "rounded-xl p-6",
        className,
      )}
      {...props}
    />
  );
}
