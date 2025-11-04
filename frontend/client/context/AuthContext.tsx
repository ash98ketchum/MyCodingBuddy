import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type User = { name: string; avatar: string } | null;

type AuthCtx = {
  user: User;
  signInRandom: () => void;
  signOut: () => void;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

const NAMES = [
  "Anirudh",
  "NovaCoder",
  "RedKnight",
  "ByteSmith",
  "AlgoAce",
  "ZenDev",
];

function randomUser(): NonNullable<User> {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const seed = `${name}-${Math.floor(Math.random() * 9999)}`;
  const avatar = `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear&radius=50&scale=90`;
  return { name, avatar };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const raw = localStorage.getItem("mcb_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("mcb_user", JSON.stringify(user));
    else localStorage.removeItem("mcb_user");
  }, [user]);

  const value = useMemo<AuthCtx>(() => ({
    user,
    signInRandom: () => setUser(randomUser()),
    signOut: () => setUser(null),
  }), [user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
