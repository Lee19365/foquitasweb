import React from 'react';
import './Estyleinfo.css';

export function InfoFocasCard({ titulo, imagen, descripcion }) {
    return (
        <div className="card">
            <h2 className="titulo">{titulo}</h2>
            <img src={imagen} alt={titulo} />
            
            <p>{descripcion}</p>
        </div>
    );
}
