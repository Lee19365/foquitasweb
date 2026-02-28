# ============================================================
# ANÁLISIS COMPLETO — FOCAS DEL BAIKAL
# Versión adaptada: TODAS LAS GRÁFICAS CON EJE X = ESTACIONES
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest
from scipy import stats

# -------------------------
# 1) Ingestión y preprocesamiento
# -------------------------

ruta = "simulacion_focas_baikal_realista2.csv" ##este año 2024
#simulacion_focas.csv este es el año 2023
#simulacion2022.csv este es el año 2022
df = pd.read_csv(ruta)

cols_esperadas = ['id_foca','timestamp','season','duracion_s','profundidad_m',
                  'temp_agua_C','temp_corpora_C','lat','lon','indice_actividad',
                  'fish_density','depth_prey_mean','peso_kg','BCI']

missing = [c for c in cols_esperadas if c not in df.columns]
if missing:
    raise ValueError(f"Faltan columnas en el CSV: {missing}")

df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
df = df.sort_values(['id_foca','timestamp']).reset_index(drop=True)

df['duracion_min'] = df['duracion_s'] / 60.0

num_cols = ['duracion_s','profundidad_m','temp_agua_C','temp_corpora_C',
            'indice_actividad','fish_density','peso_kg','BCI']

df[num_cols] = df[num_cols].apply(pd.to_numeric, errors='coerce')
df = df.dropna(subset=['timestamp','id_foca','profundidad_m','duracion_s'])

df['z_prof'] = stats.zscore(df['profundidad_m'])
df['z_dur'] = stats.zscore(df['duracion_s'])
df['z_act'] = stats.zscore(df['indice_actividad'])
df['z_bci'] = stats.zscore(df['BCI'])

# Orden estacional estándar
season_order = ['Invierno', 'Primavera', 'Verano', 'Otoño']

# -------------------------
# 2) Estadísticas descriptivas
# -------------------------

print("\nEstadísticas por estación:")
print(df.groupby('season')[['profundidad_m','duracion_s','duracion_min',
                            'indice_actividad','peso_kg','BCI']].agg(['mean','median','std']))

print("\nEstadísticas por individuo:")
print(df.groupby('id_foca')[['profundidad_m','duracion_s',
                             'indice_actividad','peso_kg','BCI']].agg(['mean','std','count']))

# -------------------------
# 3) Gráficas generales
# -------------------------

# Distribución de profundidad
plt.figure(figsize=(9,5))
plt.hist(df['profundidad_m'], bins=60)
plt.xlabel('Profundidad (m)')
plt.ylabel('Frecuencia')
plt.title('Distribución de profundidad total')
plt.grid(True, alpha=0.3)
plt.show()

# Boxplot por estación
plt.figure(figsize=(8,5))
plt.boxplot([df[df['season']==s]['profundidad_m'] for s in season_order],
            labels=season_order)
plt.ylabel('Profundidad (m)')
plt.title('Profundidad por estación (boxplot)')
plt.grid(True, alpha=0.3)
plt.show()

# Scatter profundidad vs duración por estación
plt.figure(figsize=(9,6))
for s in season_order:
    sub = df[df['season']==s]
    plt.scatter(sub['profundidad_m'], sub['duracion_min'], s=6, label=s)
plt.xlabel('Profundidad (m)')
plt.ylabel('Duración (min)')
plt.title('Relación profundidad–duración por estación')
plt.legend()
plt.grid(True, alpha=0.25)
plt.show()




# Scatter profundidad vs duración por ID de foca
plt.figure(figsize=(10,6))

ids = df['id_foca'].unique()   # lista de focas
for foca in ids:
    sub = df[df['id_foca'] == foca]
    plt.scatter(sub['profundidad_m'], sub['duracion_min'], s=6, label=f'Foca {foca}', alpha=0.7)

plt.xlabel('Profundidad (m)')
plt.ylabel('Duración (min)')
plt.title('Relación profundidad–duración por individuo')
plt.legend(markerscale=3, bbox_to_anchor=(1.05, 1), loc='upper left')
plt.grid(True, alpha=0.25)
plt.tight_layout()
plt.show()




# Mapa
plt.figure(figsize=(8,6))
plt.scatter(df['lon'], df['lat'], s=3, alpha=0.1)
plt.xlabel('Lon')
plt.ylabel('Lat')
plt.title('Posiciones de inmersiones')
plt.grid(True, alpha=0.25)
plt.show()


