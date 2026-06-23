import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, Trees, Sun, HeartPulse, ArrowUpRight, ArrowDownRight, Clock, Building2, ShieldAlert,
  Trash2, Eye, History, X, Sparkles
} from 'lucide-react';

// Custom Animated Counter component for rolling metric numbers
const AnimatedCounter = ({ value, duration = 1.0, suffix = '', decimals = 0, prefix = '' }) => {
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

const DashboardHome = () => {
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = localStorage.getItem('token') || (user && user.token);

      const response = await fetch('/api/predictions', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          setHistory(json.data);
        }
      }
    } catch (err) {
      console.warn("Failed to load predictions history in DashboardHome:", err.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this prediction?")) return;
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = localStorage.getItem('token') || (user && user.token);

      const response = await fetch(`/api/predictions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        setHistory(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete prediction:", err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all prediction history?")) return;
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = localStorage.getItem('token') || (user && user.token);

      for (const item of history) {
        await fetch(`/api/predictions/${item._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
      }
      setHistory([]);
    } catch (err) {
      console.error("Failed to clear all predictions:", err);
    }
  };

  // KPI Metrics Data
  const kpis = [
    { 
      label: 'Avg Surface Temp', 
      value: 31.4,
      suffix: '°C',
      change: '+1.2°C vs decadal avg', 
      trend: 'up', 
      icon: Thermometer, 
      color: 'border-rose-500/30 text-rose-500 bg-rose-500/5' 
    },
    { 
      label: 'Greenness Ratio (NDVI)', 
      value: 24.2,
      suffix: '%',
      change: '+0.8% this quarter', 
      trend: 'up', 
      icon: Trees, 
      color: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' 
    },
    { 
      label: 'Urban Heat Island Offset', 
      value: 0.7,
      prefix: '-',
      suffix: '°C',
      change: 'Due to canopy planting', 
      trend: 'down', 
      icon: Sun, 
      color: 'border-cyan-500/30 text-cyan-500 bg-cyan-500/5' 
    },
    { 
      label: 'Heat Vulnerability Index', 
      value: 6.8,
      suffix: ' / 10',
      change: 'High-risk populations exposure', 
      trend: 'neutral', 
      icon: HeartPulse, 
      color: 'border-amber-500/30 text-amber-500 bg-amber-500/5' 
    }
  ];

  // District Climate Profile data
  const districts = [
    { name: 'Industrial Hub East', temp: '34.8°C', greenPct: '11.4%', population: '8,400/km²', status: 'Critical', statusColor: 'bg-rose-500/20 text-rose-500' },
    { name: 'Metropolis Core (CBD)', temp: '33.2°C', greenPct: '16.8%', population: '11,200/km²', status: 'High', statusColor: 'bg-amber-500/20 text-amber-500' },
    { name: 'North Residential', temp: '29.7°C', greenPct: '32.1%', population: '4,500/km²', status: 'Moderate', statusColor: 'bg-emerald-500/20 text-emerald-500' },
    { name: 'Coastal Marina West', temp: '28.1°C', greenPct: '28.9%', population: '3,200/km²', status: 'Optimal', statusColor: 'bg-cyan-500/20 text-cyan-500' }
  ];

  // System warning logs
  const alerts = [
    { title: 'Thermal Spike Warning', location: 'Industrial District Sector 4', time: '12 mins ago', severity: 'Critical', color: 'text-rose-500 border-rose-500/20 bg-rose-500/5' },
    { title: 'Canopy Density Deficit', location: 'Metropolis Core West Corridor', time: '2 hours ago', severity: 'Warning', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5' },
    { title: 'Cooling Target Complete', location: 'Green Spores Park Canopy Expansion', time: '1 day ago', severity: 'Info', color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* 1. KPI CARDS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.015 }}
            className="glass-panel border border-border p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs text-muted uppercase font-semibold tracking-wider">{kpi.label}</span>
              <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${kpi.color}`}>
                <kpi.icon size={18} />
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-3xl font-heading font-extrabold text-foreground flex items-baseline">
                <AnimatedCounter value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} decimals={kpi.value % 1 === 0 ? 0 : 1} />
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs">
                {kpi.trend === 'up' && <ArrowUpRight size={14} className="text-rose-500 shrink-0" />}
                {kpi.trend === 'down' && <ArrowDownRight size={14} className="text-emerald-500 shrink-0" />}
                <span className={kpi.trend === 'up' ? 'text-rose-500 font-semibold' : kpi.trend === 'down' ? 'text-emerald-500 font-semibold' : 'text-muted'}>
                  {kpi.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. REGIONAL METRICS GRID & ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* District list (Col Span 2) */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-border"
        >
          <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-foreground">District Climate Vulnerability</h3>
              <p className="text-xs text-muted font-light">Breakdown of active localized urban microclimates.</p>
            </div>
            <button className="text-xs text-primary font-bold hover:underline cursor-pointer">View All Districts</button>
          </div>

          {/* Table Container with scroll support and ARIA markup */}
          <div className="overflow-x-auto" tabIndex={0} aria-label="District Climate Telemetry Table">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-muted uppercase border-b border-border/40 pb-2">
                  <th className="pb-3 font-semibold">District Name</th>
                  <th className="pb-3 font-semibold">Temperature</th>
                  <th className="pb-3 font-semibold">Canopy %</th>
                  <th className="pb-3 font-semibold">UHI Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {districts.map((district) => (
                  <tr key={district.name} className="hover:bg-foreground/5 transition-colors group">
                    <td className="py-4 font-semibold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                      <Building2 size={16} className="text-muted shrink-0" />
                      {district.name}
                    </td>
                    <td className="py-4 font-mono font-semibold">{district.temp}</td>
                    <td className="py-4 font-mono">{district.greenPct}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${district.statusColor}`}>
                        {district.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* System Warnings/Alert Log (Col Span 1) */}
        <motion.div 
          variants={itemVariants} 
          className="glass-panel p-6 rounded-2xl border border-border flex flex-col justify-between h-full"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <h3 className="font-heading font-extrabold text-lg text-foreground">Warning Operations</h3>
              <Clock size={16} className="text-muted" />
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.title} 
                  className={`p-4 rounded-xl border flex gap-3 items-start hover:scale-[1.01] transition-transform duration-200 ${alert.color}`}
                >
                  <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-tight">{alert.title}</p>
                    <p className="text-xs opacity-80">{alert.location}</p>
                    <span className="text-[10px] opacity-60 block mt-1 font-mono">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-6 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold rounded-xl text-sm transition-all border border-border cursor-pointer">
            Clear Active Logs
          </button>
        </motion.div>

      </div>

      {/* 3. PREDICTION HISTORY SECTION */}
      <motion.div 
        variants={itemVariants} 
        className="glass-panel p-6 rounded-2xl border border-border w-full space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-foreground flex items-center gap-2">
              <History size={18} className="text-primary" /> Climate Assessment History
            </h3>
            <p className="text-xs text-muted font-light">Saved predictions from the Climate Assessment predictive models.</p>
          </div>
          {history.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="text-xs text-rose-500 font-bold hover:underline cursor-pointer bg-transparent border-none"
            >
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-foreground/5 rounded-xl text-muted/60 border border-border/30">
              <History size={24} />
            </div>
            <p className="text-xs text-muted font-light max-w-sm">
              No saved predictions. Run a new prediction in the <Link to="/climate-assessment" className="text-primary hover:underline font-semibold">Climate Assessment</Link> page to save.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" tabIndex={0} aria-label="Climate Assessment History Table">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-muted uppercase border-b border-border/40 pb-2">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Heat Risk</th>
                  <th className="pb-3 font-semibold">Vulnerability</th>
                  <th className="pb-3 font-semibold">Planting Priority</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-foreground/5 transition-colors group">
                    <td className="py-4 font-mono text-[11px] text-muted">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="py-4 font-semibold text-foreground">{item.cityName}</td>
                    <td className="py-4">
                      <span className={`font-mono font-bold ${
                        item.heatRiskScore >= 85 ? 'text-rose-500' :
                        item.heatRiskScore >= 60 ? 'text-orange-500' :
                        item.heatRiskScore >= 30 ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {item.heatRiskScore}%
                      </span>
                    </td>
                    <td className="py-4 font-mono font-semibold">{item.heatVulnerabilityScore}%</td>
                    <td className="py-4 font-mono">{item.plantationPriorityScore}%</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-foreground/5 hover:bg-primary/20 text-muted hover:text-primary border border-border/40 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-foreground/5 hover:bg-rose-500/20 text-muted hover:text-rose-500 border border-border/40 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* 4. DETAILS POPUP MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel border border-border w-full max-w-2xl rounded-3xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-muted hover:text-foreground border border-border/40 cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="space-y-6">
                {/* Header */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    Saved Assessment Details
                  </span>
                  <h3 className="text-xl font-heading font-extrabold text-foreground mt-2 flex items-center gap-1.5">
                    <Sparkles size={18} className="text-primary" /> {selectedItem.cityName} Results
                  </h3>
                  <p className="text-[11px] text-muted font-mono mt-1">Saved on {new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>

                {/* Score Summary Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-foreground/5 rounded-xl border border-border/40 text-center space-y-1">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Heat Risk</span>
                    <p className={`text-xl font-heading font-extrabold ${
                      selectedItem.heatRiskScore >= 85 ? 'text-rose-500' :
                      selectedItem.heatRiskScore >= 60 ? 'text-orange-500' :
                      selectedItem.heatRiskScore >= 30 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>{selectedItem.heatRiskScore}%</p>
                  </div>
                  <div className="p-3 bg-foreground/5 rounded-xl border border-border/40 text-center space-y-1">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Vulnerability</span>
                    <p className="text-xl font-heading font-extrabold text-foreground">{selectedItem.heatVulnerabilityScore}%</p>
                  </div>
                  <div className="p-3 bg-foreground/5 rounded-xl border border-border/40 text-center space-y-1">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Canopy Priority</span>
                    <p className="text-xl font-heading font-extrabold text-foreground">{selectedItem.plantationPriorityScore}%</p>
                  </div>
                </div>

                {/* Input variables */}
                <div className="p-4 bg-foreground/5 rounded-xl border border-border/40 space-y-2.5">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/20 pb-1.5 uppercase tracking-wide">Audit Parameters</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
                    <div><span className="text-muted">Temperature: </span><span className="font-mono text-foreground font-semibold">{selectedItem.temperature}°C</span></div>
                    <div><span className="text-muted">AQI: </span><span className="font-mono text-foreground font-semibold">{selectedItem.aqi}</span></div>
                    <div><span className="text-muted">Land Cover: </span><span className="text-foreground font-semibold">{selectedItem.landCover}</span></div>
                    <div><span className="text-muted">Greenness: </span><span className="font-mono text-foreground font-semibold">{selectedItem.urbanGreennessRatio}%</span></div>
                    <div><span className="text-muted">Pop. Density: </span><span className="font-mono text-foreground font-semibold">{selectedItem.populationDensity}/km²</span></div>
                    <div><span className="text-muted">Energy Cons.: </span><span className="font-mono text-foreground font-semibold">{selectedItem.energyConsumption} kWh</span></div>
                    <div><span className="text-muted">Elevation: </span><span className="font-mono text-foreground font-semibold">{selectedItem.elevation}m</span></div>
                    <div><span className="text-muted">Coordinates: </span><span className="font-mono text-foreground font-semibold">{selectedItem.latitude.toFixed(3)}, {selectedItem.longitude.toFixed(3)}</span></div>
                  </div>
                </div>

                {/* Recommendation Target details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-foreground/5 rounded-xl border border-border/40 space-y-2 text-xs">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Analysis Result</span>
                    <div><span className="text-muted">Risk Category: </span><span className="font-bold text-foreground">{selectedItem.riskCategory}</span></div>
                    <div><span className="text-muted">Future Temp: </span><span className="font-mono font-bold text-foreground">{selectedItem.futureTemperature}°C</span></div>
                    <div><span className="text-muted">Plantation Ranking: </span><span className="font-bold text-foreground">Rank {selectedItem.plantationRanking} / 10</span></div>
                  </div>
                  <div className="p-4 bg-foreground/5 rounded-xl border border-border/40 space-y-2 text-xs">
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Mitigation Targets</span>
                    <div><span className="text-muted">Target Green Cover: </span><span className="font-mono font-bold text-foreground">{selectedItem.greenCoverTarget}%</span></div>
                    <div><span className="text-muted">Temp Reduction: </span><span className="font-mono font-bold text-emerald-500">-{selectedItem.temperatureReductionEstimate}°C</span></div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/20 pb-1.5 uppercase tracking-wide">Climate Recommendations</h4>
                  <ul className="space-y-2">
                    {selectedItem.climateRecommendations.map((rec, index) => (
                      <li key={index} className="flex gap-2 text-xs text-muted font-light leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardHome;
