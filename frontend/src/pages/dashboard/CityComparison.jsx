import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckSquare, Square, BarChart3, TrendingUp, ShieldAlert, Trees, Thermometer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CityComparison = () => {
  const [predictions, setPredictions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = localStorage.getItem('token') || (user && user.token);

      const response = await fetch('/api/predictions', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      if (json.success) {
        setPredictions(json.data);
      }
    } catch (err) {
      console.warn("Failed to fetch predictions for comparison:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedData = predictions.filter(p => selectedIds.includes(p._id));

  // Recharts custom tooltips
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 border border-border/80 rounded-xl text-xs space-y-1 bg-background/95 shadow-xl">
          <p className="font-bold text-foreground">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color }} className="font-mono">
              {entry.name}: {entry.value.toFixed(1)}
              {entry.name.includes('Temp') ? '°C' : '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-heading font-extrabold text-lg text-foreground flex items-center gap-2">
            <Layers className="text-primary animate-pulse" size={20} />
            District Climate Comparison
          </h3>
          <p className="text-xs text-muted font-light">Select multiple audited predictions to generate comparative side-by-side telemetry charts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Select Panel (Col 4) */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-border space-y-4">
          <div className="border-b border-border/40 pb-2">
            <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5">
              <CheckSquare size={16} className="text-primary" /> Selector Console
            </h4>
            <span className="text-[10px] text-muted font-light block mt-1">Select cities to load into comparison charts below:</span>
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-muted">Loading checklist...</span>
            </div>
          ) : predictions.length === 0 ? (
            <p className="text-xs text-muted font-light text-center py-6">No prediction history records available to compare.</p>
          ) : (
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {predictions.map(p => {
                const isSelected = selectedIds.includes(p._id);
                return (
                  <button
                    key={p._id}
                    onClick={() => handleToggleSelect(p._id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3 text-xs ${
                      isSelected
                        ? 'bg-primary/10 border-primary/40 text-foreground font-semibold'
                        : 'bg-foreground/5 border-border/40 hover:bg-foreground/10 text-muted hover:text-foreground'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare size={16} className="text-primary shrink-0" />
                    ) : (
                      <Square size={16} className="text-muted shrink-0" />
                    )}
                    <div className="truncate flex-1">
                      <span className="block truncate font-bold text-foreground">{p.cityName}</span>
                      <span className="block text-[9px] text-muted font-mono mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Charts Display (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedIds.length < 2 ? (
            <div className="glass-panel p-16 rounded-2xl border border-border text-center flex flex-col items-center justify-center space-y-4 min-h-[400px]">
              <div className="p-4 bg-foreground/5 rounded-2xl text-muted/50 border border-border/30">
                <BarChart3 size={32} />
              </div>
              <h4 className="font-heading font-extrabold text-base text-foreground">Select predictions to compare</h4>
              <p className="text-xs text-muted font-light max-w-sm">
                Check at least two city prediction nodes from the Selector Console on the left to render side-by-side comparative diagnostics.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Heat Risk & Exposure Vulnerability Composed */}
              <div className="glass-panel p-5 rounded-2xl border border-border/40 space-y-4">
                <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border/20 pb-2">
                  <ShieldAlert size={15} className="text-rose-500" /> Risk & Vulnerability
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="cityName" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: 9 }} />
                      <Bar dataKey="heatRiskScore" name="Heat Risk (%)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="heatVulnerabilityScore" name="Vulnerability (%)" fill="#fb923c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. Plantation Priority Comparison */}
              <div className="glass-panel p-5 rounded-2xl border border-border/40 space-y-4">
                <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border/20 pb-2">
                  <Trees size={15} className="text-emerald-500" /> Planting Priority Urgency
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="cityName" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: 9 }} />
                      <Bar dataKey="plantationPriorityScore" name="Plantation Priority (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3. Temperature Comparisons */}
              <div className="glass-panel p-5 rounded-2xl border border-border/40 space-y-4 md:col-span-2">
                <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border/20 pb-2">
                  <Thermometer size={15} className="text-primary" /> Current vs Future Projected Temperature
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="cityName" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} unit="°" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="temperature" name="Current Temp (°C)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="futureTemperature" name="Future Temp (°C)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CityComparison;
