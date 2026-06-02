import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";
import AuthPage from "./components/auth/AuthPage";
import { AuthWindow } from "./components/auth/AuthWindow";
import { AdminDashboard } from "./components/portals/AdminDashboard";
import { NGODashboard } from "./components/portals/NGODashboard";
import { ResponderDashboard } from "./components/portals/ResponderDashboard";
import { DemoNavigation, type AppView } from "./components/DemoNavigation";
import { useAuth } from "./context/AuthContext";
import type { SystemRole, UserProfile } from "./api/types";

function roleToView(role: SystemRole): AppView | null {
  switch (role) {
    case "ADMIN":
      return "admin";
    case "NGO":
      return "ngo";
    case "RESPONDER":
      return "responder";
    default:
      return null;
  }
}

export default function App() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>("landing");
  const [authOpen, setAuthOpen] = useState(false);

  const handleNavigate = (view: AppView) => {
    setAuthOpen(false);

    const requiredRole =
      view === "admin" ? "ADMIN" : view === "ngo" ? "NGO" : view === "responder" ? "RESPONDER" : null;

    if (requiredRole && (!user || user.role !== requiredRole)) {
      toast.error(`Sign in with a ${requiredRole} account to open this portal.`);
      setAuthOpen(true);
      return;
    }

    setCurrentView(view);
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setAuthOpen(false);
    const portal = roleToView(profile.role);
    if (portal) {
      setCurrentView(portal);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out.");
      setCurrentView("landing");
    } catch {
      toast.error("Logout failed.");
    }
  };

  if (currentView === "admin") {
    return (
      <>
        <AdminDashboard />
        <DemoNavigation currentView={currentView} onNavigate={handleNavigate} />
      </>
    );
  }

  if (currentView === "ngo") {
    return (
      <>
        <NGODashboard />
        <DemoNavigation currentView={currentView} onNavigate={handleNavigate} />
      </>
    );
  }

  if (currentView === "responder") {
    return (
      <>
        <ResponderDashboard />
        <DemoNavigation currentView={currentView} onNavigate={handleNavigate} />
      </>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12">
        <div className="flex max-w-lg flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-medium tracking-tight text-white">NeXora</h1>
          <p className="text-sm text-white/50">
            Sign in, register, or reset your password. Explore the admin, NGO, and responder portals below.
          </p>
          {!isLoading && isAuthenticated && user && (
            <div className="mt-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100">
              Signed in as <strong>{user.displayName}</strong> ({user.role})
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-400"
            >
              Open Sign In
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Log Out
            </button>
          )}
        </div>

        <div className="grid w-full max-w-md gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => handleNavigate("admin")}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
          >
            Admin Portal
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("ngo")}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
          >
            NGO Portal
          </button>
          <button
            type="button"
            onClick={() => handleNavigate("responder")}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
          >
            Responder Portal
          </button>
        </div>
      </div>

      <AnimatePresence>
        {authOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-[680px]">
              <AuthWindow onClose={() => setAuthOpen(false)}>
                <AuthPage onSuccess={handleAuthSuccess} />
              </AuthWindow>
            </div>
          </div>
        )}
      </AnimatePresence>

      <DemoNavigation currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}
