// ============================================
// 📦 IMPORTACIONES
// ============================================
// React: Librería base para crear componentes
// useRef: Para referenciar elementos del DOM (como el gráfico)
// useEffect: Para ejecutar código después de renderizar (como resize)
// useMemo: Para optimizar cálculos pesados (evita recalcular en cada render)
import React, { useRef, useEffect, useMemo } from 'react';

// ReactECharts: Wrapper que facilita el uso de ECharts en React
import ReactECharts from 'echarts-for-react';

// Datos JSON con información de las focas
import focasData from '../../assets/data/focas_baikal_data_for_react.json';

// Estilos CSS personalizados para esta página
import './estiloEstadistica.css';


// ============================================
// 🎨 CONFIGURACIÓN DE COLORES
// ============================================

// Paleta de 8 colores para identificar a cada foca
// Si hay más de 8 focas, los colores se reciclan usando el operador %
const FOCA_COLORS = [
  '#ff6384', // Rosa
  '#36a2eb', // Azul
  '#ffce56', // Amarillo
  '#4bc0c0', // Turquesa
  '#9966ff', // Morado
  '#ff9f40', // Naranja
  '#c9cbcf', // Gris claro
  '#e7e9ed'  // Gris muy claro
];

// Colores específicos para cada estación del año
const SEASON_COLORS = {
  'Invierno': '#1e90ff',   // Azul frío
  'Primavera': '#32cd32',  // Verde
  'Verano': '#ffa500',     // Naranja cálido
  'Otoño': '#9932cc'       // Morado
};


// ============================================
// 🔧 FUNCIONES AUXILIARES
// ============================================

/**
 * Asigna un color a cada foca basado en su ID
 * @param {string} id - ID de la foca (ej: "Foca_1")
 * @returns {string} - Código de color hexadecimal
 * 
 * NOTA: parseInt extrae el número del ID, % 8 hace que se reciclen los colores
 * Ejemplo: Foca_1 → color[1], Foca_9 → color[1] (porque 9 % 8 = 1)
 */
function getFocaColor(id) {
  return FOCA_COLORS[parseInt(id, 10) % FOCA_COLORS.length];
}

/**
 * Determina la forma del símbolo según el tipo de anomalía
 * @param {string} tipo - Tipo de anomalía ('normal', 'duracion', 'profundidad', 'ambas')
 * @returns {string} - Nombre del símbolo para ECharts
 * 
 * SÍMBOLOS DISPONIBLES EN ECHARTS:
 * - 'circle': Círculo (●)
 * - 'rect': Cuadrado (■)
 * - 'triangle': Triángulo (▲)
 * - 'diamond': Rombo (◆)
 */
function getSymbol(tipo) {
  if (tipo === 'ambas') return 'diamond';       // ◆ Anomalía en profundidad Y duración
  if (tipo === 'duracion') return 'triangle';   // ▲ Solo anomalía de duración
  if (tipo === 'profundidad') return 'rect';    // ■ Solo anomalía de profundidad
  return 'circle';                               // ● Comportamiento normal
}


// ============================================
// 🏗️ COMPONENTE PRINCIPAL
// ============================================

