import { Link, Outlet } from "react-router-dom";
import GlassButton from "./GlassButton";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import BackgroundTiles from "./BackgroundTiles";

export default function Layout() {
  const { user, signInRandom, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-black to-black text-white">
      {/* Global animated grid background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(244,63,94,0.22),transparent_60%)]" />
        <BackgroundTiles className="absolute inset-0 opacity-90" />
      </div>

      <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_20px_rgba(244,63,94,0.45)]" />
            <span className="font-extrabold tracking-tight">MyCodingBuddy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <Link className="hover:text-white transition-colors" to="/problems">Problems</Link>
            <Link className="hover:text-white transition-colors" to="/contest">Contest</Link>
            <Link className="hover:text-white transition-colors" to="/discuss">Discuss</Link>
            <Link className="hover:text-white transition-colors" to="/support">Support</Link>
          </nav>
          <div className="flex items-center gap-2 relative">
            {!user ? (
              <>
                <GlassButton onClick={signInRandom}>Sign in</GlassButton>
                <GlassButton variant="secondary" onClick={signInRandom}>Sign up</GlassButton>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 hover:opacity-90">
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full ring-2 ring-red-500/50" />
                  <span className="hidden sm:block text-white/90 font-medium">{user.name}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 w-44 glass rounded-lg border border-white/10 p-1">
                    <Link to="/u/you" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-white/10">Dashboard</Link>
                    <button onClick={() => { setMenuOpen(false); signOut(); }} className="w-full text-left px-3 py-2 rounded hover:bg-white/10">Sign out</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

      <footer className="z-10 border-t border-white/10 mt-16">
        <div className="container mx-auto py-8 text-center text-white/50 text-sm">
          © {new Date().getFullYear()} MyCodingBuddy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
