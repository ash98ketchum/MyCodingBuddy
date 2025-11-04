import { motion } from "framer-motion";
import GlassButton from "./GlassButton";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      <div className="container relative z-10 mx-auto py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            MyCodingBuddy — Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 drop-shadow-[0_0_12px_rgba(244,63,94,0.5)] animate-breathe">AI-Powered</span> Coding Companion
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl">
            Build mastery with a relentless AI partner. Futuristic UI, precision feedback, and speed that keeps up with your flow.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/login"><GlassButton className="w-full sm:w-auto">Get Started</GlassButton></Link>
            <Link to="/problems"><GlassButton variant="secondary" className="w-full sm:w-auto">Browse Problems</GlassButton></Link>
          </div>
        </motion.div>

        {/* Visual preview mock */}
        <motion.div
          className="mt-16 rounded-2xl border border-white/10 glass p-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-64 md:h-80 w-full rounded-xl bg-gradient-to-br from-black via-red-950/30 to-black relative overflow-hidden">
            <div className="absolute inset-0 animate-diagonal-shimmer opacity-30 bg-[radial-gradient(circle_at_0%_100%,rgba(244,63,94,0.5),transparent_40%)]" />
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-20">
              {Array.from({ length: 72 }).map((_, i) => (
                <div key={i} className="border border-white/10" />
              ))}
            </div>
            <div className="absolute bottom-3 right-3 text-xs text-white/50">Preview</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