function Estadisticas({ onClose }) {
  
  // ============================================
  // 📌 REFERENCIAS Y DATOS BASE
  // ============================================
  
  // useRef: Crea una referencia al gráfico para poder llamar métodos como resize()
  const chartRef = useRef(null);

  // useMemo: Calcula rawData UNA SOLA VEZ y lo guarda en memoria
  // Si los datos no cambian, no se recalcula → Mejora performance
  const rawData = useMemo(() => focasData.raw_data || [], []);


  // ============================================
  // 📊 GRÁFICO 1: HISTOGRAMA DE PROFUNDIDAD
  // ============================================
  // Muestra cuántas inmersiones ocurren en cada rango de profundidad
  
  // Definimos los "bins" (rangos) de profundidad
  // Ejemplo: [0, 25] significa "de 0m a 25m"
  const bins = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 450];

  // Contamos cuántas inmersiones caen en cada bin
  const frecuenciaPorBin = bins.slice(0, -1).map((min, i) => {
    const max = bins[i + 1];
    // .filter() cuenta solo las inmersiones dentro del rango [min, max)
    return rawData.filter(item => item.profundidad_m >= min && item.profundidad_m < max).length;
  });

  // Configuración del gráfico de barras
  const chartOptionHistograma = {
    // Título del gráfico
    title: {
      text: 'Distribución de Profundidad de Inmersiones',
      left: 'center',
      textStyle: { color: '#2C5F7C', fontSize: 18, fontWeight: 'bold' }
    },
    
    // Eje X: Categorías (rangos de profundidad)
    xAxis: {
      type: 'category', // Tipo categórico (no numérico continuo)
      data: bins.slice(0, -1).map((min, i) => `${min}-${bins[i+1]}m`),
      name: 'Profundidad (m)',
      axisLabel: { rotate: 45 } // Rotar etiquetas para que no se traslapen
    },
    
    // Eje Y: Valores numéricos (frecuencia)
    yAxis: {
      type: 'value',
      name: 'Frecuencia (número de inmersiones)'
    },
    
    // Tooltip: Cuadro que aparece al pasar el mouse
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} inmersiones'
    },
    
    // Los datos a graficar
    series: [{
      type: 'bar',
      data: frecuenciaPorBin,
      itemStyle: { color: '#3f789d' }
    }]
  };


  // ============================================
  // 📊 GRÁFICO 2: INMERSIONES POR ESTACIÓN
  // ============================================
  // Gráfico de línea que muestra cómo varía la actividad por estación
  
  const inmersionesPorEstacion = useMemo(() => {
    const estaciones = ['Invierno', 'Primavera', 'Verano', 'Otoño'];
    // Cuenta cuántas inmersiones hay en cada estación
    return estaciones.map(season => 
      rawData.filter(item => item.season === season).length
    );
  }, [rawData]);

  const chartOptionEstacional = useMemo(() => ({
    title: {
      text: 'Inmersiones por Estación del Año',
      left: 'center',
      textStyle: { color: '#2C5F7C', fontSize: 18, fontWeight: 'bold' }
    },
    
    xAxis: { 
      type: 'category', 
      data: ['Invierno', 'Primavera', 'Verano', 'Otoño'],
      name: 'Estación del Año'
    },
    
    yAxis: { 
      type: 'value', 
      name: 'Número de Inmersiones',
      // min: Valor mínimo del eje Y
      // max: Valor máximo (calculado dinámicamente)
      min: 6250,
      max: Math.max(...inmersionesPorEstacion) + 50
    },
    
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} inmersiones'
    },
    
    series: [{
      name: 'Inmersiones',
      type: 'line',
      data: inmersionesPorEstacion,
      symbol: 'circle',      // Forma de los puntos
      symbolSize: 8,         // Tamaño de los puntos
      lineStyle: { color: '#36a2eb', width: 2 }
    }]
  }), [inmersionesPorEstacion]);


  // ============================================
  // 📊 GRÁFICO 3: PROFUNDIDAD vs DURACIÓN POR FOCA
  // ============================================
  // Scatter plot donde cada punto es una inmersión
  // Cada foca tiene su propio color
  
  const chartOptionPorFoca = useMemo(() => {
    // Paso 1: Obtener lista única de focas
    const focasUnicas = [...new Set(rawData.map(item => item.id_foca))].sort();
    
    // Paso 2: Crear una SERIE por cada foca
    // ⚠️ IMPORTANTE: ECharts necesita una serie por categoría para que la leyenda funcione
    const seriesPorFoca = focasUnicas.map((foca, index) => ({
      name: foca, // Nombre que aparece en la leyenda
      type: 'scatter',
      symbolSize: 8,
      
      // Filtrar solo los datos de ESTA foca
      data: rawData
        .filter(item => item.id_foca === foca)
        .map(item => ({
          // value: [X, Y] → Coordenadas del punto
          value: [item.profundidad_m, item.duracion_min],
          
          // Estilo visual
          itemStyle: {
            color: getFocaColor(index),
            opacity: 0.7 // Transparencia para ver puntos superpuestos
          },
          
          // Datos extra para mostrar en el tooltip
          id_foca: item.id_foca,
          season: item.season,
          indice_actividad: item.indice_actividad,
          peso_kg: item.peso_kg,
          BCI: item.BCI
        }))
    }));

    return {
      backgroundColor: '#ffffff',
      
      title: {
        text: 'Relación Profundidad–Duración por Individuo',
        left: 'center',
        top: 20,
        textStyle: { color: '#2C5F7C', fontSize: 18, fontWeight: 'bold' }
      },
      
      // Tooltip personalizado con HTML
      tooltip: {
        trigger: 'item', // Se activa al pasar sobre UN punto
        backgroundColor: 'rgba(50,50,50,0.9)',
        borderColor: '#87CEEB',
        borderWidth: 2,
        textStyle: { color: '#fff' },
        
        // formatter: Función que retorna HTML personalizado
        formatter: (params) => {
          const d = params.data;
          return `
            <div style="padding: 8px;">
              <strong style="color: #87CEEB;">${d.id_foca}</strong><br/>
              <strong>Profundidad:</strong> ${d.value[0].toFixed(1)} m<br/>
              <strong>Duración:</strong> ${d.value[1].toFixed(1)} min<br/>
              <strong>Estación:</strong> ${d.season}<br/>
              <strong>Peso:</strong> ${d.peso_kg?.toFixed(1) || 'N/A'} kg<br/>
              <strong>BCI:</strong> ${d.BCI?.toFixed(2) || 'N/A'}<br/>
              <strong>Actividad:</strong> ${d.indice_actividad?.toFixed(2) || 'N/A'}
            </div>
          `;
        }
      },
      
      // Leyenda: Muestra las focas y permite mostrar/ocultar con clics
      legend: {
        show: true,
        orient: 'vertical', // Disposición vertical
        right: 20,          // 20px desde el borde derecho
        top: 80,
        data: focasUnicas,  // Lista de nombres
        textStyle: { fontSize: 11 }
      },
      
      // Grid: Define el área donde se dibujan los puntos
      grid: {
        left: '10%',
        right: '18%',  // Espacio para la leyenda
        bottom: '15%', // Espacio para dataZoom
        top: '18%',
        containLabel: true // Incluye etiquetas de ejes en el cálculo
      },
      
      // Eje X: Profundidad
      xAxis: {
        type: 'value', // Tipo numérico continuo
        name: 'Profundidad (m)',
        nameLocation: 'middle',
        nameGap: 40, // Separación entre el nombre y el eje
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2C5F7C'
        },
        min: 0,
        axisLine: { lineStyle: { color: '#87CEEB' } },
        splitLine: { // Líneas de la cuadrícula
          show: true,
          lineStyle: { color: '#e0f0ff', type: 'dashed' }
        }
      },
      
      // Eje Y: Duración
      yAxis: {
        type: 'value',
        name: 'Duración (min)',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2C5F7C'
        },
        min: 0,
        axisLine: { lineStyle: { color: '#87CEEB' } },
        splitLine: {
          show: true,
          lineStyle: { color: '#e0f0ff', type: 'dashed' }
        }
      },
      
      // dataZoom: Permite hacer zoom y navegar por el gráfico
      dataZoom: [
        {
          type: 'inside', // Zoom con la rueda del mouse
          xAxisIndex: 0,
          start: 0,  // Comienza mostrando el 0%
          end: 100   // Hasta el 100% de los datos
        },
        {
          type: 'slider', // Barra de zoom visual en la parte inferior
          xAxisIndex: 0,
          bottom: 20,
          start: 0,
          end: 100,
          height: 20
        }
      ],
      
      // Las series (una por foca)
      series: seriesPorFoca
    };
  }, [rawData]);


  // ============================================
  // 📊 GRÁFICO 4: ANOMALÍAS DETECTADAS
  // ============================================
  // Muestra todas las inmersiones coloreadas por estación
  // Las formas indican el tipo de anomalía
  
  const chartSeries = useMemo(() => {
    const seasons = ['Invierno', 'Primavera', 'Verano', 'Otoño'];
    
    // Crear una serie POR ESTACIÓN
    return seasons.map(season => ({
      name: season,
      type: 'scatter',
      
      // symbolSize: Tamaño dinámico según si es anomalía
      symbolSize: (value, params) => params.data.isAnomaly ? 14 : 8,
      
      data: rawData
        .filter(item => item.season === season)
        .map(item => {
          const isAnomaly = item.tipo_anom_pct !== 'normal';
          return {
            value: [item.profundidad_m, item.duracion_min],
            symbol: getSymbol(item.tipo_anom_pct), // Forma según tipo
            itemStyle: {
              color: SEASON_COLORS[season],
              borderColor: getFocaColor(item.id_foca),
              borderWidth: isAnomaly ? 2.5 : 1,
              opacity: isAnomaly ? 0.95 : 0.6
            },
            id_foca: item.id_foca,
            season: item.season,
            tipo_anom_pct: item.tipo_anom_pct,
            indice_actividad: item.indice_actividad,
            isAnomaly
          };
        })
    }));
  }, [rawData]);

  const chartOption = useMemo(() => ({
    backgroundColor: '#ffffff',
    title: {
      text: 'Inmersiones: Anomalías detectadas (percentiles 1%-99%)',
      left: 'center',
      top: 20,
      textStyle: { color: '#2C5F7C', fontSize: 20, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(50,50,50,0.9)',
      borderColor: '#87CEEB',
      borderWidth: 2,
      textStyle: { color: '#fff' },
      formatter: (params) => {
        const d = params.data;
        return `
          <div style="padding: 8px;">
            <strong style="color: #87CEEB;">Foca ${d.id_foca}</strong><br/>
            <strong>Estación:</strong> ${d.season}<br/>
            <strong>Profundidad:</strong> ${d.value[0].toFixed(1)} m<br/>
            <strong>Duración:</strong> ${d.value[1].toFixed(1)} min<br/>
            <strong>Tipo:</strong> ${d.tipo_anom_pct}<br/>
            <strong>Actividad:</strong> ${d.indice_actividad?.toFixed(2) || 'N/A'}
          </div>
        `;
      }
    },
    legend: {
      show: true,
      orient: 'vertical',
      right: 20,
      top: 80,
      data: ['Invierno', 'Primavera', 'Verano', 'Otoño']
    },
    grid: {
      left: '10%',
      right: '20%',
      bottom: '15%',
      top: '20%',
      containLabel: true
    },
    xAxis: { 
      name: 'Profundidad (m)', 
      nameLocation: 'middle', 
      nameGap: 40, 
      type: 'value', 
      min: 0 
    },
    yAxis: { 
      name: 'Duración (min)', 
      nameLocation: 'middle', 
      nameGap: 50, 
      type: 'value', 
      min: 0 
    },
    dataZoom: [
      { type: 'inside', xAxisIndex: 0 },
      { type: 'slider', xAxisIndex: 0, bottom: 20, height: 20 }
    ],
    series: chartSeries
  }), [chartSeries]);


  // ============================================
  // 🔄 EFECTO DE RESIZE
  // ============================================
  // Hace que el gráfico se redimensione cuando cambia el tamaño de la ventana
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Obtener la instancia de ECharts
    const chart = chartRef.current.getEchartsInstance();
    
    // ResizeObserver: API del navegador que detecta cambios de tamaño
    const resizeObserver = new ResizeObserver(() => {
      chart.resize(); // Redimensionar el gráfico
    });
    
    // Observar el contenedor del gráfico
    resizeObserver.observe(chart.getDom());
    
    // Forzar resize inicial
    chart.resize();
    
    // Cleanup: Desconectar el observer cuando el componente se desmonte
    return () => resizeObserver.disconnect();
  }, []);


  // ============================================
  // ✅ VALIDACIÓN DE DATOS
  // ============================================
  // Antes de renderizar, verificamos que los datos existan
  
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return (
      <div className="stats-error">
        <h2>⚠️ Error</h2>
        <p>No hay datos disponibles para mostrar.</p>
      </div>
    );
  }


  // ============================================
  // 🎨 RENDERIZADO
  // ============================================
  return (
    <div className="stats-container">
      
      {/* Botón de cerrar (solo si se pasa la función onClose) */}
      {onClose && (
        <button onClick={onClose} className="stats-close-button">
          ×
        </button>
      )}

      {/* Encabezado */}
      <h2 className="stats-title">
        📊 Estadísticas Big Data - Focas del Baikal
      </h2>
      <p className="stats-subtitle">
        Datos procesados: <strong>{rawData.length.toLocaleString()}</strong> inmersiones
      </p>

      {/* ============================================ */}
      {/* GRÁFICO 1: Histograma de profundidad         */}
      {/* ============================================ */}
      <div style={{ height: 400, width: '100%', marginTop: 30 }}>
        <ReactECharts 
          option={chartOptionHistograma} 
          style={{ height: '100%', width: '100%' }} 
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* ============================================ */}
      {/* GRÁFICO 2: Inmersiones por estación          */}
      {/* ============================================ */}
      <div className="stats-chart-container" style={{ height: 400, marginTop: 30 }}>
        <ReactECharts 
          option={chartOptionEstacional} 
          style={{ height: '100%', width: '100%' }} 
        />
      </div>

      {/* ============================================ */}
      {/* GRÁFICO 3: Profundidad-Duración por Foca     */}
      {/* ============================================ */}
      <div className="stats-chart-container" style={{ height: 500, marginTop: 30 }}>
        <ReactECharts 
          option={chartOptionPorFoca} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>

      {/* Leyenda de símbolos */}
      <div className="stats-legend">
        <div>● Normal</div>
        <div>■ Profundidad</div>
        <div>▲ Duración</div>
        <div>◆ Ambas</div>
      </div>

      {/* ============================================ */}
      {/* GRÁFICO 4: Anomalías detectadas              */}
      {/* ============================================ */}
      <div className="stats-chart-container" style={{ height: 400, marginTop: 30 }}>
        <ReactECharts 
          ref={chartRef} 
          option={chartOption} 
          style={{ height: '100%', width: '100%' }} 
        />
      </div>

    </div>
  );
}

