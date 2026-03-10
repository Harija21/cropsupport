import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, LayoutDashboard, MessageSquare, Image as ImageIcon, CloudSun, Users, LogOut, Menu, X } from "lucide-react";
import { useUser, useLogout } from "@/hooks/use-auth";

export function Layout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useUser();
  const logout = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sprout className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!user && location !== "/" && location !== "/auth") {
    setLocation("/auth");
    return null;
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/ai", label: "AI Advisor", icon: MessageSquare },
    { href: "/disease", label: "Crop Disease", icon: ImageIcon },
    { href: "/weather", label: "Weather", icon: CloudSun },
    { href: "/community", label: "Community", icon: Users },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar for Desktop */}
      {user && (
        <aside className="hidden md:flex flex-col w-72 glass-panel fixed h-screen z-20">
          <div className="p-8 flex items-center gap-3 text-primary">
            <Sprout className="w-8 h-8" />
            <span className="font-display text-2xl tracking-wide">AgriConnect</span>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} className="block">
                  <div className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1' 
                      : 'text-foreground/70 hover:bg-primary/10 hover:text-primary hover:translate-x-1'}
                  `}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 mt-auto">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-4">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.location}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-2xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Header */}
      {user && (
        <header className="md:hidden fixed top-0 w-full z-30 glass-panel px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Sprout className="w-6 h-6" />
            <span className="font-display text-xl">AgriConnect</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="text-foreground p-2 bg-primary/10 rounded-xl">
            <Menu className="w-6 h-6" />
          </button>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-background shadow-2xl p-6 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-muted rounded-xl">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block">
                      <div className={`
                        flex items-center gap-4 px-4 py-4 rounded-2xl transition-all
                        ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-primary/10'}
                      `}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-lg">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-4 mt-auto text-destructive hover:bg-destructive/10 rounded-2xl transition-colors font-medium text-lg"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen ${user ? 'md:ml-72 pt-20 md:pt-0' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full p-4 md:p-8 max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
