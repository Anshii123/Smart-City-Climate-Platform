import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';

const LottiePlayer = Lottie.default || Lottie;
import { 
  Sliders, Sun, ShieldCheck, Thermometer, Trees, Sparkles, 
  AlertCircle, DollarSign, Database, CloudRain, Heart, Landmark, Compass, Wind 
} from 'lucide-react';

// Fallback Mock Dataset matching HeatMap.jsx & Analytics.jsx
const fallbackMockCities = [
  { id: "mock_1", cityName: "City_1", latitude: -22.58, longitude: 71.34, elevation: 833, temperature: 22.98, landCover: "Water", populationDensity: 2544, energyConsumption: 7160, aqi: 158, urbanGreennessRatio: 50.45, heatRiskScore: 35.4, heatVulnerabilityScore: 52.1, plantationPriorityScore: 48.6 },
  { id: "mock_2", cityName: "City_2", latitude: 81.13, longitude: 12.99, elevation: 2438, temperature: 21.98, landCover: "Green Space", populationDensity: 7868, energyConsumption: 37117, aqi: 84, urbanGreennessRatio: 17.34, heatRiskScore: 42.1, heatVulnerabilityScore: 78.5, plantationPriorityScore: 82.3 },
  { id: "mock_3", cityName: "City_3", latitude: 41.76, longitude: -68.57, elevation: 3928, temperature: 10.64, landCover: "Green Space", populationDensity: 4016, energyConsumption: 48754, aqi: 32, urbanGreennessRatio: 27.13, heatRiskScore: 28.3, heatVulnerabilityScore: 35.6, plantationPriorityScore: 65.4 },
  { id: "mock_4", cityName: "City_4", latitude: 17.76, longitude: 112.97, elevation: 3295, temperature: 18.53, landCover: "Green Space", populationDensity: 9750, energyConsumption: 3557, aqi: 195, urbanGreennessRatio: 53.23, heatRiskScore: 31.8, heatVulnerabilityScore: 72.1, plantationPriorityScore: 59.8 },
  { id: "mock_5", cityName: "City_5", latitude: -61.92, longitude: 66.50, elevation: 3629, temperature: 19.50, landCover: "Water", populationDensity: 9668, energyConsumption: 34427, aqi: 150, urbanGreennessRatio: 17.75, heatRiskScore: 48.2, heatVulnerabilityScore: 81.4, plantationPriorityScore: 86.1 },
  { id: "mock_6", cityName: "City_6", latitude: -61.92, longitude: -121.46, elevation: 2964, temperature: 19.97, landCover: "Industrial", populationDensity: 5077, energyConsumption: 23939, aqi: 158, urbanGreennessRatio: 14.14, heatRiskScore: 82.5, heatVulnerabilityScore: 79.2, plantationPriorityScore: 88.4 },
  { id: "mock_7", cityName: "City_7", latitude: -79.54, longitude: 147.93, elevation: 3115, temperature: 24.50, landCover: "Water", populationDensity: 1227, energyConsumption: 29379, aqi: 131, urbanGreennessRatio: 34.23, heatRiskScore: 45.1, heatVulnerabilityScore: 48.3, plantationPriorityScore: 61.2 },
  { id: "mock_8", cityName: "City_8", latitude: 65.91, longitude: 116.11, elevation: 3821, temperature: 23.34, landCover: "Industrial", populationDensity: 7968, energyConsumption: 5182, aqi: 67, urbanGreennessRatio: 25.12, heatRiskScore: 78.4, heatVulnerabilityScore: 68.7, plantationPriorityScore: 79.1 },
  { id: "mock_9", cityName: "City_9", latitude: 18.20, longitude: 161.93, elevation: 1123, temperature: 25.19, landCover: "Water", populationDensity: 842, energyConsumption: 3107, aqi: 114, urbanGreennessRatio: 38.17, heatRiskScore: 36.8, heatVulnerabilityScore: 45.2, plantationPriorityScore: 52.6 },
  { id: "mock_10", cityName: "City_10", latitude: 37.45, longitude: 81.26, elevation: 2202, temperature: 29.12, landCover: "Water", populationDensity: 1947, energyConsumption: 33676, aqi: 186, urbanGreennessRatio: 50.19, heatRiskScore: 54.3, heatVulnerabilityScore: 62.4, plantationPriorityScore: 60.1 }
];

