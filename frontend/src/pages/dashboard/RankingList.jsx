import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, ShieldAlert, Trees, Thermometer, Compass } from 'lucide-react';

const RankingList = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = localStorage.getItem('token') || (user && user.token);

      const response = await fetch('/api/rankings', {
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
        setRankings(json.data);
      }
    } catch (err) {
      console.warn("Failed to fetch rankings from MongoDB predictions:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const getRankBadgeColor = (index) => {
    if (index === 0) return 'bg-rose-500/20 text-rose-500 border-rose-500/30';
    if (index === 1) return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
    if (index === 2) return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    return 'bg-foreground/5 text-muted border-border/40';
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
            <Star className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }} size={20} />
            Plantation Priority Rankings (Top 10)
          </h3>
          <p className="text-xs text-muted font-light">Municipal urgency roster computed live by sorting saved audit predictions by Plantation Priority Scores.</p>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel p-12 rounded-2xl border border-border flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted font-light">Compiling rankings data...</span>
        </div>
      ) : rankings.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl border border-border text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-foreground/5 rounded-2xl text-muted/50 border border-border/30">
            <Award size={32} />
          </div>
          <h4 className="font-heading font-extrabold text-lg text-foreground">Rankings Pool Empty</h4>
          <p className="text-xs text-muted font-light max-w-sm">
            Save new audit predictions in the Climate Assessment page. Top 10 plantation priority sectors will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rankings.map((city, index) => (
            <motion.div
              key={city._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2, scale: 1.005 }}
              className="glass-panel p-5 rounded-xl border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300"
            >
              {/* Left Rank Indicator and Name */}
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl border font-mono font-black text-sm flex items-center justify-center shrink-0 ${getRankBadgeColor(index)}`}>
                  #{index + 1}
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-base text-foreground flex items-center gap-2">
                    {city.cityName}
                  </h4>
                  <p className="text-[10px] text-muted leading-tight font-mono mt-0.5">
                    Lat: {city.latitude.toFixed(3)} Lng: {city.longitude.toFixed(3)} • Cover: {city.urbanGreennessRatio}%
                  </p>
                </div>
              </div>

              {/* Middle Metrics */}
              <div className="grid grid-cols-3 gap-6 sm:gap-12 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted uppercase tracking-wider block">Planting Priority</span>
                  <span className="font-mono font-bold text-emerald-500 text-sm">{city.plantationPriorityScore}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted uppercase tracking-wider block">Heat Risk</span>
                  <span className="font-mono font-bold text-rose-500 text-sm">{city.heatRiskScore}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted uppercase tracking-wider block">Vulnerability</span>
                  <span className="font-mono font-bold text-orange-500 text-sm">{city.heatVulnerabilityScore}%</span>
                </div>
              </div>

              {/* Right Tag/Actions */}
              <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  city.plantationPriorityLevel === 'Critical' ? 'bg-rose-500/20 text-rose-500' :
                  city.plantationPriorityLevel === 'High' ? 'bg-orange-500/20 text-orange-500' :
                  city.plantationPriorityLevel === 'Medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                }`}>
                  {city.plantationPriorityLevel} Urgency
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RankingList;
