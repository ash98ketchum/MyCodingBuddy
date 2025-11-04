import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Problems from "@/pages/Problems";
import ProblemDetail from "@/pages/ProblemDetail";
import UserDashboard from "@/pages/UserDashboard";
import Placeholder from "@/pages/Placeholder";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="problems" element={<Problems />} />
              <Route path="problems/:problemName" element={<ProblemDetail />} />
              <Route element={<ProtectedRoute />}>
                <Route path="u/:username" element={<UserDashboard />} />
              </Route>
              <Route path="contest" element={<Placeholder title="Contests (Coming Soon)" />} />
              <Route path="discuss" element={<Placeholder title="Discuss (Coming Soon)" />} />
              <Route path="support" element={<Placeholder title="Support (Coming Soon)" />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
const KEY = "__MYCODINGBUDDY_ROOT__" as const;
// Reuse existing root during HMR to avoid duplicate createRoot warnings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const existing = (globalThis as any)[KEY];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const root = existing ?? createRoot(container);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any)[KEY] = root;
root.render(<App />);
