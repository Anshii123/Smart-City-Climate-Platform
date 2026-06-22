import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Info, Thermometer, ShieldAlert, Trees, Layers } from 'lucide-react';

const HeatMap = () => {
  const [activeLayer, setActiveLayer] = useState('temp');
  const [selectedZone, setSelectedZone] = useState(null);

  // 4x4 Grid cells representing district blocks
  const zones = [
    { id: 1, name: 'North Residential Alpha', temp: 28.5, canopy: 42, vulnerability: 'Low', albedo: 25, population: 3500 },
    { id: 2, name: 'North Residential Beta', temp: 29.1, canopy: 38, vulnerability: 'Low', albedo: 22, population: 4100 },
    { id: 3, name: 'Downtown Commercial Core', temp: 33.8, canopy: 12, vulnerability: 'High', albedo: 10, population: 11500 },
    { id: 4, name: 'CBD Financial Corridor', temp: 34.2, canopy: 8, vulnerability: 'High', albedo: 8, population: 14200 },
    
    { id: 5, name: 'East Maritime Docks', temp: 27.6, canopy: 18, vulnerability: 'Moderate', albedo: 15, population: 2100 },
    { id: 6, name: 'East Gate Commercial', temp: 31.5, canopy: 20, vulnerability: 'Moderate', albedo: 12, population: 8900 },
    { id: 7, name: 'Central Park Green Belt', temp: 26.2, canopy: 85, vulnerability: 'Minimal', albedo: 30, population: 800 },
    { id: 8, name: 'South Industrial Sector A', temp: 35.6, canopy: 5, vulnerability: 'Critical', albedo: 5, population: 6400 },
    
    { id: 9, name: 'South Industrial Sector B', temp: 36.1, canopy: 4, vulnerability: 'Critical', albedo: 4, population: 7800 },
    { id: 10, name: 'South Transit Exchange', temp: 32.9, canopy: 14, vulnerability: 'High', albedo: 14, population: 9200 },
    { id: 11, name: 'West Foothill Suburbs', temp: 28.3, canopy: 48, vulnerability: 'Low', albedo: 24, population: 2900 },
    { id: 12, name: 'West Valley Residential', temp: 29.6, canopy: 35, vulnerability: 'Low', albedo: 20, population: 4800 },
    
    { id: 13, name: 'North West Eco Village', temp: 25.8, canopy: 72, vulnerability: 'Minimal', albedo: 32, population: 1200 },
    { id: 14, name: 'South West Farmland Grid', temp: 27.2, canopy: 55, vulnerability: 'Minimal', albedo: 18, population: 500 },
    { id: 15, name: 'South Residential Gamma', temp: 30.5, canopy: 25, vulnerability: 'Moderate', albedo: 16, population: 6800 },
    { id: 16, name: 'Central Civic Plaza', temp: 32.1, canopy: 15, vulnerability: 'High', albedo: 12, population: 9800 }
  ];

  // Map state to cell color
  const getCellColor = (zone) => {
    if (activeLayer === 'temp') {
      if (zone.temp > 34) return 'bg-rose-600/90 text-rose-100 hover:bg-rose-500';
      if (zone.temp > 32) return 'bg-orange-500/80 text-orange-50 hover:bg-orange-400';
      if (zone.temp > 29) return 'bg-amber-400/80 text-amber-950 hover:bg-amber-300';
      return 'bg-emerald-500/80 text-emerald-50 hover:bg-emerald-400';
    }
    
    if (activeLayer === 'canopy') {
      if (zone.canopy > 60) return 'bg-emerald-700/90 text-emerald-100 hover:bg-emerald-600';
      if (zone.canopy > 35) return 'bg-emerald-500/70 text-emerald-50 hover:bg-emerald-400';
      if (zone.canopy > 15) return 'bg-amber-400/60 text-amber-950 hover:bg-amber-300';
      return 'bg-rose-500/40 text-rose-950 hover:bg-rose-400/40';
    }

    // vulnerability
    if (zone.vulnerability === 'Critical') return 'bg-purple-700/90 text-purple-50 hover:bg-purple-600';
    if (zone.vulnerability === 'High') return 'bg-rose-500/80 text-rose-50 hover:bg-rose-400';
    if (zone.vulnerability === 'Moderate') return 'bg-amber-400/70 text-amber-950 hover:bg-amber-300';
    return 'bg-cyan-500/70 text-cyan-50 hover:bg-cyan-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      
      {/* 1. Filter Control Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-lg text-foreground">Spatial Thermal GIS</h3>
          <p className="text-xs text-muted font-light">Interactive grid simulation mapping micro-thermal vulnerability sensors.</p>
        </div>

        {/* Layer Selector */}
        <div className="flex gap-1.5 p-1 bg-foreground/5 rounded-xl border border-border self-start sm:self-auto">
          <button
            onClick={() => setActiveLayer('temp')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              activeLayer === 'temp' ? 'bg-primary text-primary-foreground' : 'text-muted hover:text-foreground'
            }`}
          >
            <Thermometer size={14} /> Temp
          </button>
          <button
            onClick={() => setActiveLayer('canopy')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              activeLayer === 'canopy' ? 'bg-primary text-primary-foreground' : 'text-muted hover:text-foreground'
            }`}
          >
            <Trees size={14} /> Canopy
          </button>
          <button
            onClick={() => setActiveLayer('vulnerability')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              activeLayer === 'vulnerability' ? 'bg-primary text-primary-foreground' : 'text-muted hover:text-foreground'
            }`}
          >
            <ShieldAlert size={14} /> Exposure
          </button>
        </div>
      </div>

      {/* 2. Interactive Map Grid & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Map Grid Column (Col 8) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-border flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-6 pb-2 border-b border-border/40">
            <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
              <Map size={16} className="text-primary" /> Sector Grid Matrix (4x4 Array)
            </span>
            <span className="text-xs text-muted flex items-center gap-1"><Layers size={12} /> Click cells to audit</span>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-4 gap-3 w-full max-w-md aspect-square">
            {zones.map((zone) => (
              <motion.button
                key={zone.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedZone(zone)}
                className={`rounded-xl flex flex-col items-center justify-center p-3 cursor-pointer text-center transition-all ${
                  selectedZone?.id === zone.id ? 'ring-4 ring-primary border-transparent' : ''
                } ${getCellColor(zone)}`}
              >
                <span className="font-heading font-extrabold text-sm md:text-base">
                  {activeLayer === 'temp' ? `${zone.temp.toFixed(0)}°` : activeLayer === 'canopy' ? `${zone.canopy}%` : zone.vulnerability}
                </span>
                <span className="text-[9px] opacity-75 font-mono mt-1">Z-{zone.id}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Inspector Detail Column (Col 5) */}
        <div className="lg:col-span-5">
          {selectedZone ? (
            <motion.div 
              key={selectedZone.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6 rounded-2xl border border-border space-y-5"
            >
              <div className="border-b border-border/60 pb-3">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-mono">Zone {selectedZone.id} Inspected</span>
                <h4 className="font-heading font-extrabold text-lg text-foreground mt-1">{selectedZone.name}</h4>
              </div>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted text-xs">Surface Temperature</span>
                  <span className="font-semibold font-mono text-foreground">{selectedZone.temp}°C</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted text-xs">Tree Canopy Cover</span>
                  <span className="font-semibold font-mono text-foreground">{selectedZone.canopy}%</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted text-xs">Vulnerability Rating</span>
                  <span className={`font-semibold text-xs px-2.5 py-0.5 rounded-full ${
                    selectedZone.vulnerability === 'Critical' ? 'bg-purple-500/20 text-purple-400' :
                    selectedZone.vulnerability === 'High' ? 'bg-rose-500/20 text-rose-400' :
                    selectedZone.vulnerability === 'Moderate' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>{selectedZone.vulnerability}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted text-xs">Albedo Coeff (Reflect)</span>
                  <span className="font-semibold font-mono text-foreground">{selectedZone.albedo}%</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-muted text-xs">Population Density</span>
                  <span className="font-semibold font-mono text-foreground">{selectedZone.population.toLocaleString()} /km²</span>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-2.5 items-start">
                <Info size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] text-foreground leading-normal">
                  {selectedZone.temp > 33 
                    ? 'Greening priority is critical. High asphalt exposure detected.' 
                    : 'Target cooling zones complete. Recommended maintenance only.'}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-border/80 text-center py-16 text-muted space-y-2.5">
              <Map size={36} className="mx-auto opacity-40 animate-pulse text-primary" />
              <p className="font-heading font-semibold text-foreground text-sm">Audit Inspector Idle</p>
              <p className="text-xs font-light max-w-[240px] mx-auto leading-relaxed">
                Click on any sector cell inside the matrix array to review demographic and climate telemetry.
              </p>
            </div>
          )}
        </div>

      </div>

    </motion.div>
  );
};

export default HeatMap;
