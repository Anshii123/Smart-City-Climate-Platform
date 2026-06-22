import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Sun, ShieldCheck, Thermometer, Trees, Sparkles, AlertCircle, DollarSign } from 'lucide-react';

const ClimateSimulator = () => {
  const [coolRoofs, setCoolRoofs] = useState(30); // in %
  const [coolPave, setCoolPave] = useState(20); // in %
  const [parks, setParks] = useState(120); // Hectares
  const [mistSystems, setMistSystems] = useState(false);

  // Advanced calculation models
  // Base Temp drop from parameters
  const roofCooling = coolRoofs * 0.025; // max 2.5°C drop
  const paveCooling = coolPave * 0.015; // max 1.5°C drop
  const parkCooling = (parks / 500) * 3.5; // max 3.5°C drop
  const mistCooling = mistSystems ? 0.8 : 0;

  const totalCooling = (roofCooling + paveCooling + parkCooling + mistCooling).toFixed(2);
  const baselineTemp = 33.8;
  const simulatedTemp = (baselineTemp - totalCooling).toFixed(2);

  // Budget calculations
  const roofBudget = coolRoofs * 120000;
  const paveBudget = coolPave * 180000;
  const parkBudget = parks * 25000;
  const mistBudget = mistSystems ? 450000 : 0;
  const totalBudget = ((roofBudget + paveBudget + parkBudget + mistBudget) * 0.000001).toFixed(2); // Millions

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      
      {/* 1. Simulator Sandbox Setup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Panel (Col 5) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-border space-y-6">
          <div className="border-b border-border/60 pb-3">
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-mono">Mitigation Sandbox</span>
            <h3 className="font-heading font-extrabold text-lg text-foreground mt-1 flex items-center gap-2">
              <Sliders size={20} className="text-primary" /> Parameter Controls
            </h3>
          </div>

          {/* Slider 1: Cool Roofs */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Sun size={14} className="text-amber-500" /> Cool Roof Installations
              </span>
              <span className="font-mono text-primary font-bold">{coolRoofs}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={coolRoofs}
              onChange={(e) => setCoolRoofs(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-foreground/10 accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted font-light">
              <span>0% Coverage</span>
              <span>100% Full retrofits</span>
            </div>
          </div>

          {/* Slider 2: Cool Pavements */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Sliders size={14} className="text-cyan-500" /> High-Albedo Pavements
              </span>
              <span className="font-mono text-primary font-bold">{coolPave}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={coolPave}
              onChange={(e) => setCoolPave(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-foreground/10 accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted font-light">
              <span>0% Reflective</span>
              <span>100% Cool Asphalt</span>
            </div>
          </div>

          {/* Slider 3: Parks/Forestation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Trees size={14} className="text-emerald-500" /> Canopy Parks Added
              </span>
              <span className="font-mono text-primary font-bold">{parks} Hectares</span>
            </div>
            <input 
              type="range"
              min="0"
              max="500"
              step="10"
              value={parks}
              onChange={(e) => setParks(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-foreground/10 accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted font-light">
              <span>0 Ha</span>
              <span>500 Hectares</span>
            </div>
          </div>

          {/* Active Switch: Misting */}
          <div className="flex items-center justify-between p-3.5 bg-foreground/5 border border-border rounded-xl">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Sparkles size={14} className="text-cyan-400" /> Smart Evaporative Misting
              </span>
              <p className="text-[10px] text-muted">Toggle local cooling water nozzles.</p>
            </div>
            <button
              onClick={() => setMistSystems(!mistSystems)}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                mistSystems ? 'bg-primary justify-end' : 'bg-foreground/20 justify-start'
              }`}
            >
              <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>
        </div>

        {/* Results Screen Column (Col 7) */}
        <div className="lg:col-span-7 bg-foreground/5 border border-border rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6">
          
          <div className="flex items-start justify-between border-b border-border/60 pb-6">
            <div>
              <p className="text-xs text-muted uppercase font-semibold tracking-wider">Simulated Temperature</p>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                  {simulatedTemp}°C
                </span>
                <span className="text-xs text-muted">vs {baselineTemp}°C baseline</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted font-medium">Temperature Reduction</span>
              <div className="flex items-center gap-1 text-emerald-500 font-bold text-lg md:text-xl mt-1.5">
                <Thermometer size={20} className="animate-pulse" />
                <span>-{totalCooling}°C</span>
              </div>
            </div>
          </div>

          {/* Graphical temperature bars side-by-side comparison */}
          <div className="space-y-4">
            <span className="text-xs text-muted font-semibold uppercase block">Thermal Profile Comparison</span>
            
            <div className="space-y-3">
              {/* Baseline Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-muted">
                  <span>Baseline Central</span>
                  <span>{baselineTemp}°C</span>
                </div>
                <div className="w-full h-4 bg-foreground/10 rounded-lg overflow-hidden">
                  <div className="h-full bg-rose-500/80 rounded-lg" style={{ width: '92%' }} />
                </div>
              </div>

              {/* Simulated Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-primary">
                  <span>Simulated Mitigation Target</span>
                  <span>{simulatedTemp}°C</span>
                </div>
                <div className="w-full h-4 bg-foreground/10 rounded-lg overflow-hidden">
                  <motion.div 
                    key={simulatedTemp}
                    initial={{ width: '0%' }}
                    animate={{ width: `${(simulatedTemp / baselineTemp) * 92}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Estimate Indicator */}
          <div className="border-t border-border/60 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary mt-0.5">
                <DollarSign size={18} />
              </div>
              <div>
                <span className="text-[10px] text-muted font-semibold block uppercase">Simulated Budget Cost</span>
                <span className="text-xl font-heading font-extrabold text-foreground">${totalBudget}M <span className="text-xs text-muted font-normal">Est</span></span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted">
              <AlertCircle size={14} className="text-primary" />
              <span>Federal infrastructure grants available</span>
            </div>
          </div>

        </div>

      </div>

    </motion.div>
  );
};

export default ClimateSimulator;
