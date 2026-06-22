import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Trees, 
  Wind, 
  Activity, 
  MapPin, 
  TrendingDown, 
  Sparkles, 
  Info,
  ArrowRight,
  ShieldAlert,
  BrainCircuit,
  Calculator
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // Simulator State
  const [greenRatio, setGreenRatio] = useState(25); // in %
  const [popDensity, setPopDensity] = useState(4500); // people/km2
  const [albedo, setAlbedo] = useState(15); // in %

  // Simple mock model to calculate predicted temperature & health impact
  // Baseline temperature = 32°C
  // Higher green ratio decreases temperature
  // Higher population density slightly increases UHI intensity
  // Higher albedo (cool roofs) decreases temperature
  const predictedTemp = (34 - (greenRatio * 0.12) + (popDensity * 0.0003) - (albedo * 0.08)).toFixed(1);
  const baselineTemp = 33.5;
  const tempDrop = (baselineTemp - predictedTemp).toFixed(1);
  
  // Health impact index (mortality rate change)
  const healthImpact = Math.max(0, (25 + (predictedTemp - 28) * 4.2)).toFixed(1);

  // Features Data
  const features = [
    {
      icon: Thermometer,
      title: 'Microclimate Thermal Analysis',
      desc: 'Map and monitor local land surface temperatures down to 10m resolutions using thermal satellite integration.',
      color: 'text-rose-500 bg-rose-500/10'
    },
    {
      icon: BrainCircuit,
      title: 'ML Cooling Recommendations',
      desc: 'Generative AI placement models identifying exactly where tree canopies and green roofs yield maximum cooling.',
      color: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      icon: ShieldAlert,
      title: 'Vulnerability Index Profiling',
      desc: 'Cross-reference heat severity with demographic datasets to protect elderly, low-income, and sensitive communities first.',
      color: 'text-amber-500 bg-amber-500/10'
    },
    {
      icon: Calculator,
      title: 'Carbon Sequestration Audit',
      desc: 'Predict annual carbon capture offsets and stormwater runoff reductions based on proposed urban forestry projects.',
      color: 'text-cyan-500 bg-cyan-500/10'
    }
  ];

  // Quick stats metrics
  const stats = [
    { label: 'UHI Intensity (Avg)', value: '+3.8°C', icon: Thermometer, trend: 'High Risk', trendColor: 'text-rose-500' },
    { label: 'Avg Greenness Ratio', value: '24.2%', icon: Trees, trend: 'Deficient', trendColor: 'text-amber-500' },
    { label: 'Air Quality (AQI)', value: '142', icon: Wind, trend: 'Unhealthy', trendColor: 'text-rose-500' },
    { label: 'Vulnerable Population', value: '184k', icon: Activity, trend: 'High Exposure', trendColor: 'text-rose-500' },
  ];

  return (
    <div className="space-y-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative text-center py-12 md:py-20 space-y-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs md:text-sm text-primary font-semibold border border-primary/20"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>Next-Gen Climate-Tech Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading font-extrabold text-4xl md:text-6xl tracking-tight leading-[1.1] text-foreground"
        >
          Smart City Climate Vulnerability &{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
            Urban Greening Intelligence
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-xl text-muted max-w-2xl mx-auto font-light leading-relaxed"
        >
          Predict, simulate, and mitigate the Urban Heat Island (UHI) effect. Harnessing machine learning to model heat reduction pathways, optimize tree canopies, and design climate-resilient cities.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
          >
            Get Started
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#simulator" 
            className="w-full sm:w-auto px-8 py-4 glass-panel border border-border hover:bg-foreground/5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            Launch UHI Simulator
          </a>
        </motion.div>
      </section>

      {/* 2. REAL-TIME VULNERABILITY METRICS (MOCKED DASHBOARD) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">Real-time City Vulnerabilities</h2>
            <p className="text-muted text-sm md:text-base font-light">Aggregated climate index indicators for Metropolis Central.</p>
          </div>
          <span className="text-xs text-muted flex items-center gap-1.5 self-start md:self-auto bg-foreground/5 px-3 py-1 rounded-lg border border-border">
            <MapPin size={12} className="text-primary" /> Metropolis Central Region
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full flex items-center justify-end p-2 text-muted group-hover:text-primary transition-colors">
                <stat.icon size={20} />
              </div>
              <p className="text-xs text-muted font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-heading font-extrabold mt-3 text-foreground">{stat.value}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs">
                <span className={`font-semibold ${stat.trendColor}`}>{stat.trend}</span>
                <span className="text-muted">• Live feed</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE SIMULATOR (MOCK MODEL INTERFACE) */}
      <section id="simulator" className="glass-panel p-6 md:p-10 rounded-3xl relative overflow-hidden border border-border">
        {/* Glow overlay */}
        <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Interactive Model
              </span>
              <h3 className="font-heading font-bold text-2xl md:text-3xl mt-3 text-foreground">Urban Canopy Simulator</h3>
              <p className="text-muted text-sm md:text-base font-light mt-1">
                Adjust green space parameters to simulate real-time Urban Heat Island cooling profiles.
              </p>
            </div>

            {/* Slider 1: Green Space Ratio */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Trees size={16} className="text-emerald-500" /> Urban Greenery Ratio
                </span>
                <span className="font-mono text-primary font-bold">{greenRatio}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="75" 
                value={greenRatio}
                onChange={(e) => setGreenRatio(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-foreground/10 accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted font-light">
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
                onChange={(e) => setPopDensity(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-foreground/10 accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted font-light">
                <span>500 (Suburban)</span>
                <span>12k (High-Rise Urban)</span>
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
                onChange={(e) => setAlbedo(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-foreground/10 accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted font-light">
                <span>0% (Asphalt)</span>
                <span>80% (Highly Reflective)</span>
              </div>
            </div>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-7 bg-foreground/5 border border-border/80 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6">
            
            {/* Main Temp Display */}
            <div className="flex items-start justify-between border-b border-border/60 pb-6">
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
                  <TrendingDown size={20} />
                  <span>-{tempDrop}°C</span>
                </div>
              </div>
            </div>

            {/* Simulated Impact Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background/40 border border-border p-4 rounded-xl">
                <span className="text-xs text-muted font-medium">Predicted Mortality Rate Index</span>
                <p className="text-2xl font-bold font-heading mt-1 text-foreground">{healthImpact} <span className="text-xs text-muted">/ 100k</span></p>
                <div className="mt-2 text-xs flex items-center gap-1">
                  <Info size={12} className="text-primary" />
                  <span className="text-muted">Avoided cardiovascular stress</span>
                </div>
              </div>

              <div className="bg-background/40 border border-border p-4 rounded-xl">
                <span className="text-xs text-muted font-medium">Estimated Stormwater Mitigation</span>
                <p className="text-2xl font-bold font-heading mt-1 text-emerald-500">+{((greenRatio * 1.8) + (albedo * 0.4)).toFixed(0)}%</p>
                <div className="mt-2 text-xs flex items-center gap-1">
                  <Info size={12} className="text-primary" />
                  <span className="text-muted">Runoff absorption capacity</span>
                </div>
              </div>
            </div>

            {/* Mitigation Summary Visual Bar */}
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-xs text-muted">
                <span>Cooling Zone Achieved</span>
                <span className="font-semibold text-primary">{tempDrop > 2 ? 'Optimal cooling index' : tempDrop > 0.5 ? 'Moderate cooling index' : 'Needs improvement'}</span>
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
      </section>

      {/* 4. FEATURES GRID */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground">
            Platform Capabilities
          </h2>
          <p className="text-muted font-light leading-relaxed">
            Integrating computational remote sensing with state-of-the-art climate models to deliver actionable greening workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-panel p-8 rounded-2xl relative overflow-hidden group flex flex-col md:flex-row items-start gap-5 hover:border-primary/30 transition-all duration-300"
            >
              <div className={`p-4 rounded-xl flex items-center justify-center shrink-0 ${feat.color}`}>
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
      <footer className="border-t border-border/60 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-muted font-light">
        <p>© 2026 GreenQ Climate Platform. All mock model calculations strictly for demonstration purposes.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
