import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Trees, 
  Wind, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Building2,
  HeartPulse,
  Sun
} from 'lucide-react';

const DashboardHome = () => {
  // KPI Metrics Data
  const kpis = [
    { 
      label: 'Avg Surface Temp', 
      value: '31.4°C', 
      change: '+1.2°C vs decadal avg', 
      trend: 'up', 
      icon: Thermometer, 
      color: 'border-rose-500/30 text-rose-500 bg-rose-500/5' 
    },
    { 
      label: 'Greenness Ratio (NDVI)', 
      value: '24.2%', 
      change: '+0.8% this quarter', 
      trend: 'up', 
      icon: Trees, 
      color: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' 
    },
    { 
      label: 'Urban Heat Island Offset', 
      value: '-0.7°C', 
      change: 'Due to canopy planting', 
      trend: 'down', 
      icon: Sun, 
      color: 'border-cyan-500/30 text-cyan-500 bg-cyan-500/5' 
    },
    { 
      label: 'Heat Vulnerability Index', 
      value: '6.8 / 10', 
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
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
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
            className={`glass-panel border p-6 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200`}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs text-muted uppercase font-semibold tracking-wider">{kpi.label}</span>
              <div className={`p-2 rounded-xl border flex items-center justify-center shrink-0 ${kpi.color}`}>
                <kpi.icon size={18} />
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-3xl font-heading font-extrabold text-foreground">{kpi.value}</p>
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
              <h3 className="font-heading font-bold text-lg text-foreground">District Climate Vulnerability</h3>
              <p className="text-xs text-muted font-light">Breakdown of active localized urban microclimates.</p>
            </div>
            <button className="text-xs text-primary font-semibold hover:underline">View All Districts</button>
          </div>

          <div className="overflow-x-auto">
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
                  <tr key={district.name} className="hover:bg-foreground/5 transition-colors">
                    <td className="py-4 font-medium text-foreground flex items-center gap-2">
                      <Building2 size={16} className="text-muted" />
                      {district.name}
                    </td>
                    <td className="py-4 font-mono font-semibold">{district.temp}</td>
                    <td className="py-4 font-mono">{district.greenPct}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${district.statusColor}`}>
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
          className="glass-panel p-6 rounded-2xl border border-border flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
              <h3 className="font-heading font-bold text-lg text-foreground">Warning Operations</h3>
              <Clock size={16} className="text-muted" />
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.title} 
                  className={`p-4 rounded-xl border flex gap-3 items-start ${alert.color}`}
                >
                  <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-tight">{alert.title}</p>
                    <p className="text-xs opacity-80">{alert.location}</p>
                    <span className="text-[10px] opacity-60 block mt-1">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-6 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground font-semibold rounded-xl text-sm transition-all border border-border">
            Clear Mock Alerts
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default DashboardHome;
