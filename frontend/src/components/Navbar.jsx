import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Leaf, Menu, X, LogIn, UserPlus, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Workspace', path: '/dashboard', icon: Globe },
    { name: 'Login', path: '/login', icon: LogIn },
    { name: 'Register', path: '/register', icon: UserPlus },
  ];

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
            className="p-2 rounded-xl bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors"
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
