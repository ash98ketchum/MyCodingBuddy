import GlassCard from "@/components/GlassCard";
import BackgroundTiles from "@/components/BackgroundTiles";
import GlassButton from "@/components/GlassButton";

export default function Login() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center">
      <BackgroundTiles />
      <GlassCard className="relative z-10 w-full max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Welcome back</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <input className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white" type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <input className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white" type="password" placeholder="••••••••" />
          </div>
          <GlassButton className="w-full mt-4">Login</GlassButton>
        </form>
      </GlassCard>
    </section>
  );
}
