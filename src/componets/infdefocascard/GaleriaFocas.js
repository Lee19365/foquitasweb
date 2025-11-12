import React, { useState, useEffect } from "react"; 
import { InfoFocasCard } from "./infofocascard"; 
import { Foca } from "../models/cartasfocas_model"; 
import { cargarFocas, guardarFoca } from "../services/cardfocaService";

import focamonje from '../../assets/imagenesFocas/foca-monje.png';
import focaHawaiana from '../../assets/imagenesFocas/Foca-Hawaii .png';

import focagris from '../../assets/imagenesFocas/foca-gris.png';
import focacomun from '../../assets/imagenesFocas/foca-comun.png';
import focamoteada from '../../assets/imagenesFocas/foca-moteada.png';

import focaharp from '../../assets/imagenesFocas/foca-harp.png';
import focabearded from '../../assets/imagenesFocas/foca-barbuda.png';
import focahooded from '../../assets/imagenesFocas/foca-casco.png';
import focafranjeada from '../../assets/imagenesFocas/foca-franjeada.png';

import focabaikal from '../../assets/imagenesFocas/foca-baikal.png';
import focaAnillada from '../../assets/imagenesFocas/foca-anillada.png';
import focacaspio from '../../assets/imagenesFocas/foca-caspio.png';

import focaWeddell from '../../assets/imagenesFocas/foca-wendell.png';
import focacrabeater from '../../assets/imagenesFocas/foca-cangrejera.png';
import focaross from '../../assets/imagenesFocas/foca-ross.png';
import focaleopardo from '../../assets/imagenesFocas/foca-leopardo.png';

import focaelephantnort from '../../assets/imagenesFocas/elefante-norte.png';
import focaelephantsur from '../../assets/imagenesFocas/elefante-sur.png';



const obtenerImagen = (foca) => {
  switch (foca.id) {
    case 1: return focamonje;
    case 2: return focaHawaiana;

    case 3: return focagris;
    case 4: return focacomun;
    case 5: return focamoteada;

    case 6: return focaharp;
    case 7: return focabearded;
    case 8: return focahooded;
    case 9: return focafranjeada;

    case 10: return focabaikal;
    case 11: return focaAnillada;
    case 12: return focacaspio;

    case 13: return focaWeddell;
    case 14: return focaleopardo;
    case 15: return focacrabeater;
    case 16: return focaross;
    
    case 17: return focaelephantnort;
    case 18: return focaelephantsur;

    
    default: return focagris;
  }
};


const especiesIniciales = [
  new Foca({ id: 1, titulo: "Foca Monje", descripcion: "...", imagen: focamonje }),
  new Foca({ id: 2, titulo: "Foca monje hawaiana", descripcion: "...", imagen: focaHawaiana }),
  new Foca({ id: 3, titulo: "Foca Gris", descripcion: "...", imagen: focagris }),
  new Foca({ id: 4, titulo: "Foca Común", descripcion: "...", imagen: focacomun }),
  new Foca({ id: 5, titulo: "Foca moteada", descripcion: "...", imagen: focamoteada }),
  new Foca({ id: 6, titulo: "Foca de harp", descripcion: "...", imagen: focaharp }),
  new Foca({ id: 7, titulo: "Foca barbuda", descripcion: "...", imagen: focabearded }),
  new Foca({ id: 8, titulo: "Foca de casco", descripcion: "...", imagen: focahooded }),
  new Foca({ id: 9, titulo: "Foca franjeada", descripcion: "...", imagen: focafranjeada }),
  new Foca({ id: 10, titulo: "Foca de Baikal", descripcion: "...", imagen: focabaikal }),
  new Foca({ id: 11, titulo: "Foca anillada", descripcion: "...", imagen: focaAnillada }),
  new Foca({ id: 12, titulo: "Foca del Caspio", descripcion: "...", imagen: focacaspio }),
  new Foca({ id: 13, titulo: "Foca de Weddell", descripcion: "...", imagen: focaWeddell }),
  new Foca({ id: 14, titulo: "Foca Leopardo", descripcion: "...", imagen: focaleopardo }),
  new Foca({ id: 15, titulo: "Foca cangrejera", descripcion: "...", imagen: focacrabeater }),
  new Foca({ id: 16, titulo: "Foca de Ross", descripcion: "...", imagen: focaross }),
  new Foca({ id: 17, titulo: "Elefante marino norteño", descripcion: "...", imagen: focaelephantnort }),
  new Foca({ id: 18, titulo: "Elefante marino sureño", descripcion: "...", imagen: focaelephantsur }),
];

async function inicializarFocas() {
  const focasDB = await cargarFocas();
  if (focasDB.length === 0) {
    for (const foca of especiesIniciales) {
      await guardarFoca(foca);
    }
    console.log("Focas iniciales cargadas en Firebase");
  }
}

export function GaleriaFocas() {
  const [focas, setFocas] = useState([]);
  const [index, setIndex] = useState(0);
  const [editando, setEditando] = useState(false);

  const [tituloEdit, setTituloEdit] = useState("");
  const [descripcionEdit, setDescripcionEdit] = useState("");

  useEffect(() => {
    async function fetchFocas() {
      await inicializarFocas();
      const focasDB = await cargarFocas();
      setFocas(focasDB);
    }
    fetchFocas();
  }, []);

  const focaActual = focas[index];

  // Cuando cambie la foca actual, actualizo los inputs
  useEffect(() => {
    if (focaActual) {
      setTituloEdit(focaActual.titulo);
      setDescripcionEdit(focaActual.descripcion);
    }
  }, [focaActual]);

  const siguienteFoca = () => setIndex((prev) => (prev + 1) % focas.length);
  const anteriorFoca = () => setIndex((prev) => (prev - 1 + focas.length) % focas.length);

  const guardarCambios = async () => {
    const nuevaFoca = new Foca({ ...focaActual, titulo: tituloEdit, descripcion: descripcionEdit });
    await guardarFoca(nuevaFoca);
    setFocas((prev) => prev.map((f, i) => (i === index ? nuevaFoca : f)));
    setEditando(false);
  };

  return (
    <div className="contenedor">
      <div style={{display: "flex", gap: "10px" }}>
        <button onClick={anteriorFoca} style={botonStyle}>Anterior</button>
        <button onClick={siguienteFoca} style={botonStyle}>Siguiente</button>
        <button onClick={() => setEditando(!editando)} style={botonStyle}>
          {editando ? "Cancelar" : "Editar"}
        </button>
      </div>
      {focaActual && (
        editando ? (
          <div className="card">
            <img src={obtenerImagen(focaActual)} alt={tituloEdit} />
            <input
              type="text"
              value={tituloEdit}
              onChange={(e) => setTituloEdit(e.target.value)}
            />
            <textarea
              value={descripcionEdit}
              onChange={(e) => setDescripcionEdit(e.target.value)}
            />
            <button onClick={guardarCambios} style={botonStyle}>
              Guardar cambios
            </button>
          </div>
        ) : (
          <InfoFocasCard
            titulo={focaActual.titulo}
            imagen={obtenerImagen(focaActual)}
            descripcion={focaActual.descripcion}
          />
        )
      )}

      
    </div>
  );
}

const botonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#d79fd7ff",
  color: "white",
};
