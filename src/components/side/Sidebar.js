import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EstyleSide.css';
import foroIcon from '../../assets/foro.png';
import bookIcon from '../../assets/libreta.png';
import apoyoIcon from '../../assets/apoyo.png';
export function Sidebar({ isOpen, onClose, children }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose(); // Cierra el menú al navegar
  };

  return (
    <>
      {/* Overlay para cerrar el menú en móvil */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <button className="Btn" onClick={() => handleNavigation('/focas')}>
          <img src={bookIcon} alt="Libreta" />
          <h2>Especies de focas</h2>
        </button>

        <button className="Btn" onClick={() => handleNavigation('/foro')}>
          <img src={foroIcon} alt="Foro" />
          <h2>Foro</h2>
        </button>

        <button className="Btn" onClick={() => handleNavigation('/apoyos')}>
          <img src={apoyoIcon || foroIcon} alt="Apoyos" />
          <h2>Apoyos</h2>
        </button>

        {children}
      </div>
    </>
  );
}

export default Sidebar;