import React from 'react'
import './EstyleBar.css';
import menuIcon from '../../assets/menu.png';
import mapaIcon from '../../assets/maps.png';
import statisticIcon from '../../assets/estadisticas.png';




export function TobBar({ children }) {
    return (
    <div className='top-bar'>
        {children}
    </div>
    );
}

export function MenuButton({ onClick }) {
    return (
    <button className="menu-button" onClick={onClick}>
        <img src={menuIcon} alt="Menú" />
    </button>
    );
}

export function MapButton({ onClick }) {
    return (
    <button className="map-button" onClick={onClick}>
        <img src={mapaIcon} alt="mapa" />
    </button>
    );
}
export function StatisticsBTN({onClick}){
    return ( 
        <button className="statistics-button" onClick={onClick}>
        <img src = {statisticIcon } alt = "Estatisdicas" />
    </button>
    );
}




export default TobBar;