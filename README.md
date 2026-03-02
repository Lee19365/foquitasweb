# Proyecto Focas del Lago Baikal

## Descripción General

Este proyecto es una aplicación web educativa y analítica centrada en las focas del Lago Baikal. Integra una interfaz de usuario en React para la visualización de información, un módulo de análisis de datos en Python para simular y procesar comportamientos ecológicos, y un sistema de persistencia con Firebase. El objetivo es proporcionar una plataforma modular que facilite el aprendizaje sobre especies de focas, la visualización de estadísticas, un marketplace con causa (apoyos/donaciones) y herramientas de navegación intuitivas.

La arquitectura es modular, separando responsabilidades entre frontend, lógica de negocio, procesamiento de datos y servicios. Incluye simulación de datos sintéticos, detección de anomalías, clustering y visualizaciones interactivas.

## Características Principales

- **Interfaz de Usuario (Frontend)**: Desarrollada en React con componentes reutilizables para navegación, tarjetas informativas y visualizaciones.
- **Análisis de Datos (Backend Python)**: Simulación de comportamientos de focas, análisis estadístico, detección de anomalías y generación de gráficos.
- **Marketplace con Causa**: Sección de apoyos/donaciones con productos e iniciativas ambientales.
- **Visualización de Estadísticas**: Gráficos interactivos usando ECharts para explorar datos de inmersiones, estaciones y anomalías.
- **Persistencia de Datos**: Integración con Firebase Realtime Database para almacenar y recuperar información de focas.
- **Navegación**: Barra superior (TopBar) y lateral (Sidebar) con accesos rápidos a secciones como especies, foro, apoyos y estadísticas.
- **Página de Inicio**: Bienvenida educativa con guía al usuario.
- **Simulación Ecológica**: Generación de datos sintéticos realistas para un año completo, incluyendo variabilidad estacional y comportamientos anómalos.

## Tecnologías Utilizadas

### Frontend
- React.js (con React Router para navegación)
- Firebase (Realtime Database)
- ECharts (para visualizaciones)
- CSS3 (estilos responsivos y animaciones)
- Dependencias NPM: react-router-dom, firebase, echarts-for-react, @testing-library/react, etc.

### Backend/Análisis de Datos
- Python 3 con librerías: numpy, pandas, matplotlib, seaborn, scikit-learn
- Scripts: simulacion.py (generación de datos), analisis.py (procesamiento y exportación JSON), graficacionpredicciones.py (visualizaciones)

### Otros
- JSON para datos locales (e.g., focas_baikal_data_for_react.json)
- Pruebas: Jest y @testing-library/jest-dom
- Configuración: .gitignore, reportWebVitals.js

## Instalación

### Requisitos Previos
- Node.js (v14+)
- Python 3.8+
- Cuenta en Firebase (para Realtime Database)

### Pasos
1. Clona el repositorio:
   ```
   git clone https://github.com/tu-usuario/proyecto-focas-baikal.git
   cd proyecto-focas-baikal
   ```

2. Instala dependencias del frontend:
   ```
   npm install
   ```
   (Incluye react, react-dom, react-router-dom, firebase, echarts-for-react, etc.)

3. Instala dependencias de Python (para análisis de datos):
   ```
   pip install numpy pandas matplotlib seaborn scikit-learn
   ```

4. Configura Firebase:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
   - Copia las credenciales en `src/firebase-config.js`.
   - Asegúrate de habilitar Realtime Database.

5. Ejecuta la simulación y análisis de datos (opcional, para generar JSON):
   ```
   python src/data/simulacion.py
   python src/data/analisis.py
   ```

6. Inicia la aplicación:
   ```
   npm start
   ```
   La app se abrirá en `http://localhost:3000`.

## Uso

- **Página de Inicio**: Accede a `/` para ver la bienvenida y características del proyecto.
- **Especies de Focas**: Navega a `/focas` para ver tarjetas editables con información (nombre, descripción, imagen).
- **Apoyos**: En `/apoyos`, explora el marketplace con productos y enlaces externos.
- **Estadísticas**: En `/estadisticas`, visualiza gráficos de inmersiones, anomalías y patrones estacionales.
- **Foro**: En `/foro` (en desarrollo, contenido informativo).
- **Navegación**: Usa la Sidebar (lateral) o TopBar (superior) para moverte entre secciones.
- **Edición**: En la galería de focas, edita títulos y descripciones; los cambios se guardan en Firebase.

Para pruebas:
```
npm test
```

## Estructura del Directorio

```
src/
├── App.js                  # Componente raíz y rutas
├── index.js                # Punto de entrada
├── firebase-config.js      # Configuración de Firebase
├── principal.js            # Vista principal/dashboard
├── assets/                 # Recursos estáticos
│   ├── data/               # JSON de datos (e.g., focas_baikal_data_for_react.json)
│   ├── imagenesFocas/      # Imágenes de focas
│   ├── apoyolImagen/       # Imágenes de apoyos
│   └── ...                 # Íconos (foca.png, maps.png, etc.)
├── componets/              # Componentes reutilizables (nota: renombrar a components)
│   ├── head/               # TopBar (barra superior)
│   ├── side/               # Sidebar (barra lateral)
│   ├── infodefocascard/    # Tarjetas de info de focas
│   ├── apoyos/             # Marketplace de apoyos
│   ├── estadisticasver/    # Visualización de estadísticas
│   └── InvestigacionC/     # Página de inicio
├── models/                 # Modelos de datos
│   └── cartasfocas_model.js # Modelo Foca
├── services/               # Servicios de datos
│   └── cardfocaService.js  # Servicio para focas (Firebase)
├── data/                   # Scripts Python
│   ├── simulacion.py       # Simulación de datos
│   ├── analisis.py         # Análisis y exportación
│   └── graficacionpredicciones.py # Gráficas de predicciones
├── pruebasMejora/          # Scripts de pruebas/simulaciones
└── ...                     # Archivos de config (App.test.js, .gitignore, etc.)
```

## Contribuyendo

1. Forkea el repositorio.
2. Crea una rama: `git checkout -b feature/nueva-funcion`.
3. Commitea cambios: `git commit -m 'Añade nueva función'`.
4. Pushea: `git push origin feature/nueva-funcion`.
5. Abre un Pull Request.

Sigue las buenas prácticas: corrige el nombre de `componets` a `components`, agrega pruebas y documenta cambios.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para detalles.

## Contacto

Para preguntas o sugerencias, contacta a [giselleaceves56@gmail.com].
