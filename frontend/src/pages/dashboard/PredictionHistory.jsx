import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Trash2, Eye, X, Sparkles, AlertTriangle, Activity } from 'lucide-react';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
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
      console.warn("Failed to fetch predictions from MongoDB:", err.message);
    } finally {
      setLoading(false);
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

      if (!response.ok) {
        throw new Error(`Failed to delete prediction`);
      }

      const json = await response.json();
      if (json.success) {
        setPredictions(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      alert(`Error deleting prediction: ${err.message}`);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 85) return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
    if (score >= 60) return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
    if (score >= 30) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
  };

  const filteredPredictions = predictions.filter(p =>
    p.cityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header controls */}
      <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-heading font-extrabold text-lg text-foreground flex items-center gap-2">
            <History className="text-primary animate-pulse" size={20} />
            Prediction History Records
          </h3>
          <p className="text-xs text-muted font-light">Inspect, compare, or clean saved model inferences stored in MongoDB predictions collection.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
          <input
            type="text"
            placeholder="Search by city name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 text-xs rounded-xl glass-input outline-none text-foreground placeholder-muted focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="glass-panel p-12 rounded-2xl border border-border flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted font-light">Loading historical audit data...</span>
        </div>
      ) : filteredPredictions.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl border border-border text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-foreground/5 rounded-2xl text-muted/50 border border-border/30">
            <History size={32} />
          </div>
          <h4 className="font-heading font-extrabold text-lg text-foreground">No Records Found</h4>
          <p className="text-xs text-muted font-light max-w-sm">
            Predictions generated in the Climate Assessment dashboard are saved live to MongoDB and mapped here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto glass-panel p-6 rounded-2xl border border-border" tabIndex={0} aria-label="MongoDB Prediction History Table">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-muted uppercase border-b border-border/40 pb-2">
                <th className="pb-3 font-semibold">City Name</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Heat Risk</th>
                <th className="pb-3 font-semibold">Vulnerability</th>
                <th className="pb-3 font-semibold">Priority Score</th>
                <th className="pb-3 font-semibold">Hazard Level</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {filteredPredictions.map((item) => (
                <tr key={item._id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="py-4 font-semibold text-foreground">{item.cityName}</td>
                  <td className="py-4 text-xs font-mono text-muted">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="py-4">
                    <span className="font-mono font-bold">{item.heatRiskScore.toFixed(1)}%</span>
                  </td>
                  <td className="py-4 font-mono">{item.heatVulnerabilityScore.toFixed(1)}%</td>
                  <td className="py-4 font-mono">{item.plantationPriorityScore.toFixed(1)}%</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskColor(item.heatRiskScore).split(' ')[0]} ${getRiskColor(item.heatRiskScore).split(' ')[1]} ${getRiskColor(item.heatRiskScore).split(' ')[2]}`}>
                      {item.riskCategory}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        title="View Details"
                        className="p-2 rounded-lg bg-foreground/5 hover:bg-primary/25 text-muted hover:text-primary border border-border/40 transition-colors cursor-pointer"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        title="Delete Prediction"
                        className="p-2 rounded-lg bg-foreground/5 hover:bg-rose-500/25 text-muted hover:text-rose-500 border border-border/40 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details modal popup */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel border border-border w-full max-w-2xl rounded-3xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-muted hover:text-foreground border border-border/40 cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    MongoDB Collection Record
                  </span>
                  <h3 className="text-xl font-heading font-extrabold text-foreground mt-2 flex items-center gap-1.5">
                    <Sparkles size={18} className="text-primary" /> {selectedItem.cityName} Results
                  </h3>
                  <p className="text-[11px] text-muted font-mono mt-1">Audit run on {new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>

                {/* Score Summary Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-foreground/5 rounded-xl border border-border/40 text-center space-y-1">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Heat Risk</span>
                    <p className={`text-xl font-heading font-extrabold ${
                      selectedItem.heatRiskScore >= 85 ? 'text-rose-500' :
                      selectedItem.heatRiskScore >= 60 ? 'text-orange-500' :
                      selectedItem.heatRiskScore >= 30 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>{selectedItem.heatRiskScore.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-foreground/5 rounded-xl border border-border/40 text-center space-y-1">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Vulnerability</span>
                    <p className="text-xl font-heading font-extrabold text-foreground">{selectedItem.heatVulnerabilityScore.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-foreground/5 rounded-xl border border-border/40 text-center space-y-1">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Canopy Priority</span>
                    <p className="text-xl font-heading font-extrabold text-foreground">{selectedItem.plantationPriorityScore.toFixed(1)}%</p>
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

export default PredictionHistory;