# -------------------------
# 4) INMERSIONES POR ESTACIÓN (en lugar de fechas)
# -------------------------

dives_per_season = df.groupby('season').size().reindex(season_order)

plt.figure(figsize=(10,5))
plt.plot(season_order, dives_per_season.values, marker='o')
plt.xlabel('Estación')
plt.ylabel('Número de inmersiones')
plt.title('Inmersiones por estación')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# -------------------------
# 5) ANÁLISIS ESTACIONAL (Tendencia – Estacionalidad – Residuales)
# -------------------------

# Seleccionar individuo de demostración
foca_demo = df['id_foca'].iloc[0]
df_f = df[df['id_foca']==foca_demo]

act_season = df_f.groupby('season')['indice_actividad'].mean().reindex(season_order)

# Tendencia (suavizado simple)
trend = act_season.rolling(2, min_periods=1).mean()

# Estacionalidad = desviación respecto a tendencia
seasonal = act_season - trend

# Residuales = desviación respecto a media total
residual = act_season - act_season.mean()

# -------------------------
# 6) ANOMALÍAS
# -------------------------

#==============================================
# -------------------------
# ANOMALÍAS (Percentiles por estación: opción B)
# - Detecta anomalias SOLO respecto a profundidad y duracion
# - Marca si es por Profundidad, Duración o Ambas
# - Mantiene color por estación y borde por id_foca
# -------------------------

# Ajustes de percentiles (cambiar si quieres más o menos sensibilidad)
low_pct = 1    # umbral inferior (p.ej. 1%)
high_pct = 99  # umbral superior (p.ej. 99%)

# 1) Calcular percentiles por estación
bounds = {}
for s in season_order:
    sub = df[df['season'] == s]
    if len(sub) < 10:
        # estaciones con pocos datos: usar percentiles globales como fallback
        p_prof = np.percentile(df['profundidad_m'].dropna(), [low_pct, high_pct])
        p_dur = np.percentile(df['duracion_s'].dropna(), [low_pct, high_pct])
    else:
        p_prof = np.percentile(sub['profundidad_m'].dropna(), [low_pct, high_pct])
        p_dur = np.percentile(sub['duracion_s'].dropna(), [low_pct, high_pct])
    bounds[s] = {
        'prof_low': p_prof[0],
        'prof_high': p_prof[1],
        'dur_low': p_dur[0],
        'dur_high': p_dur[1]
    }

# 2) Asignar flags por fila
def flag_row(row):
    s = row['season']
    b = bounds.get(s, bounds[season_order[0]])
    prof = row['profundidad_m']
    dur = row['duracion_s']
    an_prof = (prof < b['prof_low']) or (prof > b['prof_high'])
    an_dur  = (dur  < b['dur_low'])  or (dur  > b['dur_high'])
    return pd.Series({
        'anom_prof_pct': int(an_prof),
        'anom_dur_pct': int(an_dur)
    })

df[['anom_prof_pct','anom_dur_pct']] = df.apply(flag_row, axis=1)

# 3) Clase de anomalía (texto)
def tipo_anom(row):
    p = row['anom_prof_pct']
    d = row['anom_dur_pct']
    if p and d:
        return 'ambas'
    elif p:
        return 'profundidad'
    elif d:
        return 'duracion'
    else:
        return 'normal'

df['tipo_anom_pct'] = df.apply(tipo_anom, axis=1)

# 4) Preparar colores y marcadores
station_colors = {
    'Invierno': 'blue',
    'Primavera': 'green',
    'Verano': 'orange',
    'Otoño': 'purple'
}

# Borde por foca (stable colormap)
focas = sorted(df['id_foca'].unique())
cmap = plt.cm.get_cmap('tab20', max(1, len(focas)))
foca_colors = {foca: cmap(i) for i, foca in enumerate(focas)}

# Marcadores por tipo de anomalía
marker_map = {
    'normal': 'o',
    'profundidad': 's',  # square
    'duracion': 'D',     # diamond
    'ambas': 'X'         # X
}

size_map = {
    'normal': 40,
    'profundidad': 70,
    'duracion': 70,
    'ambas': 90
}

# 5) Graficar por subconjuntos para controlar marker/size/borde
plt.figure(figsize=(11,8))

