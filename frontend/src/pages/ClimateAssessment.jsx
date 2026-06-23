import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, HelpCircle, Activity, Thermometer, Wind, Zap, Layers, MapPin, 
  ArrowRight, ShieldCheck, HeartPulse, ClipboardCheck, Sparkles, Navigation, Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CircularGauge = ({ value, label, colorClass = "text-primary", max = 100 }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / max) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center p-5 bg-foreground/5 rounded-2xl border border-border/40 relative group hover:border-primary/30 transition-all duration-300">
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Background Track Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-muted/20"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Filled Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            className={`stroke-current ${colorClass}`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        {/* Value in Center */}
        <div className="absolute text-center">
          <span className="text-2xl font-extrabold font-heading text-foreground">{value}</span>
          <span className="text-[10px] text-muted block">%</span>
        </div>
      </div>
      <span className="text-[11px] font-semibold text-muted uppercase tracking-wider mt-3 text-center">{label}</span>
    </div>
  );
};

const ClimateAssessment = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    cityName: '',
    latitude: '',
    longitude: '',
    elevation: '',
    temperature: '',
    landCover: 'Urban',
    populationDensity: '',
    energyConsumption: '',
    aqi: '',
    urbanGreennessRatio: 30
  });

  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (e) => {
    setFormData(prev => ({
      ...prev,
      urbanGreennessRatio: parseInt(e.target.value)
    }));
  };

  const autofillCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: parseFloat(position.coords.latitude.toFixed(6)),
            longitude: parseFloat(position.coords.longitude.toFixed(6))
          }));
        },
        (err) => {
          console.warn("Geolocation denied or unavailable, using metropolitan averages.");
          setFormData(prev => ({
            ...prev,
            latitude: 40.7128,
            longitude: -74.0060,
            elevation: 10
          }));
        }
      );
    } else {
      setFormData(prev => ({
        ...prev,
        latitude: 40.7128,
        longitude: -74.0060,
        elevation: 10
      }));
    }
  };

  const calculateFallbackPredictions = (inputs) => {
    const {
      temperature,
      landCover,
      populationDensity,
      aqi,
      urbanGreennessRatio,
      elevation
    } = inputs;

    let heatRiskScore = (temperature - 15) * 3 + (aqi * 0.15) + (populationDensity / 500) - (urbanGreennessRatio * 0.4);
    if (landCover === 'Industrial') heatRiskScore += 12;
    if (landCover === 'Urban') heatRiskScore += 8;
    if (landCover === 'Water') heatRiskScore -= 10;
    heatRiskScore = Math.min(100, Math.max(0, Math.round(heatRiskScore * 100) / 100));

    let heatVulnerabilityScore = heatRiskScore * 0.65 + (populationDensity / 250) - (elevation * 0.02);
    heatVulnerabilityScore = Math.min(100, Math.max(0, Math.round(heatVulnerabilityScore * 100) / 100));

    let plantationPriorityScore = (100 - urbanGreennessRatio) * 0.75 + (heatRiskScore * 0.2) + (populationDensity / 1000);
    plantationPriorityScore = Math.min(100, Math.max(0, Math.round(plantationPriorityScore * 100) / 100));

    let riskCategory = 'Low';
    if (heatRiskScore >= 85) riskCategory = 'Extreme';
    else if (heatRiskScore >= 60) riskCategory = 'High';
    else if (heatRiskScore >= 30) riskCategory = 'Moderate';

    let plantationPriorityLevel = 'Low';
    if (plantationPriorityScore >= 80) plantationPriorityLevel = 'Critical';
    else if (plantationPriorityScore >= 55) plantationPriorityLevel = 'High';
    else if (plantationPriorityScore >= 30) plantationPriorityLevel = 'Medium';

    const plantationRanking = Math.max(1, Math.min(10, Math.round(plantationPriorityScore / 10)));

    let baseTarget = 30;
    if (populationDensity > 5000) baseTarget = 40;
    else if (populationDensity > 2000) baseTarget = 35;
    const greenCoverTarget = Math.min(80, Math.max(baseTarget, urbanGreennessRatio + 10));

    const tempReductionEstimate = Math.max(0, (greenCoverTarget - urbanGreennessRatio) * 0.12);
    const futureTemperature = temperature + (heatRiskScore * 0.04) + (aqi * 0.01) - (urbanGreennessRatio * 0.02);

    const climateRecommendations = [];
    if (aqi > 150) {
      climateRecommendations.push(
        "Install thick green buffer zones near high-traffic corridors and industrial borders to capture particulate matter (PM2.5/PM10)."
      );
    }
    if (urbanGreennessRatio < 20) {
      climateRecommendations.push(
        "Initiate micro-forest (Miyawaki method) projects and street-level canopy planting to establish contiguous urban cooling corridors."
      );
    }
    if (landCover.toLowerCase() === 'industrial') {
      climateRecommendations.push(
        "Mandate cool reflective roofing, industrial green walls, and permeable parking lot surfaces to mitigate waste heat in commercial zones."
      );
    }
    if (populationDensity > 7000) {
      climateRecommendations.push(
        "Establish pocket parks, green rooftops, and vertical gardens to maximize vegetation in high-density urban areas with space constraints."
      );
    }
    if (heatRiskScore > 70) {
      climateRecommendations.push(
        "Establish public cooling shelters, shaded walkways, and deploy public misting systems during high-temperature alerts."
      );
    }
    if (plantationPriorityScore > 70) {
      climateRecommendations.push(
        "Prioritize public budget allocation for tree plantation drives and community-led urban forestry programs."
      );
    }
    if (temperature > 30) {
      climateRecommendations.push(
        "Implement municipal heat emergency response protocols and expand irrigation schedules for key urban green zones."
      );
    }
    if (climateRecommendations.length === 0) {
      climateRecommendations.push(
        "Maintain and monitor existing urban green covers while promoting local community garden programs."
      );
    }

    return {
      success: true,
      inputs: {
        latitude: inputs.latitude || 0,
        longitude: inputs.longitude || 0,
        elevation: inputs.elevation || 0,
        temperature: inputs.temperature || 0,
        landCover: inputs.landCover || 'Urban',
        populationDensity: inputs.populationDensity || 0,
        energyConsumption: inputs.energyConsumption || 0,
        aqi: inputs.aqi || 0,
        urbanGreennessRatio: inputs.urbanGreennessRatio || 0
      },
      predictions: {
        heatRiskScore,
        heatVulnerabilityScore,
        plantationPriorityScore
      },
      recommendations: {
        riskCategory,
        futureTemperature: parseFloat(futureTemperature.toFixed(2)),
        plantationPriorityLevel,
        plantationRanking,
        greenCoverTarget: parseFloat(greenCoverTarget.toFixed(2)),
        temperatureReductionEstimate: parseFloat(tempReductionEstimate.toFixed(2)),
        climateRecommendations
      },
      isFallback: true
    };
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setSaveStatus('idle');
    setErrorMessage('');

    setLoading(true);
    setLoadingProgress(10);
    setLoadingPhase('Analyzing Climate Indicators...');

    const phaseTimer1 = setTimeout(() => {
      setLoadingProgress(35);
      setLoadingPhase('Computing Heat Risk...');
    }, 450);

    const phaseTimer2 = setTimeout(() => {
      setLoadingProgress(65);
      setLoadingPhase('Generating Urban Greening Strategy...');
    }, 900);

    const phaseTimer3 = setTimeout(() => {
      setLoadingProgress(85);
      setLoadingPhase('Finalizing Assessment...');
    }, 1350);

    const inputs = {
      cityName: formData.cityName || 'Custom City',
      latitude: formData.latitude !== '' ? parseFloat(formData.latitude) : 0.0,
      longitude: formData.longitude !== '' ? parseFloat(formData.longitude) : 0.0,
      elevation: formData.elevation !== '' ? parseFloat(formData.elevation) : 100.0,
      temperature: formData.temperature !== '' ? parseFloat(formData.temperature) : 25.0,
      landCover: formData.landCover,
      populationDensity: formData.populationDensity !== '' ? parseFloat(formData.populationDensity) : 1000.0,
      energyConsumption: formData.energyConsumption !== '' ? parseFloat(formData.energyConsumption) : 5000.0,
      aqi: formData.aqi !== '' ? parseFloat(formData.aqi) : 50.0,
      urbanGreennessRatio: parseFloat(formData.urbanGreennessRatio)
    };

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          temp: inputs.temperature,
          aqi: inputs.aqi,
          popDensity: inputs.populationDensity,
          energy: inputs.energyConsumption,
          greenness: inputs.urbanGreennessRatio,
          elevation: inputs.elevation,
          landCover: inputs.landCover,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          cityName: inputs.cityName
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      if (json.success) {
        setResult({
          cityName: inputs.cityName,
          inputs: json.inputs,
          predictions: json.predictions,
          recommendations: json.recommendations,
          isFallback: false
        });
        setSaveStatus('saved'); // Live saved to MongoDB on backend!
      } else {
        throw new Error("API responded with success: false");
      }
    } catch (err) {
      console.warn("API Predict failed or is offline. Executing heuristic prediction workflow client-side.", err.message);
      const fallbackResult = calculateFallbackPredictions(inputs);
      setResult({
        cityName: inputs.cityName,
        ...fallbackResult
      });
    } finally {
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      clearTimeout(phaseTimer3);
      setLoadingProgress(100);
      setTimeout(() => {
        setLoading(false);
      }, 250);
    }
  };

  const handleSavePrediction = async () => {
    if (!result) return;

    // If this was a live API prediction, it's already saved to MongoDB.
    if (!result.isFallback) {
      setSaveStatus('saved');
      return;
    }

    // Fallback path — explicitly POST to /api/predictions
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          cityName: result.cityName,
          latitude: result.inputs?.latitude ?? 0,
          longitude: result.inputs?.longitude ?? 0,
          elevation: result.inputs?.elevation ?? 0,
          temperature: result.inputs?.temperature ?? 0,
          landCover: result.inputs?.landCover ?? 'Urban',
          populationDensity: result.inputs?.populationDensity ?? 0,
          energyConsumption: result.inputs?.energyConsumption ?? 0,
          aqi: result.inputs?.aqi ?? 0,
          urbanGreennessRatio: result.inputs?.urbanGreennessRatio ?? 0,
          heatRiskScore: result.predictions?.heatRiskScore ?? 0,
          heatVulnerabilityScore: result.predictions?.heatVulnerabilityScore ?? 0,
          plantationPriorityScore: result.predictions?.plantationPriorityScore ?? 0,
          futureTemperature: result.recommendations?.futureTemperature ?? result.inputs?.temperature ?? 0,
          riskCategory: result.recommendations?.riskCategory ?? 'Low',
          plantationPriorityLevel: result.recommendations?.plantationPriorityLevel ?? 'Low',
          plantationRanking: result.recommendations?.plantationRanking ?? 1,
          greenCoverTarget: result.recommendations?.greenCoverTarget ?? 30,
          temperatureReductionEstimate: result.recommendations?.temperatureReductionEstimate ?? 0,
          climateRecommendations: result.recommendations?.climateRecommendations ?? []
        })
      });

      if (!response.ok) {
        throw new Error(`Save failed: ${response.status}`);
      }

      const json = await response.json();
      if (json.success) {
        setSaveStatus('saved');
      } else {
        throw new Error('Save returned success: false');
      }
    } catch (err) {
      console.error('Failed to save prediction:', err.message);
      setSaveStatus('idle');
      setErrorMessage(`Save failed: ${err.message}`);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 85) return 'text-rose-500';
    if (score >= 60) return 'text-orange-500';
    if (score >= 30) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className="space-y-12">
      {/* Page Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <Brain size={24} className="stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Climate Assessment</h1>
        </div>
        <p className="text-sm text-muted font-light max-w-2xl">
          Audit micro-climate risk factors. Input localized environmental and structural variables to project heat vulnerabilities, targets, and canopy cooling initiatives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (Col 5) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-border/80 space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <ClipboardCheck size={18} className="text-primary" /> Parameters Form
            </h3>
            <button 
              type="button"
              onClick={autofillCoordinates}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1.5 cursor-pointer bg-transparent border-none"
            >
              <Navigation size={12} /> Autodetect coordinates
            </button>
          </div>

          <form onSubmit={handlePredict} className="space-y-5">
            {/* City Name */}
            <div>
              <label htmlFor="cityName" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">City Name</label>
              <input
                id="cityName"
                type="text"
                name="cityName"
                value={formData.cityName}
                onChange={handleChange}
                placeholder="e.g. Metro East District"
                required
                className="w-full bg-foreground/5 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-medium text-foreground"
              />
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Latitude</label>
                <input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g. 40.7128"
                  className="w-full bg-foreground/5 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-medium text-foreground"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Longitude</label>
                <input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g. -74.0060"
                  className="w-full bg-foreground/5 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-medium text-foreground"
                />
              </div>
            </div>

            {/* Elevation & Temp */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="elevation" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Elevation (m)</label>
                <input
                  id="elevation"
                  type="number"
                  name="elevation"
                  value={formData.elevation}
                  onChange={handleChange}
                  placeholder="e.g. 85"
                  required
                  className="w-full bg-foreground/5 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-medium text-foreground"
                />
              </div>
              <div>
                <label htmlFor="temperature" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Temperature (°C)</label>
                <input
                  id="temperature"
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="e.g. 32.4"
                  required
                  className="w-full bg-foreground/5 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-medium text-foreground"
                />
              </div>
            </div>

            {/* Land Cover Dropdown */}
            <div>
              <label htmlFor="landCover" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Land Cover</label>
              <select
                id="landCover"
                name="landCover"
                value={formData.landCover}
                onChange={handleChange}
                className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium text-foreground cursor-pointer"
              >
                <option value="Urban">Urban</option>
                <option value="Industrial">Industrial</option>
                <option value="Green Space">Green Space</option>
                <option value="Water">Water</option>
              </select>
            </div>

            {/* Population Density & Energy */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="populationDensity" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Pop. Density (p/km²)</label>
                <input
                  id="populationDensity"
                  type="number"
                  name="populationDensity"
                  value={formData.populationDensity}
                  onChange={handleChange}
                  placeholder="e.g. 4500"
                  required
                  className="w-full bg-foreground/5 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-medium text-foreground"
                />
              </div>
              <div>
                <label htmlFor="energyConsumption" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Energy Cons. (kWh)</label>
                <input
                  id="energyConsumption"
                  type="number"
                  name="energyConsumption"
                  value={formData.energyConsumption}
                  onChange={handleChange}
                  placeholder="e.g. 7500"
                  required
                  className="w-full bg-foreground/5 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-medium text-foreground"
                />
              </div>
            </div>

            {/* AQI */}
            <div>
              <label htmlFor="aqi" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Air Quality Index (AQI)</label>
              <input
                id="aqi"
                type="number"
                name="aqi"
                value={formData.aqi}
                onChange={handleChange}
                placeholder="e.g. 112"
                required
                className="w-full bg-foreground/5 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-medium text-foreground"
              />
            </div>

            {/* Urban Greenness Ratio Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="urbanGreennessRatio" className="text-xs font-semibold text-muted uppercase tracking-wider">Urban Greenness Ratio</label>
                <span className="text-sm font-mono font-bold text-primary">{formData.urbanGreennessRatio}%</span>
              </div>
              <input
                id="urbanGreennessRatio"
                type="range"
                min="0"
                max="100"
                value={formData.urbanGreennessRatio}
                onChange={handleSliderChange}
                className="w-full accent-primary h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  {loadingPhase}
                </>
              ) : (
                <>
                  Generate Assessment <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Right Column: Prediction View (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-10 rounded-3xl border border-border/80 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[450px]"
              >
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                  <Brain size={32} className="text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-xl text-foreground">{loadingPhase}</h3>
                  <p className="text-xs text-muted font-light max-w-sm">Please wait while GreenQ models process climate vectors.</p>
                </div>
                <div className="w-full max-w-xs bg-foreground/10 h-2 rounded-full overflow-hidden relative">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ) : !result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-panel p-10 rounded-3xl border border-border/80 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[450px]"
              >
                <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                  <Activity size={32} className="animate-pulse" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-foreground">Waiting for Assessment</h3>
                <p className="text-xs text-muted font-light max-w-sm leading-relaxed">
                  Fill in the climate variables on the left and submit. The Random Forest modeling cluster will project environmental parameters instantly.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="space-y-6"
              >
                {/* 1. Results Summary Panel */}
                <div className="glass-panel p-6 rounded-3xl border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                  {/* Decorative blur */}
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {result.isFallback ? 'Local Simulator' : 'ML Model Verified'}
                      </span>
                      <span className="text-xs text-muted font-mono">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-2xl text-foreground flex items-center gap-2">
                      <Sparkles size={20} className="text-primary animate-bounce" /> {result.cityName} Results
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePrediction}
                      disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        saveStatus === 'saved'
                          ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                          : 'bg-primary text-primary-foreground hover:bg-primary/95'
                      }`}
                    >
                      <Save size={14} />
                      {saveStatus === 'idle' && 'Save Prediction'}
                      {saveStatus === 'saving' && 'Saving...'}
                      {saveStatus === 'saved' && 'Saved to Workspace!'}
                    </button>
                  </div>
                </div>

                {/* 2. Three Circular Score Gauges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <CircularGauge
                    value={result.predictions.heatRiskScore}
                    label="Heat Risk"
                    colorClass={getRiskColor(result.predictions.heatRiskScore)}
                  />
                  <CircularGauge
                    value={result.predictions.heatVulnerabilityScore}
                    label="Vulnerability"
                    colorClass={getRiskColor(result.predictions.heatVulnerabilityScore)}
                  />
                  <CircularGauge
                    value={result.predictions.plantationPriorityScore}
                    label="Planting Priority"
                    colorClass={getRiskColor(result.predictions.plantationPriorityScore)}
                  />
                </div>

                {/* 3. Output Telemetry Data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Climate Status Card */}
                  <div className="glass-panel p-5 rounded-2xl border border-border/40 space-y-4">
                    <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border/20 pb-2">
                      <Thermometer size={16} className="text-primary" /> Climate Telemetry
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Future Projected Temperature</span>
                        <span className="font-mono font-bold text-foreground text-sm">{result.recommendations.futureTemperature}°C</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Thermal Hazard Level</span>
                        <span className={`font-bold uppercase ${getRiskColor(result.predictions.heatRiskScore)}`}>
                          {result.recommendations.riskCategory}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Planting Priority Urgency</span>
                        <span className={`font-bold ${getRiskColor(result.predictions.plantationPriorityScore)}`}>
                          {result.recommendations.plantationPriorityLevel}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Canopy Urgency Index</span>
                        <span className="font-mono font-bold text-foreground text-sm">Rank {result.recommendations.plantationRanking} / 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Cooling Mitigation Targets */}
                  <div className="glass-panel p-5 rounded-2xl border border-border/40 space-y-4">
                    <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border/20 pb-2">
                      <Layers size={16} className="text-primary" /> Forestry & Cooling Targets
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Target Green Canopy cover</span>
                        <span className="font-mono font-bold text-foreground text-sm">{result.recommendations.greenCoverTarget}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Cooling Offset Projection</span>
                        <span className="font-mono font-bold text-emerald-500 text-sm">-{result.recommendations.temperatureReductionEstimate}°C</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Current Green Cover</span>
                        <span className="font-mono font-bold text-muted text-sm">{result.inputs.urbanGreennessRatio}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Target Canopy Deficit</span>
                        <span className="font-mono font-bold text-primary text-sm">
                          +{Math.max(0, parseFloat((result.recommendations.greenCoverTarget - result.inputs.urbanGreennessRatio).toFixed(2)))}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Strategic Recommendations Panel */}
                <div className="glass-panel p-6 rounded-2xl border border-border/40 space-y-4">
                  <h4 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5">
                    <ShieldCheck size={18} className="text-primary" /> Municipal Mitigation Guidelines
                  </h4>
                  <ul className="space-y-3.5">
                    {result.recommendations.climateRecommendations.map((rec, index) => (
                      <li key={index} className="flex gap-3 text-xs text-muted font-light leading-relaxed">
                        <div className="p-1 rounded bg-primary/10 border border-primary/20 text-primary shrink-0 h-fit mt-0.5">
                          <Activity size={12} />
                        </div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ClimateAssessment;
