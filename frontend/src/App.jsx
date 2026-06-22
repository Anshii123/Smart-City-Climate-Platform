import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingParticles from './components/FloatingParticles';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Dashboard Views
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Prediction from './pages/dashboard/Prediction';
import Analytics from './pages/dashboard/Analytics';
import HeatMap from './pages/dashboard/HeatMap';
import PlantationRecommendations from './pages/dashboard/PlantationRecommendations';
import ClimateSimulator from './pages/dashboard/ClimateSimulator';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Default to dark mode for that premium feel
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; 
  });

  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-[100vh] relative w-full overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      {/* Decorative ambient glowing grids */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full ambient-glow-emerald pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full ambient-glow-cyan pointer-events-none z-0" />
      
      {/* Immersive Floating Climate Particles */}
      <FloatingParticles />

      {/* Navigation */}
      {!isDashboardRoute && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      {/* Pages Container */}
      <Routes>
        <Route path="/" element={
          <main className="relative pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto z-20">
            <LandingPage />
          </main>
        } />
        <Route path="/login" element={
          <main className="relative pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto z-20">
            <LoginPage />
          </main>
        } />
        <Route path="/register" element={
          <main className="relative pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto z-20">
            <RegisterPage />
          </main>
        } />

        {/* Dashboard Shell with Nested Views */}
        <Route path="/dashboard" element={<DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
          <Route index element={<DashboardHome />} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="heatmap" element={<HeatMap />} />
          <Route path="recommendations" element={<PlantationRecommendations />} />
          <Route path="simulator" element={<ClimateSimulator />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
