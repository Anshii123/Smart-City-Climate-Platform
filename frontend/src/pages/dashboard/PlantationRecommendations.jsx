import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trees, CheckSquare, Square, Calculator, Sparkles, Droplet, Sun, Trash2 } from 'lucide-react';

const PlantationRecommendations = () => {
  const [selectedSpecies, setSelectedSpecies] = useState([1, 3]); // IDs of pre-selected trees
  const [plantingCount, setPlantingCount] = useState(1500);

  // List of species optimal for urban forestry
  const speciesList = [
    { id: 1, name: 'London Plane (Platanus x acerifolia)', co2: 22, water: 'Medium', canopy: 45, bio: 'High UHI Tolerant', desc: 'Resilient deciduous tree that absorbs heavy pollutants and provides massive dense shade.' },
    { id: 2, name: 'Red Maple (Acer rubrum)', co2: 18, water: 'High', canopy: 35, bio: 'Soil stabilizer', desc: 'Outstanding cooling capacity. Prefers moderate to moist soil profiles.' },
    { id: 3, name: 'Silver Linden (Tilia tomentosa)', co2: 25, water: 'Low', canopy: 40, bio: 'Bee supportive', desc: 'Highly heat tolerant and drought resilient. Reflective leaf underside reflects radiation.' },
    { id: 4, name: 'Ginkgo Biloba (Maidenhair Tree)', co2: 15, water: 'Low', canopy: 30, bio: 'Pest resistant', desc: 'Extremely long-lived urban classic. Tolerant to highly compacted soils.' }
  ];

  const handleToggle = (id) => {
    if (selectedSpecies.includes(id)) {
      setSelectedSpecies(selectedSpecies.filter(sid => sid !== id));
    } else {
      setSelectedSpecies([...selectedSpecies, id]);
    }
  };

  // Calculations
  const averageCo2Offset = selectedSpecies.reduce((acc, currId) => {
    const species = speciesList.find(s => s.id === currId);
    return acc + (species ? species.co2 : 0);
  }, 0) / (selectedSpecies.length || 1);

  const totalCalculatedOffset = (averageCo2Offset * plantingCount * 0.001).toFixed(1); // Tons/year
  const totalWaterRequirement = selectedSpecies.some(id => {
    const s = speciesList.find(sp => sp.id === id);
    return s && s.water === 'High';
  }) ? 'Elevated' : selectedSpecies.some(id => {
    const s = speciesList.find(sp => sp.id === id);
    return s && s.water === 'Medium';
  }) ? 'Moderate' : 'Conserved';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      
      {/* 1. Statistics Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-border">
          <span className="text-[10px] text-muted font-semibold uppercase tracking-wider block">Target Trees Planned</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-heading font-extrabold text-foreground">{plantingCount.toLocaleString()}</span>
            <span className="text-xs text-muted">Saplings</span>
          </div>
          <input 
            type="range"
            min="100"
            max="10000"
            step="100"
            value={plantingCount}
            onChange={(e) => setPlantingCount(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg bg-foreground/10 accent-primary cursor-pointer mt-4"
          />
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border">
          <span className="text-[10px] text-muted font-semibold uppercase tracking-wider block">Est Carbon Sequestration</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-heading font-extrabold text-emerald-500">+{totalCalculatedOffset}</span>
            <span className="text-xs text-muted">Tons CO₂ / year</span>
          </div>
          <p className="text-[10px] text-muted mt-4 flex items-center gap-1.5 font-light">
            <Sparkles size={12} className="text-primary animate-pulse" /> Based on {selectedSpecies.length} chosen species.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border">
          <span className="text-[10px] text-muted font-semibold uppercase tracking-wider block">Irrigation Resources</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-heading font-extrabold text-cyan-500">{totalWaterRequirement}</span>
            <span className="text-xs text-muted">Demand index</span>
          </div>
          <p className="text-[10px] text-muted mt-4 flex items-center gap-1.5 font-light">
            <Droplet size={12} className="text-primary" /> Recycled stormwater index active.
          </p>
        </div>

      </div>

      {/* 2. Species Registry List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Registry checklist (Col 8) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-border space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-1.5">
              <Trees size={20} className="text-primary" /> Optimal Canopy Species Registry
            </h3>
            <span className="text-xs text-muted font-mono">{selectedSpecies.length} Selected</span>
          </div>

          <div className="space-y-4">
            {speciesList.map((species) => {
              const checked = selectedSpecies.includes(species.id);
              return (
                <div 
                  key={species.id}
                  onClick={() => handleToggle(species.id)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                    checked 
                      ? 'bg-primary/5 border-primary/40' 
                      : 'hover:bg-foreground/5 border-border'
                  }`}
                >
                  <button className="text-primary shrink-0 mt-0.5">
                    {checked ? <CheckSquare size={20} className="stroke-[2.5]" /> : <Square size={20} />}
                  </button>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-heading font-semibold text-base text-foreground">{species.name}</h4>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold">
                          {species.co2}kg CO₂/yr
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-full font-bold">
                          Canopy: {species.canopy}m²
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted font-light leading-relaxed">{species.desc}</p>
                    <div className="flex gap-4 text-[10px] text-muted font-medium pt-1">
                      <span>• Eco Value: {species.bio}</span>
                      <span>• Water Demand: {species.water}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plantation Planner calculations helper (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border space-y-4">
            <h4 className="font-heading font-bold text-base text-foreground flex items-center gap-1.5">
              <Calculator size={18} className="text-primary" /> Target Mitigation Output
            </h4>
            <p className="text-xs text-muted font-light leading-relaxed">
              Urban forestry planting campaigns directly cool down concrete corridors through localized evapotranspiration.
            </p>

            <div className="bg-foreground/5 p-4 rounded-xl border border-border space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Total Species Configured</span>
                <span className="font-bold text-foreground">{selectedSpecies.length} / {speciesList.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Avoided Runoff Volume</span>
                <span className="font-bold text-emerald-500">+{((plantingCount * 1.5) / 100).toFixed(0)}k Gallons/yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Target Area Covered</span>
                <span className="font-bold text-foreground">{(selectedSpecies.length * plantingCount * 0.005).toFixed(1)} Hectares</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedSpecies([])}
              className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 text-rose-500 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} /> Clear Selections
            </button>
          </div>
        </div>

      </div>

    </motion.div>
  );
};

export default PlantationRecommendations;