const ClimateSimulator = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [greennessIncrease, setGreennessIncrease] = useState(25); // Slider value %
  const [loading, setLoading] = useState(true);
  const [lottieData, setLottieData] = useState(null);
  const lottieRef = useRef(null);

  useEffect(() => {
    // 1. Fetch cities telemetry
    const fetchCityData = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const token = localStorage.getItem('token') || (user && user.token);

        const response = await fetch('/api/city-data', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        if (json.success && json.data && json.data.length > 0) {
          setCities(json.data);
          setSelectedCity(json.data[0]);
        } else {
          setCities(fallbackMockCities);
          setSelectedCity(fallbackMockCities[0]);
        }
      } catch (err) {
        console.warn("Failed to fetch backend city data, using mock fallback:", err.message);
        setCities(fallbackMockCities);
        setSelectedCity(fallbackMockCities[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();

    // 2. Fetch public Lottie environmental animation JSON
    fetch('/ecology_lottie.json')
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(err => console.warn("Failed to load Lottie animation JSON, using fallback rendering:", err));
  }, []);

  // Update Lottie speed dynamically when slider changes
  useEffect(() => {
    if (lottieRef.current && typeof lottieRef.current.setSpeed === 'function') {
      const speed = 0.5 + (greennessIncrease / 50); // Speed scales between 0.5x and 2.5x
      lottieRef.current.setSpeed(speed);
    }
  }, [greennessIncrease, lottieData]);

  if (loading || !selectedCity) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted">Loading climate model modules...</p>
      </div>
    );
  }

  // Simulation calculations
  const tempReduction = (greennessIncrease * 0.05).toFixed(2); // Max 5.0°C cooling
  const simulatedTemp = (selectedCity.temperature - parseFloat(tempReduction)).toFixed(2);

  const aqiImprovement = (greennessIncrease * 0.8).toFixed(1); // Max 80 AQI reduction
  const simulatedAqi = Math.max(0, Math.round(selectedCity.aqi - parseFloat(aqiImprovement)));

  const simulatedRisk = Math.max(0, (selectedCity.heatRiskScore - (greennessIncrease * 0.4)).toFixed(1));
  const simulatedVulnerability = Math.max(0, (selectedCity.heatVulnerabilityScore - (greennessIncrease * 0.5)).toFixed(1));

  // Budget projection calculations
  const totalTreesNeeded = Math.round(greennessIncrease * 120 * (selectedCity.populationDensity / 1000));
  const totalBudgetEst = ((totalTreesNeeded * 45) / 1000000).toFixed(2); // Millions

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      {/* 1. Simulator Controls Header */}
      <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
            <Compass className="text-primary animate-spin" style={{ animationDuration: '6s' }} size={20} />
            Climate Impact Sandbox Simulator
          </h3>
          <p className="text-xs text-muted font-light">Simulate real-time temperature reductions and AQI changes based on tree canopy retrofits.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted flex items-center gap-1"><Database size={12} className="text-primary" /> Target Node:</span>
          <select
            value={selectedCity.id}
            onChange={(e) => {
              const target = cities.find(c => c.id === e.target.value);
              if (target) setSelectedCity(target);
            }}
            className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-primary/20"
          >
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.cityName} ({city.landCover})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Simulator Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Input Controls) (Col 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-border space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-border/60 pb-3">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-mono">Input Parameters</span>
                <h4 className="font-heading font-extrabold text-lg text-foreground mt-0.5 flex items-center gap-1.5">
                  <Sliders size={18} className="text-primary" /> Greening Multiplier
                </h4>
              </div>

              {/* Slider: Greenness Increase % */}
              <div className="space-y-3.5 py-4">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Trees size={16} className="text-emerald-500" /> Greenness Increase
                  </span>
                  <span className="font-mono text-primary font-extrabold text-base">+{greennessIncrease}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={greennessIncrease}
                  onChange={(e) => setGreennessIncrease(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-foreground/10 accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted font-light font-mono">
                  <span>0% (Baseline)</span>
                  <span>50% (Recommended)</span>
                  <span>100% (Max Canopy)</span>
                </div>
              </div>
            </div>

            {/* Simulated forestry requirements */}
            <div className="bg-foreground/5 p-4 rounded-xl border border-border/50 space-y-3.5 text-xs">
              <div className="flex items-center gap-2 text-primary font-semibold border-b border-border/40 pb-2">
                <Sparkles size={14} /> Estimated Forestry Needs
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Target Saplings Needed</span>
                <span className="font-bold text-foreground">{totalTreesNeeded.toLocaleString()} Trees</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Evapotranspiration Cooling</span>
                <span className="font-bold text-emerald-500">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Simulated Budget Cost</span>
                <span className="font-bold text-foreground">${totalBudgetEst}M USD</span>
              </div>
            </div>
          </div>

          {/* Lottie Animation Display Card */}
          <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col items-center justify-center h-[260px] relative overflow-hidden bg-gradient-mesh from-primary/5 to-secondary/5">
            <div className="absolute top-4 left-4">
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-mono">Greening Activity Simulator</span>
            </div>

            {lottieData ? (
              <div className="w-40 h-40">
                <LottiePlayer 
                  lottieRef={lottieRef}
                  animationData={lottieData} 
                  loop={true} 
                  autoplay={true}
                />
              </div>
            ) : (
              // Stunning dynamic Framer Motion fallback if Lottie load fails
              <div className="relative w-36 h-36 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15 / (1 + greennessIncrease / 50), ease: 'linear' }}
                  className="w-24 h-24 border-2 border-dashed border-emerald-500/30 rounded-full flex items-center justify-center"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2 / (1 + greennessIncrease / 50) }}
                    className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-primary"
                  >
                    <Trees size={32} />
                  </motion.div>
                </motion.div>
                
                {/* Floating wind particles */}
                <motion.div 
                  animate={{ x: [-40, 40], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="absolute text-cyan-400 text-xs"
                ><Wind size={16} /></motion.div>
              </div>
            )}
            
            <span className="text-[10px] text-muted font-light mt-2">
              Animation speed represents relative evapotranspiration rate: <span className="font-mono font-bold text-foreground">{(0.5 + greennessIncrease/50).toFixed(1)}x</span>
            </span>
          </div>
        </div>

        {/* Right Column (Outputs & Impact Telemetry) (Col 7) */}
        <div className="lg:col-span-7 bg-foreground/5 border border-border rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full space-y-6">
          
          {/* Temperature Reduction Header */}
          <div className="flex items-start justify-between border-b border-border/60 pb-5">
            <div>
              <p className="text-xs text-muted uppercase font-semibold tracking-wider">Simulated Temperature Profile</p>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
                  {simulatedTemp}°C
                </span>
                <span className="text-xs text-muted">vs {selectedCity.temperature.toFixed(2)}°C baseline</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted font-medium">Temperature Reduction</span>
              <div className="flex items-center gap-1 text-emerald-500 font-bold text-lg md:text-xl mt-1.5">
                <Thermometer size={20} className="animate-pulse" />
                <span>-{tempReduction}°C</span>
              </div>
            </div>
          </div>

          {/* AQI Improvement */}
          <div className="flex items-start justify-between border-b border-border/60 pb-5">
            <div>
              <p className="text-xs text-muted uppercase font-semibold tracking-wider">Simulated Air Quality index</p>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className={`text-4xl font-heading font-extrabold tracking-tight ${
                  simulatedAqi > 100 ? 'text-orange-400' : 'text-emerald-500'
                }`}>
                  {simulatedAqi} AQI
                </span>
                <span className="text-xs text-muted">vs {selectedCity.aqi} AQI baseline</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted font-medium">Particulate Absorption</span>
              <div className="flex items-center gap-1 text-sky-400 font-bold text-lg md:text-xl mt-1.5">
                <Wind size={20} />
                <span>-{aqiImprovement}</span>
              </div>
            </div>
          </div>

          {/* Score Gauges: Updated Heat Risk & Updated Vulnerability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
            
            {/* Updated Heat Risk Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted font-semibold flex items-center gap-1">
                  <ShieldAlert size={14} className="text-rose-500 animate-bounce" /> Updated Heat Risk
                </span>
                <span className="font-mono font-bold text-foreground">{simulatedRisk}/100</span>
              </div>
              <div className="w-full bg-foreground/10 rounded-full h-3 overflow-hidden border border-border/40">
                <motion.div 
                  key={simulatedRisk}
                  initial={{ width: '0%' }}
                  animate={{ width: `${simulatedRisk}%` }}
                  transition={{ type: 'spring', stiffness: 80 }}
                  className="h-full bg-gradient-to-r from-orange-400 to-rose-600 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[9px] text-muted font-mono">
                <span>Baseline: {selectedCity.heatRiskScore}%</span>
                <span className="text-emerald-500">Cooling: -{(selectedCity.heatRiskScore - simulatedRisk).toFixed(1)}%</span>
              </div>
            </div>

            {/* Updated Vulnerability Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted font-semibold flex items-center gap-1">
                  <Heart size={14} className="text-orange-500 animate-pulse" /> Updated Vulnerability
                </span>
                <span className="font-mono font-bold text-foreground">{simulatedVulnerability}/100</span>
              </div>
              <div className="w-full bg-foreground/10 rounded-full h-3 overflow-hidden border border-border/40">
                <motion.div 
                  key={simulatedVulnerability}
                  initial={{ width: '0%' }}
                  animate={{ width: `${simulatedVulnerability}%` }}
                  transition={{ type: 'spring', stiffness: 80 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[9px] text-muted font-mono">
                <span>Baseline: {selectedCity.heatVulnerabilityScore}%</span>
                <span className="text-emerald-500">Cooling: -{(selectedCity.heatVulnerabilityScore - simulatedVulnerability).toFixed(1)}%</span>
              </div>
            </div>

          </div>

          {/* Simulator Policy Info Box */}
          <div className="border-t border-border/60 pt-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary mt-0.5">
                <Landmark size={18} />
              </div>
              <div>
                <span className="text-[10px] text-muted font-semibold block uppercase">Eco-Cooling Standard Policy</span>
                <span className="text-xs text-foreground font-light leading-relaxed">
                  Greening targets map to the Federal Climate Resiliency Act of 2026.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted select-none shrink-0">
              <CloudRain size={14} className="text-primary animate-bounce" />
              <span>Simulated rainfall absorption active</span>
            </div>
          </div>

        </div>

      </div>

    </motion.div>
  );
};

export default ClimateSimulator;
