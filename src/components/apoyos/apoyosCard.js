import React from "react";
import './Estyleapoyos.css';

export function ApoyosCard ({titulo, imagen, descripcion, link}) {
    return (
        <div className="contenedorA"> 
            <h1 className="tituloA">{titulo}</h1>
            <img src={imagen} alt={titulo}/>
            <p className="descripcionA">{descripcion}</p>
            <a className="link" href={link} target="_blank" rel="noopener noreferrer">
                Ver más
            </a>
        </div>
    );
}