export default Estadisticas;


// ============================================
// 📝 NOTAS IMPORTANTES PARA CREAR GRÁFICOS
// ============================================

/*
1. **ALTURA ES CRÍTICA**
   - El contenedor DEBE tener altura definida (height: 400px)
   - Sin altura, ECharts no se renderiza

2. **TIPOS DE EJES**
   - 'value': Para números continuos (0, 1, 2, 3...)
   - 'category': Para categorías discretas (['A', 'B', 'C'])
   - 'time': Para fechas
   - 'log': Escala logarítmica

3. **ESTRUCTURA DE DATOS**
   Para scatter: { value: [x, y], itemStyle: {...}, ...extraData }
   Para bar/line: [10, 20, 30, 40] o [{value: 10}, {value: 20}]

4. **OPTIMIZACIÓN**
   - useMemo: Para cálculos pesados
   - opts={{ renderer: 'canvas' }}: Para muchos puntos (>1000)
   - large: true: Para datasets enormes (>10,000 puntos)

5. **COLORES**
   - Usar variables para consistencia
   - opacity para ver puntos superpuestos
   - borderColor para destacar categorías

6. **TOOLTIP**
   - trigger: 'item' → Un solo punto
   - trigger: 'axis' → Todos los puntos del eje
   - formatter: Para personalizar con HTML

7. **LEYENDA**
   - Debe coincidir con los names de las series
   - orient: 'vertical' o 'horizontal'
   - Clics para mostrar/ocultar series

8. **RESIZE**
   - Siempre implementar ResizeObserver
   - Llamar a chart.resize() después de cambios

9. **DATAZOOM**
   - 'inside': Zoom con rueda del mouse
   - 'slider': Barra visual
   - Ambos pueden coexistir

10. **DEBUGGING**
    - Verificar que los datos tengan el formato correcto
    - Revisar la consola por errores
    - Usar console.log(option) para ver la configuración
*/