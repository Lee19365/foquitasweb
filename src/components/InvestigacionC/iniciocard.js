import React from 'react';
import { useNavigate } from 'react-router-dom';
import './estiloCard.css';

// Intenta importar la imagen
let focaImg;
try {
    focaImg = require('../../assets/foca.png');
} catch (error) {
    console.error('Error cargando imagen de foca:', error);
}

export function FocaImage() {
    console.log('Ruta de la imagen:', focaImg); // Para debug
    
    return (
        <>
            {focaImg ? (
                <img 
                    src={focaImg} 
                    alt="Foquita" 
                    className="foca-image"
                    onError={(e) => {
                        console.error('Error al cargar la imagen');
                        e.target.style.display = 'none';
                    }}
                    onLoad={() => console.log('Imagen cargada correctamente')}
                />
            ) : (
                // Fallback con emoji si la imagen no carga
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '20rem',
                    opacity: 0.15,
                    zIndex: 0,
                    pointerEvents: 'none',
                    animation: 'floatSeal 6s ease-in-out infinite'
                }}>
                    🦭
                </div>
            )}
        </>
    );
}

export function WelcomePage() {
    const navigate = useNavigate();

    return (
        <>
            <FocaImage />

            <div className="wave-decoration" />
            
            <div className="welcome-container">
                
                <h1 className="welcome-title">
                    🦭 Bienvenidos a FoquitasWeb
                </h1>
                
                <p className="welcome-subtitle">
                    Tu portal educativo sobre la vida marina más adorable del planeta
                </p>
                
                <p className="welcome-description">
                    Descubre el fascinante mundo de las focas, aprende sobre sus especies, 
                    hábitats y cómo podemos contribuir a su conservación. Únete a nuestra 
                    comunidad y ayuda a proteger estos increíbles animales. 💙
                </p>

                <button 
                    className="cta-button"
                    onClick={() => navigate('/focas')}
                >
                    Explorar Especies 🔍
                </button>

                <div className="features-grid">
                    <div className="feature-card">
                        <span className="feature-icon">📚</span>
                        <h3 className="feature-title">18 Especies</h3>
                        <p className="feature-description">
                            Conoce las diferentes especies de focas, desde la foca monje 
                            hasta el elefante marino sureño
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">🌊</span>
                        <h3 className="feature-title">Conservación</h3>
                        <p className="feature-description">
                            Aprende sobre los esfuerzos de conservación y cómo puedes 
                            ayudar a proteger estos maravillosos animales
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">💝</span>
                        <h3 className="feature-title">Apoya la Causa</h3>
                        <p className="feature-description">
                            Descubre productos y formas de contribuir a organizaciones 
                            dedicadas al rescate y rehabilitación de focas
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}