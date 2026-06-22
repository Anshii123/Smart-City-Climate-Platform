import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';

const LottiePlayer = Lottie.default || Lottie;
import { 
  Thermometer, Trees, Wind, Activity, MapPin, TrendingDown, 
  Sparkles, Info, ArrowRight, ShieldAlert, BrainCircuit, Calculator, Globe, Eye, Compass 
} from 'lucide-react';

// Custom reusable Animated Counter component for premium rolling numbers
const AnimatedCounter = ({ value, duration = 1.2, suffix = '', decimals = 0, prefix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value.toString().replace(/[^0-9.]/g, ''));
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    const totalMiliseconds = duration * 1000;
    const incrementTime = 30;
    const totalSteps = totalMiliseconds / incrementTime;
    const stepIncrement = (end - start) / totalSteps;
    
    let timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="font-mono">
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const LandingPage = () => {
  // Simulator State
  const [greenRatio, setGreenRatio] = useState(25); // in %
  const [popDensity, setPopDensity] = useState(4500); // people/km2
  const [albedo, setAlbedo] = useState(15); // in %
  const [isSimulating, setIsSimulating] = useState(false);
  const [lottieData, setLottieData] = useState(null);

  // Simple mock model calculations
  const predictedTemp = (34 - (greenRatio * 0.12) + (popDensity * 0.0003) - (albedo * 0.08)).toFixed(1);
  const baselineTemp = 33.5;
  const tempDrop = (baselineTemp - predictedTemp).toFixed(1);
  const healthImpact = Math.max(0, (25 + (predictedTemp - 28) * 4.2)).toFixed(1);

  // Trigger loading skeleton on simulator change
  useEffect(() => {
    setIsSimulating(true);
    const timer = setTimeout(() => setIsSimulating(false), 350);
    return () => clearTimeout(timer);
  }, [greenRatio, popDensity, albedo]);

  // Load welcome Lottie animation
  useEffect(() => {
    fetch('/ecology_lottie.json')
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(err => console.warn("Failed to fetch landing lottie animation:", err));
  }, []);

  // Features Data
  const features = [
    {
      icon: Thermometer,
      title: 'Microclimate Thermal Analysis',
      desc: 'Map and monitor local land surface temperatures down to 10m resolutions using thermal satellite integration.',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    },
    {
      icon: BrainCircuit,
      title: 'ML Cooling Recommendations',
      desc: 'Generative AI placement models identifying exactly where tree canopies and green roofs yield maximum cooling.',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: ShieldAlert,
      title: 'Vulnerability Index Profiling',
      desc: 'Cross-reference heat severity with demographic datasets to protect elderly, low-income, and sensitive communities first.',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: Calculator,
      title: 'Carbon Sequestration Audit',
      desc: 'Predict annual carbon capture offsets and stormwater runoff reductions based on proposed urban forestry projects.',
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
    }
  ];

  // Quick stats metrics
  const stats = [
    { label: 'UHI Intensity (Avg)', value: 3.8, suffix: '°C', icon: Thermometer, trend: 'High Risk', trendColor: 'text-rose-500', prefix: '+' },
    { label: 'Avg Greenness Ratio', value: 24.2, suffix: '%', icon: Trees, trend: 'Deficient', trendColor: 'text-amber-500', prefix: '' },
    { label: 'Air Quality (AQI)', value: 142, suffix: '', icon: Wind, trend: 'Unhealthy', trendColor: 'text-rose-500', prefix: '' },
    { label: 'Vulnerable Population', value: 184, suffix: 'k', icon: Activity, trend: 'High Exposure', trendColor: 'text-rose-500', prefix: '' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 14 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
    >
      {/* Background Decorative Mesh Grids */}
      <div className="absolute top-[-10%] left-[-15%] w-[45vw] h-[45vw] rounded-full ambient-glow-emerald pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-15%] w-[45vw] h-[45vw] rounded-full ambient-glow-cyan pointer-events-none z-0" />

      {/* 1. HERO SECTION */}
      <section className="relative text-center py-10 md:py-24 space-y-8 max-w-5xl mx-auto z-10">
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs md:text-sm text-primary font-bold border border-primary/20 hover:bg-primary/5 transition-all shadow-sm"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>Smart City Climate Resiliency Framework V2</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="font-heading font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-tight leading-[1.08] text-foreground"
        >
          Smart City Climate Vulnerability &{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
            Urban Greening Intelligence
          </span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-muted max-w-3xl mx-auto font-light leading-relaxed"
        >
          Predict, simulate, and mitigate the Urban Heat Island (UHI) effect. Harnessing machine learning to model heat reduction pathways, optimize tree canopies, and design climate-resilient cities.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link 
            to="/register" 
            aria-label="Register agency profile to get started"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl font-bold shadow-lg shadow-primary/10 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer hover:translate-y-[-2px]"
          >
            <span>Get Started</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#simulator" 
            aria-label="Scroll down to the interactive UHI simulator sandbox"
            className="w-full sm:w-auto px-8 py-4 glass-panel border border-border hover:bg-foreground/5 text-foreground rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:translate-y-[-2px]"
          >
            <Compass size={18} className="text-primary" />
            <span>Launch UHI Simulator</span>
          </a>
        </motion.div>

        {/* Dynamic welcome Lottie animation container */}
        <AnimatePresence>
          {lottieData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-36 h-36 mx-auto pt-6 flex items-center justify-center"
            >
              <LottiePlayer animationData={lottieData} loop={true} style={{ width: '100%', height: '100%' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 2. REAL-TIME VULNERABILITY METRICS (MOCKED DASHBOARD) */}
      <section className="space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground">Real-time City Vulnerabilities</h2>
            <p className="text-muted text-sm md:text-base font-light">Aggregated climate index indicators for Metropolis Central.</p>
          </div>
          <span className="text-xs text-muted flex items-center gap-1.5 self-start md:self-auto bg-foreground/5 px-3 py-1.5 rounded-xl border border-border">
            <MapPin size={13} className="text-primary" /> Metropolis Central Region
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.015 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-border group transition-all duration-300 shadow-sm"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full flex items-center justify-end p-2.5 text-muted group-hover:text-primary transition-colors">
                <stat.icon size={18} />
              </div>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-heading font-extrabold mt-3 text-foreground flex items-baseline">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} decimals={stat.value % 1 === 0 ? 0 : 1} />
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs">
                <span className={`font-bold ${stat.trendColor}`}>{stat.trend}</span>
                <span className="text-muted/70">• Live feed</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE SIMULATOR (MOCK MODEL INTERFACE) */}
      <section id="simulator" className="relative z-10">
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 md:p-10 rounded-3xl relative overflow-hidden border border-border"
        >
          {/* Inner radial gradient background */}
          <div className="absolute top-[-30%] right-[-10%] w-[380px] h-[380px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            {/* Controls Column */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  Interactive Model
                </span>
                <h3 className="font-heading font-extrabold text-2xl md:text-3xl mt-4 text-foreground">Urban Canopy Simulator</h3>
                <p className="text-muted text-sm md:text-base font-light mt-1.5">
                  Adjust green space parameters to simulate real-time Urban Heat Island cooling profiles.
                </p>
              </div>

              {/* Slider 1: Green Space Ratio */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Trees size={16} className="text-emerald-500 animate-pulse" /> Urban Greenery Ratio
                  </span>
                  <span className="font-mono text-primary font-bold">{greenRatio}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="75" 
                  value={greenRatio}
                  aria-label="Urban Greenery Ratio Percentage Slider"
                  onChange={(e) => setGreenRatio(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-foreground/10 accent-primary cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <div className="flex justify-between text-[10px] text-muted/70 font-light font-mono">
                  <span>5% (Concrete Desert)</span>
                  <span>75% (Forest City)</span>
                </div>
              </div>

              {/* Slider 2: Population Density */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Activity size={16} className="text-rose-500" /> Population Density
                  </span>
                  <span className="font-mono text-primary font-bold">{popDensity.toLocaleString()} people/km²</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="12000" 
                  step="250"
                  value={popDensity}
                  aria-label="Population Density Slider"
                  onChange={(e) => setPopDensity(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-foreground/10 accent-primary cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <div className="flex justify-between text-[10px] text-muted/70 font-light font-mono">
                  <span>500 (Suburban)</span>
                  <span>12k (High-Rise)</span>
                </div>
              </div>

              {/* Slider 3: Roof Albedo (Cool Roofs) */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles size={16} className="text-cyan-500" /> Cool Roof Coverage (Albedo)
                  </span>
                  <span className="font-mono text-primary font-bold">{albedo}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="80" 
                  value={albedo}
                  aria-label="Cool Roof Coverage Albedo Slider"
                  onChange={(e) => setAlbedo(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-foreground/10 accent-primary cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <div className="flex justify-between text-[10px] text-muted/70 font-light font-mono">
                  <span>0% (Asphalt)</span>
                  <span>80% (Reflective)</span>
                </div>
              </div>
            </div>

            {/* Results Output Column */}
            <div className="lg:col-span-7 bg-foreground/5 border border-border rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 relative min-h-[350px]">
              
              {/* Premium Loading Skeleton Overlay during simulation updates */}
              <AnimatePresence>
                {isSimulating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/90 z-20 flex flex-col items-center justify-center p-8 space-y-4 rounded-2xl backdrop-blur-sm"
                  >
                    <div className="w-full space-y-3.5 animate-pulse">
                      <div className="h-6 bg-foreground/10 rounded-lg w-1/3" />
                      <div className="h-10 bg-foreground/10 rounded-lg w-2/3" />
                      <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="h-20 bg-foreground/10 rounded-xl" />
                        <div className="h-20 bg-foreground/10 rounded-xl" />
                      </div>
                      <div className="h-4 bg-foreground/10 rounded-lg w-full pt-4" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Temp Display */}
              <div className="flex items-start justify-between border-b border-border/60 pb-5">
                <div>
                  <p className="text-xs text-muted uppercase font-semibold tracking-wider">Predicted Land Surface Temp</p>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                      {predictedTemp}°C
                    </span>
                    <span className="text-xs text-muted">vs {baselineTemp}°C baseline</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted font-medium">Temperature Reduction</span>
                  <div className="flex items-center gap-1 text-emerald-500 font-bold text-lg md:text-xl mt-1.5">
                    <TrendingDown size={20} className="animate-bounce" />
                    <span>-{tempDrop}°C</span>
                  </div>
                </div>
              </div>

              {/* Simulated Impact Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background/40 border border-border p-4 rounded-xl flex flex-col justify-center">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Predicted Mortality Index</span>
                  <p className="text-2xl font-bold font-heading mt-1 text-foreground">{healthImpact} <span className="text-xs text-muted">/ 100k</span></p>
                  <div className="mt-2 text-[10px] flex items-center gap-1">
                    <Info size={12} className="text-primary shrink-0" />
                    <span className="text-muted/80 leading-none">Avoided heat stress</span>
                  </div>
                </div>

                <div className="bg-background/40 border border-border p-4 rounded-xl flex flex-col justify-center">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Stormwater Absorption</span>
                  <p className="text-2xl font-bold font-heading mt-1 text-emerald-500">+{((greenRatio * 1.8) + (albedo * 0.4)).toFixed(0)}%</p>
                  <div className="mt-2 text-[10px] flex items-center gap-1">
                    <Info size={12} className="text-primary shrink-0" />
                    <span className="text-muted/80 leading-none">Total stormwater runoff capacity</span>
                  </div>
                </div>
              </div>

              {/* Mitigation Summary Visual Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted">
                  <span>Cooling Zone Index Achieved</span>
                  <span className="font-semibold text-primary">{tempDrop > 2 ? 'Optimal Mitigation' : tempDrop > 0.5 ? 'Moderate Offset' : 'Critically Low'}</span>
                </div>
                <div className="w-full h-3 bg-foreground/10 rounded-full overflow-hidden p-0.5 border border-border">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min(100, Math.max(10, (tempDrop / 4.5) * 100))}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. PLATFORM SCHEMATICS & HERO IMAGE MOCKUP */}
      <section className="space-y-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-foreground">
            Platform Capabilities
          </h2>
          <p className="text-muted font-light leading-relaxed text-sm md:text-base">
            Integrating computational remote sensing with state-of-the-art climate models to deliver actionable greening workflows.
          </p>
        </div>

        {/* Hero image styled in browser frame mock container */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.005 }}
          className="rounded-3xl border border-border glass-panel p-2 shadow-2xl relative overflow-hidden max-w-5xl mx-auto group"
        >
          {/* Header bar browser mock */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/40 shrink-0 select-none">
            <span className="w-3 h-3 bg-rose-500/80 rounded-full" />
            <span className="w-3 h-3 bg-amber-400/80 rounded-full" />
            <span className="w-3 h-3 bg-emerald-500/80 rounded-full" />
            <span className="text-[10px] text-muted font-mono ml-4 truncate">https://greenq.metropolis.gov/dashboard</span>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-foreground/5 border border-border/50">
            <img 
              src="/src/assets/hero.png" 
              alt="GreenQ Climate GIS Analytics Platform Dashboard Preview Illustration"
              className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-700" 
            />
            {/* Visual ambient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-md border border-border rounded-xl p-4 max-w-xs flex gap-2 items-start shadow-lg">
              <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-foreground leading-normal font-light">
                Secure enterprise workspace sandbox. Incorporates Multi-Sensor GIS, Random Forest Predictions, and Climate Impact Simulators.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Grid features layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={feat.title}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.015 }}
              className="glass-panel p-8 rounded-2xl border border-border relative overflow-hidden group flex flex-col md:flex-row items-start gap-5 hover:border-primary/40 transition-all duration-300 shadow-sm"
            >
              <div className={`p-4 rounded-xl flex items-center justify-center shrink-0 border ${feat.color}`}>
                <feat.icon size={26} className="stroke-[1.8]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
                  {feat.title}
                </h3>
                <p className="text-muted text-sm md:text-base font-light leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-border/60 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-muted font-light relative z-10">
        <p>© 2026 GreenQ Climate Platform. All mock model calculations strictly for demonstration purposes.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors font-medium">Documentation</a>
          <a href="#" className="hover:text-foreground transition-colors font-medium">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors font-medium">Terms of Service</a>
        </div>
      </footer>

    </motion.div>
  );
};

export default LandingPage;
