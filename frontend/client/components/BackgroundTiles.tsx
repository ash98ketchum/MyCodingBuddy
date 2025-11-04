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

  // continuous progress for smoother motion
  const [progress, setProgress] = useState(0); // 0..maxStep
  const raf = useRef(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const msPerStep = 650; // slower & smoother
    const loop = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = (elapsed / msPerStep) % maxStep; // float progress
      setProgress(p);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [maxStep]);

  const total = cols * rows;
  const startY = rows - 1; // bottom-left
  const trail = 10; // longer tail for smoothness

  // smoothstep helper
  const smooth = (x: number) => x * x * (3 - 2 * x);

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
          let delta = (progress - d + maxStep) % maxStep; // float distance to current ring
          if (delta > trail) delta = trail + 1; // clamp
          const base = Math.max(0, 1 - delta / trail);
          const intensity = smooth(base); // ease

          const borderColor = intensity > 0 ? `rgba(244,63,94,${0.22 + 0.58 * intensity})` : "rgba(255,255,255,0.09)";
          const shadow = intensity > 0 ? `0 0 ${14 + 30 * intensity}px ${1 + 2 * intensity}px rgba(244,63,94,${0.3 + 0.35 * intensity})` : "0 0 0 0 rgba(0,0,0,0)";
          const bg = intensity > 0 ? `rgba(244,63,94,${0.02 + 0.08 * intensity})` : "rgba(255,255,255,0.02)";

          return (
            <div key={i} className="relative">
              {/* square ratio */}
              <div style={{ paddingTop: "100%" }} />
              <div
                className="absolute inset-0"
                style={{
                  border: "1px solid",
                  borderColor,
                  boxShadow: shadow,
                  background: bg,
                  transition: "border-color .5s ease, box-shadow .5s ease, background-color .5s ease",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
