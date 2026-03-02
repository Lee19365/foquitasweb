# 🦭 Baikal Seals: Big Data Analysis & Web Visualization

Este proyecto es una plataforma integral que combina el **Análisis de Datos (Machine Learning)** con el **Desarrollo Web Moderno** para monitorizar y visualizar el comportamiento de las focas del Lago Baikal. 

El sistema procesa más de **25,000 registros** de inmersiones, aplicando algoritmos avanzados para detectar anomalías y predecir tendencias futuras.

## 🚀 Características Principales

- **Data Pipeline:** Procesamiento de grandes volúmenes de datos con Python (Pandas/NumPy).
- **Machine Learning:** - Detección de anomalías mediante **Isolation Forest**.
    - Segmentación de comportamientos con **K-Means Clustering**.
- **Análisis Predictivo:** Predicciones para el año 2025 utilizando **Exponential Smoothing (Holt-Winters)**.
- **Dashboard Interactivo:** Visualizaciones dinámicas y responsivas con **ECharts**.
- **Arquitectura Modular:** Frontend construido en **React.js** con una clara separación de responsabilidades y servicios de **Firebase**.

## 🛠️ Stack Tecnológico

### Frontend & Backend
* **React.js** (Hooks, Context, Router)
* **Firebase** (Base de datos y Configuración)
* **CSS Modules** & Animaciones Personalizadas

### Data Science & Analytics
* **Python 3.x**
* **Scikit-learn** (ML Models)
* **Pandas & NumPy** (Data Manipulation)
* **ECharts for React** (Visualizaciones)

## 📁 Estructura del Proyecto

```text
├── src/
│   ├── components/       # Componentes reutilizables (UI/Cards)
│   ├── models/           # Definición de clases (Foca.js)
│   ├── services/         # Lógica de Firebase y API
│   ├── scripts/          # Scripts de Python (simulacion.py, analisis.py)
│   └── App.js            # Punto de entrada y Router
└── data/                 # Datasets y archivos JSON generados
