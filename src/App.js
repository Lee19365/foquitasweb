import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { TobBar, MenuButton, MapButton, StatisticsBTN } from './componets/head/TobBar.js';
import Sidebar from './componets/side/Sidebar.js';
import { GaleriaFocas } from './componets/infdefocascard/GaleriaFocas.js';
import { FocaImage, WelcomePage } from './componets/InvestigacionC/iniciocard.js';
import { Apoyos } from './componets/apoyos/galeriaApoyo.js';
import Estadisticas from './componets/estadisticasver/Estadisticas.js';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="App">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <header className="App-header">
        <TobBar>
          <MenuButton onClick={toggleSidebar} />
          <MapButton onClick={() => alert('🗺️ Mapa de conservación - Próximamente')} />
          <StatisticsBTN onClick={() => navigate('/estadisticas')} />
        </TobBar>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<WelcomePage />} />

          <Route 
            path="/focas" 
            element={
              <>
                <FocaImage />
                <GaleriaFocas />
              </>
            } 
          />
          
          <Route 
            path="/apoyos" 
            element={
              <>
                <FocaImage />
                <Apoyos />
              </>
            } 
          />
          
          <Route 
            path="/foro" 
            element={
              <>
                <FocaImage />
                <div style={{ animation: 'fadeInUp 1s ease-out' }}>
                  <h1>Foro Comunitario 💬</h1>
                  <p>Próximamente podrás compartir experiencias...</p>
                </div>
              </>
            } 
          />

          <Route path="/estadisticas" element={<Estadisticas />} />
        </Routes>
      </main>
    </div>
  );
}

// Exportamos el componente envuelto en Router
export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}