for tipo in ['normal','profundidad','duracion','ambas']:
    sub = df[df['tipo_anom_pct'] == tipo]
    if sub.empty:
        continue
    # Scatter: facecolor = estación, edgecolor = foca
    facecols = sub['season'].map(station_colors)
    edgecols = sub['id_foca'].map(foca_colors)
    plt.scatter(sub['profundidad_m'], sub['duracion_min'],
                s = sub.shape[0] * 0 + size_map[tipo],  # tamaño fijo por tipo
                marker = marker_map[tipo],
                c = list(facecols),
                edgecolors = list(edgecols),
                linewidths = 0.9,
                alpha = 0.6 if tipo == 'normal' else 0.95,
                label = tipo.capitalize() if tipo != 'normal' else 'Normal')

plt.xlabel('Profundidad (m)')
plt.ylabel('Duración (min)')
plt.title(f'Inmersiones: anomalías por percentiles ({low_pct}%-{high_pct}%) — según estación')
plt.grid(alpha=0.25)
plt.tight_layout()

# 6) Leyenda: estaciones (relleno)
from matplotlib.lines import Line2D
legend_estaciones = [
    Line2D([0],[0], marker='o', color='w', label=lab,
           markerfacecolor=col, markersize=8)
    for lab,col in station_colors.items()
]

# 7) Leyenda: tipos de anomalía (marcadores)
legend_tipos = [
    Line2D([0],[0], marker=marker_map[t], color='k', label=t.capitalize(),
           markerfacecolor='w' if t!='normal' else 'k', markersize=8)
    for t in ['normal','profundidad','duracion','ambas']
]

# 8) Leyenda: focas (bordes) — si son muchas, será grande; puedes limitar si quieres
legend_focas = [
    Line2D([0],[0], marker='o', color=foca_colors[f], label=f'Foca {f}',
           markerfacecolor='white', markersize=7, markeredgewidth=2)
    for f in focas
]

all_handles = legend_estaciones + legend_tipos + legend_focas
plt.legend(handles=all_handles, bbox_to_anchor=(1.05,1), loc='upper left', ncol=1, fontsize='small')
print("\n=== SIGNIFICADO DE COLORES, FORMAS Y BORDES ===\n")

print("▶ COLORES DE RELLENO = ESTACIÓN")
print("   - Azul     → Invierno")
print("   - Verde    → Primavera")
print("   - Naranja  → Verano")
print("   - Morado   → Otoño\n")

print("▶ BORDE DEL PUNTO = FOCA")
print("   Cada foca tiene un color de borde distinto (mapa de colores tab20).")
print("   Sirve para ver qué foca realizó cada inmersión independientemente de la estación.\n")

print("▶ FORMA DEL MARCADOR = TIPO DE ANOMALÍA")
print("   - Círculo (o)     → Inmersión NORMAL")
print("   - Cuadrado (s)    → Anomalía por PROFUNDIDAD")
print("   - Diamante (D)    → Anomalía por DURACIÓN")
print("   - X grande (X)     → Anomalía en AMBAS: profundidad + duración\n")

print("▶ TAMAÑO DEL MARCADOR")
print("   - Más grande para anomalías (para distinguirlas).")
print("   - Más pequeño para inmersiones normales.\n")

print("Con esto puedes interpretar la gráfica completamente: ")
print("Estación → por el COLOR, Foca → por el BORDE, Tipo de anomalía → por la FORMA.\n")

plt.show()
df.to_csv("anomalias_percentiles_focas24.csv", index=True)#!


#==============================================================================
# ======================================
# DETECCIÓN AUTOMÁTICA DE FOCA CON POCO MOVIMIENTO
# ======================================

# Calcular variación espacial por foca
mov_stats = df.groupby('id_foca')[['lat','lon']].agg(['var','std'])
mov_stats.columns = ['lat_var','lat_std','lon_var','lon_std']
mov_stats['spread'] = mov_stats['lat_var'] + mov_stats['lon_var']

# IsolationForest usando solo el movimiento
from sklearn.ensemble import IsolationForest

iso_mov = IsolationForest(contamination=0.1, random_state=42)
mov_stats['iso_label'] = iso_mov.fit_predict(mov_stats[['lat_var','lon_var','spread']])

# Focas anómalas de movimiento
focas_anormales_mov = mov_stats[mov_stats['iso_label']==-1].index.tolist()

print("Focas detectadas con movimiento anómalo:", focas_anormales_mov)
# ======================================
# MAPA: SOLO FOCAS CON MOVIMIENTO ANÓMALO
# ======================================

plt.figure(figsize=(9,7))

# Focas detectadas con movimiento raro
focas_raras = focas_anormales_mov

