import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Leaf, Menu, X, LogIn, UserPlus, Globe, Brain, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const navItems = isAuthenticated
    ? [{ name: 'Home', path: '/' }]
    : [
        { name: 'Home', path: '/' },
        { name: 'Login', path: '/login', icon: LogIn },
        { name: 'Register', path: '/register', icon: UserPlus },
      ];

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'EP';
  const displayName = user?.name || 'Eco Planner';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-7xl z-50">
      <div className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between transition-all duration-300">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="p-2 bg-primary/10 rounded-lg text-primary flex items-center justify-center"
          >
            <Leaf size={20} className="stroke-[2.5]" />
          </motion.div>
          <span className="font-heading font-bold text-lg md:text-xl tracking-tight text-foreground flex items-center gap-1.5">
            GreenQ <span className="text-primary font-normal text-sm px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">UHI Intelligence</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1 bg-foreground/5 rounded-xl p-1 border border-border">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="relative px-4 py-2 text-sm font-medium transition-colors"
              >
                {isActive(item.path) && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/15 border border-primary/30 rounded-lg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative flex items-center gap-1.5 ${isActive(item.path) ? 'text-primary font-semibold' : 'text-muted hover:text-foreground'}`}>
                  {item.icon && <item.icon size={15} />}
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-4 pl-2 border-l border-border/60">
              <Link to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-heading font-semibold text-[10px] transition-colors group-hover:bg-primary/20">
                  {initials}
                </div>
                <span className="text-xs font-semibold text-muted hover:text-foreground transition-colors">
                  {displayName}
                </span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-xs font-medium cursor-pointer bg-transparent border-none"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Theme Toggler */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border flex items-center justify-center cursor-pointer transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
          </motion.button>
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-foreground/5 text-foreground border border-border flex items-center justify-center cursor-pointer"
          >
            {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600" />}
          </motion.button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors bg-transparent border-none"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 w-full glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-lg"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive(item.path) 
                    ? 'bg-primary/10 border border-primary/20 text-primary font-semibold' 
                    : 'hover:bg-foreground/5 text-muted'
                }`}
              >
                {item.icon ? <item.icon size={18} /> : <Globe size={18} />}
                <span>{item.name}</span>
              </Link>
            ))}

            {isAuthenticated && (
              <div className="border-t border-border/60 pt-3 flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 text-muted"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-heading font-semibold text-xs">
                    {initials}
                  </div>
                  <span className="text-sm font-medium">{displayName}</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer bg-transparent border-none text-left"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
