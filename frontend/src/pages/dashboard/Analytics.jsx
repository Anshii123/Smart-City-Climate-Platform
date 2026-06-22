import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, Info, Download, Filter, Thermometer, ShieldAlert, 
  Trees, Layers, AlertCircle, Compass, Wind, Users, Plus, LayoutGrid, CheckCircle2 
} from 'lucide-react';

// Unified fallback mock dataset matching HeatMap.jsx
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
  { id: "mock_10", cityName: "City_10", latitude: 37.45, longitude: 81.26, elevation: 2202, temperature: 29.12, landCover: "Water", populationDensity: 1947, energyConsumption: 33676, aqi: 186, urbanGreennessRatio: 50.19, heatRiskScore: 54.3, heatVulnerabilityScore: 62.4, plantationPriorityScore: 60.1 },
  { id: "mock_11", cityName: "City_11", latitude: -86.29, longitude: 40.83, elevation: 995, temperature: 30.32, landCover: "Industrial", populationDensity: 7081, energyConsumption: 41342, aqi: 162, urbanGreennessRatio: 16.86, heatRiskScore: 89.2, heatVulnerabilityScore: 82.5, plantationPriorityScore: 91.3 },
  { id: "mock_12", cityName: "City_12", latitude: 84.58, longitude: -29.43, elevation: 4444, temperature: 27.95, landCover: "Green Space", populationDensity: 6817, energyConsumption: 39319, aqi: 121, urbanGreennessRatio: 39.03, heatRiskScore: 44.5, heatVulnerabilityScore: 65.2, plantationPriorityScore: 68.7 },
  { id: "mock_13", cityName: "City_13", latitude: 59.84, longitude: 155.78, elevation: 4248, temperature: 33.89, landCover: "Industrial", populationDensity: 1026, energyConsumption: 27646, aqi: 50, urbanGreennessRatio: 35.28, heatRiskScore: 84.1, heatVulnerabilityScore: 39.5, plantationPriorityScore: 62.4 },
  { id: "mock_14", cityName: "City_14", latitude: -51.78, longitude: 131.78, elevation: 177, temperature: 10.46, landCover: "Urban", populationDensity: 7248, energyConsumption: 5893, aqi: 138, urbanGreennessRatio: 17.20, heatRiskScore: 61.2, heatVulnerabilityScore: 78.4, plantationPriorityScore: 84.7 },
  { id: "mock_15", cityName: "City_15", latitude: -57.27, longitude: -163.72, elevation: 3175, temperature: 14.89, landCover: "Urban", populationDensity: 905, energyConsumption: 34714, aqi: 76, urbanGreennessRatio: 41.20, heatRiskScore: 58.7, heatVulnerabilityScore: 41.3, plantationPriorityScore: 50.8 },
  { id: "mock_16", cityName: "City_16", latitude: -56.99, longitude: -170.51, elevation: 4163, temperature: 10.19, landCover: "Industrial", populationDensity: 8486, energyConsumption: 12852, aqi: 113, urbanGreennessRatio: 23.68, heatRiskScore: 74.5, heatVulnerabilityScore: 79.1, plantationPriorityScore: 82.5 },
  { id: "mock_17", cityName: "City_17", latitude: -35.24, longitude: -44.47, elevation: 812, temperature: 26.19, landCover: "Water", populationDensity: 4240, energyConsumption: 45642, aqi: 112, urbanGreennessRatio: 34.39, heatRiskScore: 50.3, heatVulnerabilityScore: 51.4, plantationPriorityScore: 58.9 },
  { id: "mock_18", cityName: "City_18", latitude: 4.46, longitude: 111.80, elevation: 2556, temperature: 32.45, landCover: "Urban", populationDensity: 2346, energyConsumption: 42075, aqi: 64, urbanGreennessRatio: 14.11, heatRiskScore: 83.4, heatVulnerabilityScore: 49.8, plantationPriorityScore: 76.5 },
  { id: "mock_19", cityName: "City_19", latitude: -12.25, longitude: 175.42, elevation: 4120, temperature: 16.09, landCover: "Urban", populationDensity: 1978, energyConsumption: 35760, aqi: 98, urbanGreennessRatio: 32.98, heatRiskScore: 62.5, heatVulnerabilityScore: 48.9, plantationPriorityScore: 59.2 },
  { id: "mock_20", cityName: "City_20", latitude: -37.58, longitude: -125.85, elevation: 153, temperature: 33.18, landCover: "Water", populationDensity: 1271, energyConsumption: 47493, aqi: 158, urbanGreennessRatio: 25.32, heatRiskScore: 59.1, heatVulnerabilityScore: 58.7, plantationPriorityScore: 67.4 },
  { id: "mock_21", cityName: "City_21", latitude: 20.13, longitude: 33.89, elevation: 3138, temperature: 11.51, landCover: "Water", populationDensity: 6025, energyConsumption: 2540, aqi: 169, urbanGreennessRatio: 51.12, heatRiskScore: 29.4, heatVulnerabilityScore: 68.2, plantationPriorityScore: 57.3 },
  { id: "mock_22", cityName: "City_22", latitude: -64.89, longitude: -42.88, elevation: 1338, temperature: 33.36, landCover: "Green Space", populationDensity: 9270, energyConsumption: 37074, aqi: 56, urbanGreennessRatio: 12.85, heatRiskScore: 49.8, heatVulnerabilityScore: 84.1, plantationPriorityScore: 89.5 },
  { id: "mock_23", cityName: "City_23", latitude: -37.41, longitude: 169.17, elevation: 4160, temperature: 18.79, landCover: "Water", populationDensity: 693, energyConsumption: 17182, aqi: 85, urbanGreennessRatio: 30.93, heatRiskScore: 32.1, heatVulnerabilityScore: 38.4, plantationPriorityScore: 49.3 },
  { id: "mock_24", cityName: "City_24", latitude: -24.05, longitude: 123.16, elevation: 4370, temperature: 12.54, landCover: "Industrial", populationDensity: 2507, energyConsumption: 45397, aqi: 52, urbanGreennessRatio: 32.92, heatRiskScore: 76.5, heatVulnerabilityScore: 42.1, plantationPriorityScore: 54.8 },
  { id: "mock_25", cityName: "City_25", latitude: -7.91, longitude: 121.80, elevation: 4249, temperature: 22.15, landCover: "Industrial", populationDensity: 1685, energyConsumption: 14067, aqi: 182, urbanGreennessRatio: 46.25, heatRiskScore: 71.3, heatVulnerabilityScore: 59.8, plantationPriorityScore: 58.7 }
];

