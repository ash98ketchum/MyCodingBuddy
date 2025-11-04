import { useEffect, useRef, useState } from "react";

export default function BackgroundTiles({ className = "" }: { className?: string }) {
  const [dims, setDims] = useState({ w: 1280, h: 720 });
  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cols = 18; // bigger squares
  const rows = Math.max(10, Math.round((cols * dims.h) / dims.w));
  const maxStep = cols + rows - 1;
  const [step, setStep] = useState(0);
  const raf = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    const speed = 380; // ms per step (slower)
    const loop = (t: number) => {
      if (!last.current) last.current = t;
      if (t - last.current >= speed) {
        setStep((s) => (s + 1) % maxStep);
        last.current = t;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [maxStep]);

  const total = cols * rows;
  const startY = rows - 1; // bottom-left
  const trail = 8; // how long the glow lingers

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background:
            "radial-gradient(circle at 12% 88%, rgba(244,63,94,0.16), transparent 60%)",
        }} />
      </div>
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const x = i % cols;
          const y = Math.floor(i / cols);
          // BFS ring distance (moves only up or right from start)
          const d = x + (startY - y);
          const delta = (step - d + maxStep) % maxStep; // 0 = current ring
          const intensity = delta <= trail ? 1 - delta / trail : 0;

          const borderColor = intensity > 0 ? `rgba(244,63,94,${0.25 + 0.55 * intensity})` : "rgba(255,255,255,0.09)";
          const shadow = intensity > 0 ? `0 0 ${16 + 24 * intensity}px ${2 * intensity}px rgba(244,63,94,${0.35 + 0.25 * intensity})` : "0 0 0 0 rgba(0,0,0,0)";
          const bg = intensity > 0 ? `rgba(244,63,94,${0.03 + 0.07 * intensity})` : "rgba(255,255,255,0.02)";

          return (
            <div key={i} className="relative">
              {/* square ratio */}
              <div style={{ paddingTop: "100%" }} />
              <div className="absolute inset-0" style={{ border: "1px solid", borderColor, boxShadow: shadow, background: bg }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
