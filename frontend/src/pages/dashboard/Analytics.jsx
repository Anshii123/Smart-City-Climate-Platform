import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Info, Download, Filter, Percent, Compass } from 'lucide-react';

const Analytics = () => {
  const [xAxis, setXAxis] = useState('ndvi');
  const [yAxis, setYAxis] = useState('temp');

  // Simulated scatter points mapping
  // We represent them as coordinates in a 500x200 grid
  // ndvi vs temp: negative correlation (higher ndvi = lower temp)
  const ndviVsTemp = [
    { name: 'District A', x: 80, y: 150 },
    { name: 'District B', x: 140, y: 130 },
    { name: 'District C', x: 200, y: 110 },
    { name: 'District D', x: 260, y: 90 },
    { name: 'District E', x: 320, y: 70 },
    { name: 'District F', x: 420, y: 40 },
  ];

  // albedo vs temp: negative correlation
  const albedoVsTemp = [
    { name: 'District A', x: 100, y: 140 },
    { name: 'District B', x: 180, y: 120 },
    { name: 'District C', x: 240, y: 95 },
    { name: 'District D', x: 310, y: 80 },
    { name: 'District E', x: 390, y: 65 },
    { name: 'District F', x: 450, y: 50 },
  ];

  const getPoints = () => {
    if (xAxis === 'ndvi' && yAxis === 'temp') return ndviVsTemp;
    return albedoVsTemp;
  };

  const currentPoints = getPoints();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      
      {/* 1. Header Filter Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-lg text-foreground">Correlation Analytics</h3>
          <p className="text-xs text-muted font-light">Cross-reference urban infrastructure variables with local warming values.</p>
        </div>

        {/* X and Y selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">X-Axis</span>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs outline-none cursor-pointer"
            >
              <option value="ndvi">Greenness Index (NDVI)</option>
              <option value="albedo">Cool Roof Index (Albedo)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Y-Axis</span>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs outline-none cursor-pointer"
            >
              <option value="temp">UHI Temperature (°C)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Graph Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Scatter Plot Card */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-border">
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
              <BarChart3 size={16} className="text-primary" /> Scatter Distribution Map
            </span>
            
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-xs font-semibold text-foreground transition-all">
              <Download size={13} /> Export CSV
            </button>
          </div>

          {/* Interactive Scatter Grid */}
          <div className="relative w-full h-80 border-l border-b border-border/60 pl-6 pb-6 select-none">
            {/* Y axis indicator */}
            <div className="absolute left-[-45px] top-1/2 transform -translate-y-1/2 -rotate-90 text-[10px] text-muted font-semibold uppercase tracking-wider">
              {yAxis === 'temp' ? 'Temperature (°C)' : yAxis}
            </div>

            {/* X axis indicator */}
            <div className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 text-[10px] text-muted font-semibold uppercase tracking-wider">
              {xAxis === 'ndvi' ? 'Vegetation Index (NDVI)' : 'Cool Roof Coverage (%)'}
            </div>

            {/* Scatter SVG */}
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Reference correlation line */}
              <line 
                x1="40" 
                y1="170" 
                x2="480" 
                y2="30" 
                stroke="rgba(16, 185, 129, 0.15)" 
                strokeWidth="2" 
                strokeDasharray="4"
              />

              {/* Scatter Points */}
              {currentPoints.map((pt, i) => (
                <g key={pt.name}>
                  {/* Outer animated halo ring */}
                  <motion.circle
                    key={`${xAxis}-${i}`}
                    initial={{ r: 0, opacity: 0 }}
                    animate={{ r: 12, opacity: 0.3 }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    cx={pt.x}
                    cy={pt.y}
                    className="fill-primary/20 stroke-primary/30"
                  />
                  {/* Central Node point */}
                  <motion.circle
                    key={`${xAxis}-${i}-center`}
                    initial={{ r: 0 }}
                    animate={{ r: 5 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    cx={pt.x}
                    cy={pt.y}
                    className="fill-primary stroke-background stroke-[2]"
                  />
                  {/* Text labels for node */}
                  <text
                    x={pt.x + 10}
                    y={pt.y + 4}
                    className="fill-muted font-sans font-medium text-[9px]"
                  >
                    {pt.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Analytics Insights summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border space-y-4">
            <h4 className="font-heading font-bold text-base text-foreground flex items-center gap-1.5">
              <Compass size={18} className="text-primary" /> Key Correlation Findings
            </h4>
            <p className="text-xs text-muted font-light leading-relaxed">
              Based on spatial mapping, there is a strong **negative linear correlation** (r = -0.84) between canopy cover and surface temperature.
            </p>
            
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-3">
              <Info size={20} className="text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-foreground leading-normal">
                Every **10% increase** in tree canopy cover is associated with a predicted **0.8°C decrease** in localized UHI intensity.
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-border space-y-4">
            <h4 className="font-heading font-bold text-sm text-foreground">Statistical Matrix</h4>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-foreground/5 rounded-xl border border-border">
                <span className="text-[10px] text-muted font-semibold block uppercase">Pearson (r)</span>
                <span className="text-lg font-heading font-bold text-rose-500 mt-1 block">-0.84</span>
              </div>
              <div className="p-3 bg-foreground/5 rounded-xl border border-border">
                <span className="text-[10px] text-muted font-semibold block uppercase">R-Squared</span>
                <span className="text-lg font-heading font-bold text-primary mt-1 block">70.6%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
};

export default Analytics;
