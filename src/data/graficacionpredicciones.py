# ============================================================
# COMPARACIÓN 2022-2023-2024 + PREDICCIÓN 2025
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.holtwinters import ExponentialSmoothing

# -----------------------------
# 1) Cargar archivos
# -----------------------------
archivos = {
    2022: "simulacion2022.csv",
    2023: "simulacion_focas.csv",
    2024: "simulacion_focas_baikal_realista2.csv"
}

dfs = []
for year, file in archivos.items():
    df = pd.read_csv(file)
    df["year"] = year
    dfs.append(df)

df_all = pd.concat(dfs, ignore_index=True)

# -----------------------------
# 2) Convertir columnas a numéricas
# -----------------------------
num_cols = ['profundidad_m','duracion_s','indice_actividad','fish_density',
            'depth_prey_mean','peso_kg','BCI']

df_all[num_cols] = df_all[num_cols].apply(pd.to_numeric, errors='coerce')

season_order = ['Invierno', 'Primavera', 'Verano', 'Otoño']

# -----------------------------
# 3) Tabla promedio por año + estación
# -----------------------------
tabla = df_all.groupby(['year','season'])[num_cols].mean().reset_index()
tabla_pivot = tabla.pivot(index='season', columns='year', values=num_cols)

# -----------------------------
# 4) Predicción 2025 por estación y variable
# -----------------------------
predicciones = {}

for variable in num_cols:
    predicciones[variable] = {}
    
    for season in season_order:
        serie = pd.Series({
            2022: tabla_pivot[variable][2022].loc[season],
            2023: tabla_pivot[variable][2023].loc[season],
            2024: tabla_pivot[variable][2024].loc[season]
        })

        model = ExponentialSmoothing(
            serie,
            trend='add',
            seasonal=None,
            initialization_method='estimated'
        ).fit()
        
        predicciones[variable][season] = model.forecast(1).iloc[0]

df_pred_2025 = pd.DataFrame(predicciones)
df_pred_2025.index = season_order
df_pred_2025["year"] = 2025

# -----------------------------
# 5) Construir tabla 2022–2025
# -----------------------------
tabla_larga = tabla.copy()
tabla_larga["year"] = tabla_larga["year"].astype(int)

# Agregar predicción 2025
tabla_pred = df_pred_2025.reset_index().rename(columns={'index':'season'})
tabla_total = pd.concat([tabla_larga, tabla_pred], ignore_index=True)

print("\n==============================")
print("Tabla completa 2022–2025")
print("==============================\n")
print(tabla_total.head(20))

tabla_total.to_csv("focas_2022_2025_completo.csv", index=False)

# -----------------------------
# 6) GRÁFICOS comparativos (años sin decimales)
# -----------------------------
for variable in ['profundidad_m','duracion_s','BCI','indice_actividad']:
    plt.figure(figsize=(10,5))
    
    for season in season_order:
        sub = tabla_total[tabla_total['season'] == season]
        
        # Convertir eje X a strings (evita 2022.5 o 2025.0)
        years_str = sub['year'].astype(str)
        
        plt.plot(years_str, sub[variable], marker='o', label=season)

    plt.title(f"Evolución estacional {variable} (2022–2025)")
    plt.xlabel("Año")
    plt.ylabel(variable)
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.show()
