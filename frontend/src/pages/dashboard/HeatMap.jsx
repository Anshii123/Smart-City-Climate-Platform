import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Info, Thermometer, ShieldAlert, Trees, Layers, AlertCircle, Compass, Search, Eye, Sparkles, Wind, Droplet, Sun, Database } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fallback Mock Dataset derived from urban_heat_island_dataset.csv
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

// Map controller component to programmatically fly to the selected city coordinates
const MapController = ({ selectedCity }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedCity) {
      map.setView([selectedCity.latitude, selectedCity.longitude], 6, {
        animate: true,
        duration: 1.2
      });
    }
  }, [selectedCity, map]);
  return null;
};

const HeatMap = () => {
  const [activeLayer, setActiveLayer] = useState('risk'); // 'risk' or 'priority'
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('mock'); // 'mock' or 'database'

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
          setDataSource('database');
        } else {
          console.log("Database empty or failed, falling back to mock dataset.");
          setCities(fallbackMockCities);
          setDataSource('mock');
        }
      } catch (err) {
        console.warn("Failed to fetch backend city data, using mock dataset:", err.message);
        setCities(fallbackMockCities);
        setDataSource('mock');
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, []);

  // Filter cities by search query
  const filteredCities = cities.filter(city => 
    city.cityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate dynamic recommendations based on scores
  const getActionRecommendation = (city) => {
    if (!city) return '';
    const recommendations = [];
    if (city.heatRiskScore >= 75) {
      recommendations.push("Extreme thermal risk detected. Implement white roof coating mandates and shade tarps immediately.");
    }
    if (city.plantationPriorityScore >= 70) {
      recommendations.push("High priority canopy void. Direct silver linden and red maple species planting to build windbreaks.");
    }
    if (city.aqi >= 150) {
      recommendations.push("Hazardous air quality. Deploy dense roadside vegetation arrays to block particulate matters.");
    }
    if (city.urbanGreennessRatio < 20) {
      recommendations.push("Insufficient green spaces. Convert underused parking and industrial concrete fields to parklands.");
    }
    return recommendations.length > 0 ? recommendations.join(" ") : "Ecosystem scores are stable. Continue bi-annual telemetry checks and standard canopy care.";
  };

  // Helper to construct pulsing Leaflet DivIcon based on scores and active layer
  const createCustomIcon = (score, type) => {
    let colorClass = '';
    let pingColorClass = '';
    
    if (type === 'risk') {
      if (score >= 75) {
        colorClass = 'bg-rose-500';
        pingColorClass = 'bg-rose-500';
      } else if (score >= 50) {
        colorClass = 'bg-orange-500';
        pingColorClass = 'bg-orange-500';
      } else if (score >= 25) {
        colorClass = 'bg-amber-400';
        pingColorClass = 'bg-amber-400';
      } else {
        colorClass = 'bg-emerald-500';
        pingColorClass = 'bg-emerald-500';
      }
    } else {
      // plantation priority
      if (score >= 75) {
        colorClass = 'bg-emerald-700';
        pingColorClass = 'bg-emerald-700';
      } else if (score >= 50) {
        colorClass = 'bg-emerald-500';
        pingColorClass = 'bg-emerald-500';
      } else if (score >= 25) {
        colorClass = 'bg-teal-400';
        pingColorClass = 'bg-teal-400';
      } else {
        colorClass = 'bg-slate-400';
        pingColorClass = 'bg-slate-400';
      }
    }

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex items-center justify-center w-6 h-6">
          <span class="animate-leaflet-ping absolute inline-flex h-full w-full rounded-full ${pingColorClass} opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3.5 w-3.5 ${colorClass} border border-white shadow"></span>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -10]
    });
  };

  // Helper to create cluster icon styled based on contents
  const createClusterIcon = (cluster) => {
    const count = cluster.getChildCount();
    const markers = cluster.getAllChildMarkers();
    
    let hasHighRisk = false;
    markers.forEach(marker => {
      const score = marker.options.score;
      if (score >= 70) {
        hasHighRisk = true;
      }
    });

    return L.divIcon({
      html: `<span>${count}</span>`,
      className: `custom-cluster-icon ${hasHighRisk ? 'custom-cluster-icon-high' : ''}`,
      iconSize: L.point(40, 40, true),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* 1. Header Control Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
            <Compass className="text-primary animate-spin" style={{ animationDuration: '6s' }} size={20} />
            Spatial Thermal GIS Interactive Map
          </h3>
          <p className="text-xs text-muted font-light flex items-center gap-1.5">
            <Database size={12} className="text-primary" />
            Showing {filteredCities.length} nodes from {dataSource === 'database' ? 'MongoDB active collection' : 'simulated CSV local backup'}.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input
              type="text"
              placeholder="Search by city name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 pl-10 pr-4 py-2 text-xs rounded-xl glass-input outline-none text-foreground placeholder-muted focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Layer Selector */}
          <div className="flex gap-1 p-1 bg-foreground/5 rounded-xl border border-border">
            <button
              onClick={() => setActiveLayer('risk')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                activeLayer === 'risk' ? 'bg-primary text-primary-foreground' : 'text-muted hover:text-foreground'
              }`}
            >
              <ShieldAlert size={14} /> Heat Risk
            </button>
            <button
              onClick={() => setActiveLayer('priority')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                activeLayer === 'priority' ? 'bg-primary text-primary-foreground' : 'text-muted hover:text-foreground'
              }`}
            >
              <Trees size={14} /> Plantation Priority
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Map Grid & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Leaflet Map Column (Col 8) */}
        <div className="lg:col-span-7 glass-panel p-4 rounded-2xl border border-border flex flex-col h-[580px] relative overflow-hidden">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-muted">Compiling telemetry markers...</p>
            </div>
          ) : (
            <>
              <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-border/40 px-2 shrink-0">
                <span className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                  <Map size={16} className="text-primary" /> Live GIS Cluster Array
                </span>
                <span className="text-xs text-muted flex items-center gap-1"><Layers size={12} /> Hover popups & zoom nodes</span>
              </div>

              <div className="flex-1 rounded-xl overflow-hidden border border-border/50 relative z-10">
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  
                  {/* Dynamic Fly-To Handler */}
                  <MapController selectedCity={selectedCity} />

                  <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterIcon}
                    showCoverageOnHover={false}
                    spiderfyOnMaxZoom={true}
                  >
                    {filteredCities.map((city) => {
                      const scoreValue = activeLayer === 'risk' ? city.heatRiskScore : city.plantationPriorityScore;
                      return (
                        <Marker
                          key={city.id}
                          position={[city.latitude, city.longitude]}
                          icon={createCustomIcon(scoreValue, activeLayer)}
                          score={scoreValue}
                          eventHandlers={{
                            click: () => {
                              setSelectedCity(city);
                            }
                          }}
                        >
                          <Popup>
                            <div className="p-1.5 space-y-1.5 min-w-[140px]">
                              <h4 className="font-heading font-extrabold text-sm text-foreground">{city.cityName}</h4>
                              <p className="text-[10px] text-muted leading-none">Lat: {city.latitude.toFixed(2)}, Lng: {city.longitude.toFixed(2)}</p>
                              <div className="border-t border-border/40 my-1 pt-1.5 space-y-1 text-xs">
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted">Heat Risk:</span>
                                  <span className="font-bold text-rose-400">{city.heatRiskScore}%</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted">Canopy Void:</span>
                                  <span className="font-bold text-emerald-400">{city.plantationPriorityScore}%</span>
                                </div>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MarkerClusterGroup>
                </MapContainer>
              </div>
            </>
          )}
        </div>

        {/* Inspector Detail Column (Col 5) */}
        <div className="lg:col-span-5 flex flex-col h-[580px]">
          <AnimatePresence mode="wait">
            {selectedCity ? (
              <motion.div 
                key={selectedCity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel p-6 rounded-2xl border border-border flex flex-col h-full overflow-y-auto space-y-5"
              >
                <div className="border-b border-border/60 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-mono">City Node Inspected</span>
                    <h4 className="font-heading font-extrabold text-xl text-foreground mt-0.5">{selectedCity.cityName}</h4>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-semibold">
                    {selectedCity.landCover}
                  </span>
                </div>

                {/* Score meters */}
                <div className="space-y-4">
                  {/* Heat Risk Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted font-medium flex items-center gap-1">
                        <Thermometer size={14} className="text-rose-500" /> Heat Risk Score
                      </span>
                      <span className="font-mono font-bold text-rose-500">{selectedCity.heatRiskScore}/100</span>
                    </div>
                    <div className="w-full bg-foreground/5 rounded-full h-2 overflow-hidden border border-border/40">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-rose-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${selectedCity.heatRiskScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Heat Vulnerability Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted font-medium flex items-center gap-1">
                        <ShieldAlert size={14} className="text-orange-500" /> Exposure Vulnerability
                      </span>
                      <span className="font-mono font-bold text-orange-500">{selectedCity.heatVulnerabilityScore}/100</span>
                    </div>
                    <div className="w-full bg-foreground/5 rounded-full h-2 overflow-hidden border border-border/40">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${selectedCity.heatVulnerabilityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Plantation Priority Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted font-medium flex items-center gap-1">
                        <Trees size={14} className="text-emerald-500" /> Plantation Priority
                      </span>
                      <span className="font-mono font-bold text-emerald-500">{selectedCity.plantationPriorityScore}/100</span>
                    </div>
                    <div className="w-full bg-foreground/5 rounded-full h-2 overflow-hidden border border-border/40">
                      <div 
                        className="bg-gradient-to-r from-teal-400 to-emerald-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${selectedCity.plantationPriorityScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-3.5 text-xs flex-1">
                  <div className="bg-foreground/5 p-3 rounded-xl border border-border/50 flex flex-col justify-center">
                    <span className="text-muted text-[10px]">Surface Temperature</span>
                    <span className="font-bold font-mono text-base text-foreground mt-1">{selectedCity.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="bg-foreground/5 p-3 rounded-xl border border-border/50 flex flex-col justify-center">
                    <span className="text-muted text-[10px]">Green Cover Ratio</span>
                    <span className="font-bold font-mono text-base text-emerald-500 mt-1">{selectedCity.urbanGreennessRatio.toFixed(1)}%</span>
                  </div>
                  <div className="bg-foreground/5 p-3 rounded-xl border border-border/50 flex flex-col justify-center">
                    <span className="text-muted text-[10px]">Population Density</span>
                    <span className="font-bold font-mono text-sm text-foreground mt-1">{selectedCity.populationDensity.toLocaleString()} /km²</span>
                  </div>
                  <div className="bg-foreground/5 p-3 rounded-xl border border-border/50 flex flex-col justify-center">
                    <span className="text-muted text-[10px]">Air Quality (AQI)</span>
                    <span className={`font-bold font-mono text-sm mt-1 ${
                      selectedCity.aqi > 150 ? 'text-rose-500' : selectedCity.aqi > 100 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>{selectedCity.aqi}</span>
                  </div>
                  <div className="bg-foreground/5 p-3 rounded-xl border border-border/50 flex flex-col justify-center">
                    <span className="text-muted text-[10px]">Energy Consumption</span>
                    <span className="font-bold font-mono text-sm text-foreground mt-1">{(selectedCity.energyConsumption / 1000).toFixed(1)} MWh</span>
                  </div>
                  <div className="bg-foreground/5 p-3 rounded-xl border border-border/50 flex flex-col justify-center">
                    <span className="text-muted text-[10px]">Altitude Elevation</span>
                    <span className="font-bold font-mono text-sm text-foreground mt-1">{selectedCity.elevation.toFixed(0)}m</span>
                  </div>
                </div>

                {/* Recommendations Box */}
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-2.5 items-start shrink-0">
                  <Sparkles size={18} className="text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono">Suggested Mitigation Pathway</span>
                    <p className="text-[11px] text-foreground leading-normal font-light">
                      {getActionRecommendation(selectedCity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel p-8 rounded-2xl border border-border/80 text-center py-16 text-muted space-y-2.5 flex-1 flex flex-col justify-center items-center">
                <Map size={36} className="opacity-40 animate-pulse text-primary mb-2" />
                <p className="font-heading font-semibold text-foreground text-sm">GIS Audit Inspector Idle</p>
                <p className="text-xs font-light max-w-[240px] leading-relaxed">
                  Click on any telemetry node on the cluster map, or use the query search filter to audit local climate properties.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
};

export default HeatMap;
