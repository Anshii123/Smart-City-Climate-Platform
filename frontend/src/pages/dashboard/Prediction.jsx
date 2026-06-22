import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, HelpCircle, AlertTriangle, Sparkles, Brain } from 'lucide-react';

const Prediction = () => {
  const [scenario, setScenario] = useState('ssp245');

  // Scenario specific projections
  const projectionDetails = {
    ssp126: {
      name: 'SSP1-2.6: Sustainability (Green Path)',
      desc: 'Optimistic scenario focusing on rapid carbon reductions, intense urban forestry planting, and building-level cooling mandates.',
      uhi2030: '+2.8°C',
      uhi2050: '+1.6°C',
      canopy2050: '42.0%',
      tempClass: 'text-emerald-500',
      points: [60, 48, 38, 30, 24, 20] // temperatures for drawing line
    },
    ssp245: {
      name: 'SSP2-4.5: Middle of the Road',
      desc: 'Moderate projection following current decadal emissions and municipal urban greening targets.',
      uhi2030: '+3.4°C',
      uhi2050: '+2.9°C',
      canopy2050: '31.5%',
      tempClass: 'text-amber-500',
      points: [60, 56, 52, 48, 44, 42]
    },
    ssp585: {
      name: 'SSP5-8.5: Fossil-fueled Development',
      desc: 'Extreme scenario with minimal regulatory intervention, high fossil-fuel development, and rapid deforestation/concrete expansions.',
      uhi2030: '+4.2°C',
      uhi2050: '+5.6°C',
      canopy2050: '14.8%',
      tempClass: 'text-rose-500',
      points: [60, 68, 76, 84, 90, 96]
    }
  };

  const selectedProj = projectionDetails[scenario];

  // Years for X-axis in SVG chart
  const timelineYears = ['2026', '2030', '2035', '2040', '2045', '2050'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      
      {/* 1. Header Control Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-lg text-foreground">Climate Timeline Forecaster</h3>
          <p className="text-xs text-muted font-light">Select an IPCC climate pathway to simulate Metropolis central trends.</p>
        </div>

        <div className="flex gap-2">
          {Object.keys(projectionDetails).map((key) => (
            <button
              key={key}
              onClick={() => setScenario(key)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                scenario === key 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-foreground/5 text-muted hover:text-foreground'
              }`}
            >
              {key === 'ssp126' ? 'Green Path' : key === 'ssp245' ? 'Middle Path' : 'Fossil Path'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Visual Chart Column & Scenario Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SVG Timeline Chart (Col 8) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/40">
            <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
              <TrendingUp size={16} className="text-primary" /> Projected UHI Intensity Trend (°C)
            </span>
            <span className="text-xs text-muted font-mono">{selectedProj.name}</span>
          </div>

          {/* Inline SVG Chart */}
          <div className="relative w-full h-64 border-l border-b border-border/60 pb-2 pl-4">
            
            {/* Grid Lines */}
            <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-t border-foreground w-full" />
              <div className="border-t border-foreground w-full" />
              <div className="border-t border-foreground w-full" />
              <div className="border-t border-foreground w-full" />
            </div>

            {/* SVG Path */}
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gradient-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              
              {/* Interpolated Graph Line */}
              <motion.path
                key={scenario}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                d={`M 10 ${200 - selectedProj.points[0] * 1.8} 
                   L 100 ${200 - selectedProj.points[1] * 1.8} 
                   L 190 ${200 - selectedProj.points[2] * 1.8} 
                   L 280 ${200 - selectedProj.points[3] * 1.8} 
                   L 370 ${200 - selectedProj.points[4] * 1.8} 
                   L 460 ${200 - selectedProj.points[5] * 1.8}`}
                fill="none"
                stroke="url(#gradient-line)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Data Node Dots */}
              {selectedProj.points.map((pt, i) => (
                <circle
                  key={i}
                  cx={10 + i * 90}
                  cy={200 - pt * 1.8}
                  r="5"
                  className="fill-background stroke-primary stroke-[3]"
                />
              ))}
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between text-[10px] text-muted font-mono mt-4">
              {timelineYears.map(year => (
                <span key={year}>{year}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Forecast Target summaries (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border">
            <h4 className="font-heading font-bold text-base text-foreground mb-4">Path Summary</h4>
            <p className="text-xs font-light text-muted leading-relaxed mb-6">{selectedProj.desc}</p>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-border/40 pb-2.5">
                <span className="text-xs text-muted">Predicted UHI (2030)</span>
                <span className="font-mono font-bold text-sm text-foreground">{selectedProj.uhi2030}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2.5">
                <span className="text-xs text-muted">Predicted UHI (2050)</span>
                <span className={`font-mono font-bold text-sm ${selectedProj.tempClass}`}>{selectedProj.uhi2050}</span>
              </div>
              <div className="flex justify-between pb-2.5">
                <span className="text-xs text-muted">Forestry Canopy target</span>
                <span className="font-mono font-bold text-sm text-primary">{selectedProj.canopy2050}</span>
              </div>
            </div>
          </div>

          {/* Model info card */}
          <div className="glass-panel p-6 rounded-2xl border border-border flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Brain size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-sm text-foreground">Model Verification</h4>
              <p className="text-[10px] text-muted leading-relaxed">
                Platform forecasts compile random forests and geospatial satellite arrays.
              </p>
              <div className="flex gap-3 text-[9px] font-mono text-primary font-bold mt-2">
                <span>R²: 0.94</span>
                <span>RMSE: 0.24°C</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
};

export default Prediction;
