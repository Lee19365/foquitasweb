import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TobBar, MenuButton, MapButton, StatisticsBTN } from './componets/head/TobBar.js';
import Sidebar from './componets/side/Sidebar.js';
import { GaleriaFocas } from './componets/infdefocascard/GaleriaFocas.js';
import { FocaImage } from './componets/InvestigacionC/iniciocard.js';
import './App.css';
import { Apoyos } from './componets/apoyos/galeriaApoyo.js';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="App">
        <Sidebar isOpen={sidebarOpen} />

        <header className="App-header">
          <TobBar>
            <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)} />
            <MapButton onClick={() => alert('Mapa no disponible')} />
            <StatisticsBTN onClick={() => alert('Estadísticas no disponibles')} />
          </TobBar>
        </header>

        <main>
          <FocaImage />
          <Routes>
            {/* Página principal */}
            <Route 
              path="/" 
              element={
                <>
                  
                  <h1>Bienvenidos a FoquitasWeb</h1>
                  <p>Explora y aprende sobre las diferentes especies de focas.</p>
                </>
              } 
            />

            {/* Página de galería de focas */}
            <Route path="/focas" element={<GaleriaFocas />} />
            <Route path='/apoyos' element={<Apoyos/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