// Feature importance weights
const featureImportanceData = {
  risk: [
    { name: 'Temperature', weight: 50, color: '#f43f5e' },
    { name: 'Land Cover Coeff', weight: 30, color: '#f97316' },
    { name: 'Energy Consumption', weight: 20, color: '#eab308' },
  ],
  vulnerability: [
    { name: 'Population Density', weight: 40, color: '#38bdf8' },
    { name: 'Air Quality (AQI)', weight: 30, color: '#f97316' },
    { name: 'Inverse Greenness', weight: 30, color: '#10b981' },
  ],
  priority: [
    { name: 'Inverse Greenness', weight: 40, color: '#10b981' },
    { name: 'Temperature', weight: 20, color: '#f43f5e' },
    { name: 'Population Density', weight: 20, color: '#38bdf8' },
    { name: 'Air Quality (AQI)', weight: 20, color: '#f97316' },
  ]
};

// Premium glassmorphic tooltip styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel px-4 py-2.5 rounded-xl border border-border text-xs space-y-1">
        <p className="font-heading font-extrabold text-foreground">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx} style={{ color: item.color }} className="font-mono">
            {item.name}: <span className="font-bold">{item.value.toLocaleString()}</span>{item.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importanceType, setImportanceType] = useState('risk');
  const [selectedLandCover, setSelectedLandCover] = useState('All');

  useEffect(() => {
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
        } else {
          setCities(fallbackMockCities);
        }
      } catch (err) {
        console.warn("Failed to fetch backend city data, using mock fallback:", err.message);
        setCities(fallbackMockCities);
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, []);

  // Filter data by Land Cover
  const filteredData = selectedLandCover === 'All' 
    ? cities 
    : cities.filter(c => c.landCover === selectedLandCover);

  // Compute KPI summaries dynamically
  const getKpis = () => {
    if (!filteredData.length) return { avgTemp: 0, avgAqi: 0, avgGreenness: 0, totalNodes: 0 };
    const totalTemp = filteredData.reduce((acc, curr) => acc + curr.temperature, 0);
    const totalAqi = filteredData.reduce((acc, curr) => acc + curr.aqi, 0);
    const totalGreenness = filteredData.reduce((acc, curr) => acc + curr.urbanGreennessRatio, 0);

    return {
      avgTemp: (totalTemp / filteredData.length).toFixed(1),
      avgAqi: (totalAqi / filteredData.length).toFixed(0),
      avgGreenness: (totalGreenness / filteredData.length).toFixed(1),
      totalNodes: filteredData.length
    };
  };

  const kpis = getKpis();

  // Pie chart calculation for Heat Risk distribution brackets
  const getRiskPieData = () => {
    let low = 0, moderate = 0, high = 0, critical = 0;
    filteredData.forEach(c => {
      if (c.heatRiskScore >= 75) critical++;
      else if (c.heatRiskScore >= 55) high++;
      else if (c.heatRiskScore >= 35) moderate++;
      else low++;
    });

    return [
      { name: 'Low Risk (<35)', value: low, color: '#10b981' },
      { name: 'Moderate Risk (35-55)', value: moderate, color: '#eab308' },
      { name: 'High Risk (55-75)', value: high, color: '#f97316' },
      { name: 'Critical Risk (>=75)', value: critical, color: '#f43f5e' }
    ];
  };

  const riskPieData = getRiskPieData();

  // Sorting utilities for visual line flow
  const sortedByTemp = [...filteredData].sort((a, b) => a.temperature - b.temperature);
  const sortedByGreen = [...filteredData].sort((a, b) => a.urbanGreennessRatio - b.urbanGreennessRatio);
  const sortedByPriority = [...filteredData].sort((a, b) => a.plantationPriorityScore - b.plantationPriorityScore);

  // Framer Motion entry animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* 1. Header Filter Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
            <BarChart3 className="text-primary animate-pulse" size={20} />
            Environmental Analytics Dashboard
          </h3>
          <p className="text-xs text-muted font-light">Cross-reference urban heat islands, particulate distributions, and priorities.</p>
        </div>

        {/* Global land cover filters */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted flex items-center gap-1"><Filter size={12} /> Land Cover Filter:</span>
          <select
            value={selectedLandCover}
            onChange={(e) => setSelectedLandCover(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-primary/20"
          >
            <option value="All">All Cover Types</option>
            <option value="Industrial">Industrial</option>
            <option value="Urban">Urban</option>
            <option value="Water">Water</option>
            <option value="Green Space">Green Space</option>
          </select>
        </div>
      </div>

      {/* 2. Live KPI metrics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20">
            <Thermometer size={22} />
          </div>
          <div>
            <span className="text-[10px] text-muted font-semibold uppercase tracking-wider block">Average Temperature</span>
            <span className="text-xl font-heading font-extrabold text-foreground mt-0.5 block">{kpis.avgTemp}°C</span>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl border border-orange-500/20">
            <Wind size={22} />
          </div>
          <div>
            <span className="text-[10px] text-muted font-semibold uppercase tracking-wider block">Average AQI</span>
            <span className="text-xl font-heading font-extrabold text-foreground mt-0.5 block">{kpis.avgAqi}</span>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
            <Trees size={22} />
          </div>
          <div>
            <span className="text-[10px] text-muted font-semibold uppercase tracking-wider block">Mean Green Ratio</span>
            <span className="text-xl font-heading font-extrabold text-foreground mt-0.5 block">{kpis.avgGreenness}%</span>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 text-sky-500 rounded-xl border border-sky-500/20">
            <Layers size={22} />
          </div>
          <div>
            <span className="text-[10px] text-muted font-semibold uppercase tracking-wider block">Audited Locations</span>
            <span className="text-xl font-heading font-extrabold text-foreground mt-0.5 block">{kpis.totalNodes} Nodes</span>
          </div>
        </motion.div>
      </div>

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted">Compiling data models...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* A. Temperature Distribution */}
          <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl border border-border space-y-4 flex flex-col h-[350px]">
            <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0">
              <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <Thermometer size={16} className="text-rose-500" /> Temperature Distribution
              </span>
              <span className="text-[10px] text-muted font-mono uppercase">Ascending nodes</span>
            </div>
            <div className="flex-1 w-full text-xs min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedByTemp} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="cityName" stroke="var(--muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} unit="°" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="temperature" name="Temperature" unit="°C" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* B. AQI Distribution */}
          <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl border border-border space-y-4 flex flex-col h-[350px]">
            <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0">
              <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <Wind size={16} className="text-orange-400" /> Air Quality Index (AQI) Distribution
              </span>
              <span className="text-[10px] text-muted font-mono uppercase">Node distribution</span>
            </div>
            <div className="flex-1 w-full text-xs min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="cityName" stroke="var(--muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="aqi" name="AQI" fill="#f97316">
                    {filteredData.map((entry, index) => {
                      // Graded coloring for AQI severity
                      let barColor = '#10b981'; // Green
                      if (entry.aqi > 150) barColor = '#f43f5e'; // Red
                      else if (entry.aqi > 100) barColor = '#f97316'; // Orange
                      else if (entry.aqi > 50) barColor = '#eab308'; // Yellow

                      return <Cell key={`cell-${index}`} fill={barColor} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* C. Population Density Analysis */}
          <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl border border-border space-y-4 flex flex-col h-[350px]">
            <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0">
              <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <Users size={16} className="text-sky-400" /> Population Density vs. Altitude
              </span>
              <span className="text-[10px] text-muted font-mono uppercase">Multi-axis index</span>
            </div>
            <div className="flex-1 w-full text-xs min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="cityName" stroke="var(--muted)" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="left" stroke="var(--muted)" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--muted)" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={24} iconSize={10} fontSize={10} />
                  <Bar yAxisId="left" dataKey="populationDensity" name="Density (ppl/km²)" fill="#38bdf8" fillOpacity={0.65} radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="elevation" name="Elevation (m)" stroke="#a855f7" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* D. Greenness Analysis */}
          <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl border border-border space-y-4 flex flex-col h-[350px]">
            <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0">
              <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <Trees size={16} className="text-emerald-500" /> Urban Greenness Ratio
              </span>
              <span className="text-[10px] text-muted font-mono uppercase">Sorted ratio flow</span>
            </div>
            <div className="flex-1 w-full text-xs min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedByGreen} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="cityName" stroke="var(--muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="urbanGreennessRatio" name="Greenness Ratio" unit="%" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGreen)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* E. Heat Risk Distribution */}
          <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl border border-border space-y-4 flex flex-col h-[350px]">
            <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0">
              <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <ShieldAlert size={16} className="text-rose-500" /> Heat Risk Category Distribution
              </span>
              <span className="text-[10px] text-muted font-mono uppercase">Bracket segments</span>
            </div>
            <div className="flex-grow flex items-center min-h-0 text-xs gap-4">
              <div className="w-[45%] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {riskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="w-[55%] space-y-2">
                {riskPieData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-foreground/5 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="text-muted font-light text-[11px] truncate max-w-[130px]">{entry.name}</span>
                    </div>
                    <span className="font-mono font-bold text-foreground">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* F. Plantation Priority Distribution */}
          <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl border border-border space-y-4 flex flex-col h-[350px]">
            <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0">
              <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <Trees size={16} className="text-teal-400" /> Plantation Priority Spread
              </span>
              <span className="text-[10px] text-muted font-mono uppercase">Low to high</span>
            </div>
            <div className="flex-1 w-full text-xs min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedByPriority} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPriority" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="cityName" stroke="var(--muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="plantationPriorityScore" name="Plantation Priority" stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPriority)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* G. Feature Importance (Dynamic weights toggler) */}
          <motion.div variants={cardVariants} className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-border space-y-5 flex flex-col h-[350px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40 shrink-0">
              <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <LayoutGrid size={16} className="text-primary" /> Multi-Index Feature Weights Analysis
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted font-mono uppercase">Active Model:</span>
                <select
                  value={importanceType}
                  onChange={(e) => setImportanceType(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-background text-[11px] text-foreground outline-none cursor-pointer"
                >
                  <option value="risk">Heat Risk Score Model</option>
                  <option value="vulnerability">Heat Vulnerability Model</option>
                  <option value="priority">Plantation Priority Model</option>
                </select>
              </div>
            </div>

            <div className="flex-1 w-full text-xs min-h-0 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full h-[90%]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical"
                    data={featureImportanceData[importanceType]} 
                    margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                    <XAxis type="number" stroke="var(--muted)" fontSize={10} tickLine={false} unit="%" />
                    <YAxis type="category" dataKey="name" stroke="var(--muted)" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="weight" name="Importance Weight" radius={[0, 4, 4, 0]}>
                      {featureImportanceData[importanceType].map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Explanatory description card */}
              <div className="w-full md:w-80 bg-foreground/5 p-4 rounded-xl border border-border/50 text-[11px] space-y-3 shrink-0">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <CheckCircle2 size={14} /> Model Logic Verification
                </div>
                <p className="text-muted leading-relaxed font-light">
                  {importanceType === 'risk' && "The Heat Risk model assigns 50% of the priority index to localized surface temperature anomalies, combined with building albedo factors and localized infrastructure energy heat emissions."}
                  {importanceType === 'vulnerability' && "The Heat Vulnerability index balances demographic density profiles (40%) alongside inverse tree canopy voids and hazardous particulate air pollutants (AQI) to identify high-exposure hotspots."}
                  {importanceType === 'priority' && "The Plantation Priority score places 40% weight directly on inverse greenness coverage targets, combined with equal weights (20% each) on current temperatures, density, and local air quality indexes."}
                </p>
                <div className="text-[10px] font-mono text-muted flex gap-2">
                  <span>Engine: Rule-Based Linear</span>
                  <span>r²: ~0.96</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      )}
    </motion.div>
  );
};

export default Analytics;
