import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Leaf, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please provide a valid email';
    }
    
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate API request to backend
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);
      
      // Save simulated user details to localStorage
      localStorage.setItem('user', JSON.stringify({ email, role: 'Urban Planner' }));

      // Redirect back to LandingPage after showing success state
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] relative z-10 px-4">
      {/* Visual glowing aura behind card */}
      <div className="absolute w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel rounded-3xl p-8 relative border border-border"
      >
        <div className="text-center space-y-3 mb-8">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto border border-primary/20"
          >
            <Leaf size={24} className="stroke-[2.5]" />
          </motion.div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground">Welcome Back</h2>
          <p className="text-muted text-sm font-light">Access your urban greening analytics portal.</p>
        </div>

        <AnimatePresence mode="wait">
          {!loginSuccess ? (
            <motion.form 
              key="login-form"
              onSubmit={handleSubmit} 
              className="space-y-5"
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted pointer-events-none">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="name@agency.gov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl glass-input outline-none text-sm text-foreground placeholder-muted ${
                      errors.email ? 'border-rose-500/50 focus:border-rose-500/70 focus:shadow-rose-500/10' : ''
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-xs flex items-center gap-1.5 mt-1 font-medium">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot?</a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl glass-input outline-none text-sm text-foreground placeholder-muted ${
                      errors.password ? 'border-rose-500/50 focus:border-rose-500/70 focus:shadow-rose-500/10' : ''
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-rose-500 text-xs flex items-center gap-1.5 mt-1 font-medium">
                    <AlertCircle size={12} /> {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/10 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-8"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div 
              key="success-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck size={36} className="animate-bounce" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground">Authentication Success</h3>
                <p className="text-muted text-sm font-light mt-1">Initializing secure sandbox environment...</p>
              </div>
              <p className="text-xs text-primary font-mono bg-primary/10 border border-primary/20 py-1.5 px-3 rounded-lg inline-block">
                Token: {email.split('@')[0]}@metropolis.gov
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="text-sm text-muted font-light">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Register agency profile
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
