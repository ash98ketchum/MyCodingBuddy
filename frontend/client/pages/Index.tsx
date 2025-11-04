import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import GlassCard from "@/components/GlassCard";
import { fadeUp, stagger } from "@/lib/animations";
import { Cpu, GaugeCircle, Brain, Zap } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function Index() {
  const features = [
    { icon: Brain, title: "AI Mentor", desc: "Guidance and hints tailored to your approach." },
    { icon: Cpu, title: "Smart Dashboard", desc: "Track skills, streaks, and progress at a glance." },
    { icon: GaugeCircle, title: "Real-time Submissions", desc: "Instant verdicts with beautiful feedback." },
    { icon: Zap, title: "Fast & Sleek", desc: "Smooth animations and delightful interactions." },
  ];

  return (
    <div className="relative text-white">
      <Hero />

      {/* Feature cards */}
      <section className="container mx-auto py-20">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <motion.div key={idx} variants={fadeUp}>
              <GlassCard className="h-full">
                <div className="flex items-start gap-3">
                  <f.icon className="h-6 w-6 text-red-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
                  <div>
                    <h3 className="font-semibold text-lg">{f.title}</h3>
                    <p className="text-white/70 mt-1 text-sm">{f.desc}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="container mx-auto pb-24">
        <div className="glass rounded-2xl border border-white/10 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-extrabold text-red-400"><AnimatedCounter value={10000} /></div>
            <div className="text-white/60 text-sm mt-1">Problems Solved</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-red-400"><AnimatedCounter value={120} /></div>
            <div className="text-white/60 text-sm mt-1">Weekly Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-red-400"><AnimatedCounter value={98} /></div>
            <div className="text-white/60 text-sm mt-1">Uptime %</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-red-400"><AnimatedCounter value={300} /></div>
            <div className="text-white/60 text-sm mt-1">Daily Submissions</div>
          </div>
        </div>
      </section>
    </div>
  );
}
