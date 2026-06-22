import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  Map, 
  Trees, 
  Sliders, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Prediction', path: '/dashboard/prediction', icon: TrendingUp },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Heat Map', path: '/dashboard/heatmap', icon: Map },
    { name: 'Plantation Planner', path: '/dashboard/recommendations', icon: Trees },
    { name: 'Climate Simulator', path: '/dashboard/simulator', icon: Sliders },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const activeItem = menuItems.find(item => isActive(item.path));
    return activeItem ? activeItem.name : 'Dashboard';
  };

  return (
    <div className="flex min-h-[100vh] relative z-20 text-foreground">
      
      {/* 1. SIDEBAR (DESKTOP) */}
      <aside 
        className={`hidden md:flex flex-col border-r border-border glass-panel transition-all duration-300 relative sticky top-0 h-[100vh] ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-8 -right-3.5 bg-card border border-border text-foreground hover:text-primary p-1.5 rounded-full shadow-md z-50 cursor-pointer"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Brand/Logo */}
        <div className="p-6 flex items-center justify-between border-b border-border/60">
          <Link to="/" className="flex items-center gap-2 group overflow-hidden">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="p-2 bg-primary/10 rounded-lg text-primary flex items-center justify-center shrink-0"
            >
              <Trees size={20} className="stroke-[2.5]" />
            </motion.div>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-heading font-bold text-lg tracking-tight text-foreground whitespace-nowrap"
              >
                GreenQ <span className="text-primary font-normal text-xs">V2</span>
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all relative ${
                isActive(item.path) 
                  ? 'text-primary font-semibold' 
                  : 'text-muted hover:text-foreground hover:bg-foreground/5'
              }`}
              title={collapsed ? item.name : ''}
            >
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeDashNav"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon size={20} className={`relative z-10 shrink-0 ${isActive(item.path) ? 'text-primary' : 'text-muted'}`} />
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 text-sm whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/60">
          <Link 
            to="/" 
            className="flex items-center gap-3 p-3 rounded-xl text-muted hover:text-foreground hover:bg-foreground/5 transition-all"
            title={collapsed ? 'Back to Landing' : ''}
          >
            <ArrowLeft size={20} className="shrink-0" />
            {!collapsed && <span className="text-sm">Public Portal</span>}
          </Link>
        </div>
      </aside>

      {/* 2. SIDEBAR (MOBILE NAV DRAWER) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border p-6 flex flex-col z-50 md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-6 mb-6">
                <span className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                  <Trees className="text-primary" /> GreenQ Intel
                </span>
                <button onClick={() => setMobileOpen(false)} className="text-muted hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive(item.path) 
                        ? 'bg-primary/10 border border-primary/20 text-primary font-semibold' 
                        : 'hover:bg-foreground/5 text-muted'
                    }`}
                  >
                    <item.icon size={20} className={isActive(item.path) ? 'text-primary' : 'text-muted'} />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="border-t border-border/60 pt-6">
                <Link 
                  to="/" 
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-muted hover:text-foreground hover:bg-foreground/5 transition-all"
                >
                  <ArrowLeft size={20} />
                  <span className="text-sm">Public Portal</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Dashboard Header */}
        <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/60 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2 border border-border rounded-xl md:hidden text-muted hover:text-foreground hover:bg-foreground/5"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-heading font-bold text-lg md:text-xl text-foreground capitalize">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-muted font-light hidden sm:block">
                Jurisdiction: Metropolis Central Region
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active alert indicator */}
            <div className="relative p-2 rounded-xl bg-foreground/5 border border-border text-muted hover:text-foreground cursor-pointer flex items-center justify-center">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-border/60">
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-heading font-semibold text-sm">
                EP
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-foreground">Eco Planner</p>
                <p className="text-[10px] text-muted">Admin Role</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic Pages */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