# Colores para las raras
cmap = plt.cm.get_cmap('tab10', len(focas_raras))
color_map = {foca: cmap(i) for i, foca in enumerate(focas_raras)}

# --- 1) focas normales = gris ---
focas_normales = [f for f in df['id_foca'].unique() if f not in focas_raras]

df_norm = df[df['id_foca'].isin(focas_normales)]
plt.scatter(df_norm['lon'], df_norm['lat'],
            s=4, alpha=0.08, color='lightgray', label='Focas normales')

# --- 2) focas anómalas = color ---
for f in focas_raras:
    sub = df[df['id_foca']==f]
    plt.scatter(sub['lon'], sub['lat'],
                s=18, alpha=0.9, color=color_map[f],
                label=f"{f} — movimiento anómalo")

plt.xlabel("Lon")
plt.ylabel("Lat")
plt.title("Foca(s) detectada(s) con movimiento anómalo ")
plt.grid(alpha=0.25)
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.show()
# -------------------------
# 7) CLUSTERING
# -------------------------

X = df[['profundidad_m','duracion_s','indice_actividad']]
kmeans = KMeans(n_clusters=3, random_state=42, n_init=20)
df['cluster'] = kmeans.fit_predict(X)

centroids = pd.DataFrame(kmeans.cluster_centers_,
                         columns=['profundidad_m','duracion_s','indice_actividad'])

print("\nCentroides KMeans:\n", centroids)

plt.figure(figsize=(9,6))
for c in sorted(df['cluster'].unique()):
    sub = df[df['cluster']==c]
    plt.scatter(sub['profundidad_m'], sub['duracion_min'], s=4, label=f'Cluster {c}')
plt.xlabel('Profundidad (m)')
plt.ylabel('Duración (min)')
plt.title('Clusters de comportamiento')
plt.legend()
plt.grid(True, alpha=0.25)
plt.show()

# -------------------------
# 8) ACTIVIDAD DIARIA POR ESTACIÓN (promedio por estación)
# -------------------------
inmersiones_estacion_f1 = df_f.groupby('season').size().reindex(season_order)

plt.figure(figsize=(10,4))
plt.plot(season_order, inmersiones_estacion_f1, marker='o')
plt.ylabel('Número de inmersiones')
plt.title(f'Inmersiones por estación — {foca_demo}')
plt.grid(True, alpha=0.3)
plt.show()


# -------------------------
# 9) PRESAS vs FOCAS POR ESTACIÓN
# -------------------------

mean_season = df.groupby('season')[['profundidad_m','depth_prey_mean']].mean().reindex(season_order)

plt.figure(figsize=(10,5))
plt.plot(season_order, mean_season['profundidad_m'], marker='o', label='Focas')
plt.plot(season_order, mean_season['depth_prey_mean'], marker='o', label='Presas')
plt.xlabel('Estación')
plt.ylabel('Profundidad (m)')
plt.title('Profundidad estacional: focas vs presas')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()


# -------------------------
# 10) RESUMEN
# -------------------------



# Al final del script, después de calcular todo (incluyendo df con 'tipo_anom_pct', 'cluster', etc.)

# 1. Asegurarte de que las columnas estén listas
export_cols = [
    'id_foca', 'season', 'profundidad_m', 'duracion_min', 'duracion_s',
    'indice_actividad', 'peso_kg', 'BCI', 'lat', 'lon',
    'tipo_anom_pct', 'anom_prof_pct', 'anom_dur_pct',
    'cluster'  # si quieres mostrar clusters en gráfico
    # agrega más si las necesitas en tooltip: 'temp_agua_C', 'fish_density', etc.
]

# 2. Convertir a lista de dicts (formato JSON amigable)
data_for_frontend = df[export_cols].to_dict(orient='records')

# 3. También exportar datos agregados útiles
summary_data = {
    "season_order": season_order,
    "dives_per_season": df.groupby('season').size().reindex(season_order).to_dict(),
    "focas_unicas": df['id_foca'].unique().tolist(),
    "focas_anormales_mov": focas_anormales_mov,
    "centroides_kmeans": centroids.to_dict(orient='records'),
    "bounds_por_estacion": bounds  # los percentiles por estación
}

# 4. Guardar todo en un solo JSON
import json

output = {
    "raw_data": data_for_frontend,           # lista de inmersiones individuales (~ miles de filas)
    "summary": summary_data
}

with open('focas_baikal_data_for_react.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("¡Datos exportados a focas_baikal_data_for_react.json !")