import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export default function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(spanRef, { amount: 0.4, once: true });

  useEffect(() => {
    if (!isInView || !spanRef.current) return;
    const node = spanRef.current;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => {
        node.textContent = Math.floor(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={spanRef} className={className} />;
}
