import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Leaf, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Invalid credentials. Please try again.');
      }

      // Persist token and user via AuthContext
      login(data.token, data.user);
      setLoginSuccess(true);

      // Redirect to dashboard after brief success animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
              {/* API Error Banner */}
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{apiError}</span>
                </motion.div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted pointer-events-none">
                    <Mail size={16} />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@agency.gov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl glass-input outline-none text-sm text-foreground placeholder-muted ${
                      errors.email ? 'border-rose-500/50' : ''
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
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl glass-input outline-none text-sm text-foreground placeholder-muted ${
                      errors.password ? 'border-rose-500/50' : ''
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
                id="login-submit"
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
                <p className="text-muted text-sm font-light mt-1">Redirecting to your dashboard…</p>
              </div>
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
