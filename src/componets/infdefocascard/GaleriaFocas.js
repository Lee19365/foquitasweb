import React, { useState } from 'react';
import { InfoFocasCard } from './infofocascard';
import focagris from '../../assets/foca-gris.png';
import focaleopardo from '../../assets/foca-leopardo.png';
import focamonje from '../../assets/foca-monje.png';
import './Estyleinfo.css';

const focas = [
  {
    titulo: "FOCA MONJE DEL MEDITERRÁNEO",
    imagen: focamonje,
    descripcion: "La foca monje del Mediterráneo en el pasado se encontraba por todas las costas del Mediterráneo, incluyendo el Mar Negro y hacia el sur, en la costa atlántica y en las islas de África noroccidental."
  },
  {
    titulo: "Foca Leopardo",
    imagen: focaleopardo,
    descripcion: "Conocida como una de las principales depredadoras de la Antártida."
  },
  {
    titulo: "FOCA GRIS",
    imagen: focagris,
    descripcion: "Habita en las frías aguas del Atlántico norte."
  }
];

export function GaleriaFocas() {
    const [index, setIndex] = useState(0);

    const siguienteFoca = () => {
    setIndex((prevIndex) => (prevIndex + 1) % focas.length);
    };

    const anteriorFoca = () => {
    setIndex((prevIndex) => (prevIndex - 1 + focas.length) % focas.length);
    };

    const focaActual = focas[index];

    return (
    <div className="contenedor" 
    style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' 

    }}>
        <InfoFocasCard 
        titulo={focaActual.titulo} 
        imagen={focaActual.imagen} 
        descripcion={focaActual.descripcion}
        />
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
            onClick={anteriorFoca} 
            style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#afa9afff',
            color: 'white'
            }}
        >
            Anterior
        </button>
        <button 
            onClick={siguienteFoca} 
            style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#d79fd7ff',
            color: 'white'
            }}
        >
            Siguiente
        </button>
        </div>
    </div>
    ) ;
}
