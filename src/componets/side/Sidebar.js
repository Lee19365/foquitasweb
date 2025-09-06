import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EstyleSide.css';
import foroIcon from '../../assets/foro.png';
import bookIcon from '../../assets/libreta.png';

export function Sidebar({ isOpen, onClick, children }) {
  const navigate = useNavigate();

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="Btn" onClick={() => navigate('/focas')}>
        <img src={bookIcon} alt="Libreta" />
        <h2>Especies de focas</h2>
      </button>

      <button className="Btn" onClick={() => navigate('/foro')}>
        <img src={foroIcon} alt="Foro" />
        <h2>Foro</h2>
      </button>

      <button className="Btn" onClick={() => navigate('/apoyos')}>
        <img src={foroIcon} alt="Apoyos" />
        <h2>Apoyos</h2>
      </button>

      {children}
    </div>
  );
}

export default Sidebar;
