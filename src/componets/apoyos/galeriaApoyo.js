import React from "react";
import { ApoyosCard } from './apoyosCard.js';
import producto1 from '../../assets/apoyoImagen/producto1.png';
import producto2 from '../../assets/apoyoImagen/produnto2.png';

const galeriadeApoyo = [
    {
        titulo: 'Sip n Seal Adoption Package (with Plush and Mug)', 
        imagen: producto1, 
        descripcion: 'Help support the rescue, rehabilitation, and release of seals with this adoption package that includes a plush seal and mug.', 
        link: 'https://mmsc.org/online-store/ols/products/harbor-seal-adoption-package-with-plush'
    },
    {
        titulo: 'Deluxe Seal Adoption Package (with Plush)',
        imagen: producto2,
        descripcion: 'A gift that makes a difference! Your seal adoption will help provide food, medicine, and general care for an injured or sick seal in our hospital.',
        link:'https://mmsc.org/online-store/ols/products/limited-edition-adoption-package-with-plush',
    }
];

export function Apoyos() {
    return (
        <div className="contenedorprincipalA"> 
            {galeriadeApoyo.map((apoyo, idx) => (
                <ApoyosCard
                    key={idx}
                    titulo={apoyo.titulo}
                    imagen={apoyo.imagen}
                    descripcion={apoyo.descripcion}
                    link={apoyo.link}
                />
            ))}
        </div>
    );
}
