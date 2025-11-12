import pandas as pd
import numpy as np

# === 1. CARGA DE DATOS ===
ruta = r"C:\Users\aceve\pagina focas\foquitasweb\simulacion_focas_baikal.csv"
df = pd.read_csv(ruta)

print("Datos cargados:", df.shape)
print(df.head(3))


# === 2. CORRECCIÓN DE NOMBRES DE COLUMNAS ===
# Hay un error de tipeo: temp_corpora_C → temp_corporal_C
df.rename(columns={'temp_corpora_C': 'temp_corporal_C'}, inplace=True)

# === 3. PARSEO DE FECHAS Y ORDEN ===
df['timestamp'] = pd.to_datetime(df['timestamp'])
df.sort_values(['id_foca', 'timestamp'], inplace=True)


# === 4. DETECCIÓN Y MANEJO DE NULOS ===
print("\nValores nulos antes de limpieza:")
print(df.isna().sum())

# Si existieran (por ejemplo si en el futuro agregas sensores que fallen):
df.fillna(method='ffill', inplace=True)  # reusar último valor válido
df.fillna(method='bfill', inplace=True)  # o siguiente si no hay anterior


# === 5. ELIMINAR O CORREGIR VALORES FUERA DE RANGO ===
# Definimos los límites biológicamente plausibles:
limites = {
    "duracion_s": (10, 900),
    "profundidad_m": (1, 450),
    "temp_agua_C": (-2, 10),
    "temp_corporal_C": (36, 39),
    "indice_actividad": (0, 10),
    "fish_density": (0, 300),
    "depth_prey_mean": (0, 400),
    "lat": (50, 55),     # rango geográfico real del Baikal
    "lon": (104, 110)
}

# Creamos una máscara booleana para detectar valores inválidos
for col, (minv, maxv) in limites.items():
    if col in df.columns:
        fuera_rango = (df[col] < minv) | (df[col] > maxv)
        if fuera_rango.any():
            print(f"{col}: {fuera_rango.sum()} valores fuera de rango.")
            # Podemos:
            # 1️ Reemplazarlos por NaN
            df.loc[fuera_rango, col] = np.nan
            # 2️ Rellenarlos luego con mediana del individuo
            df[col] = df.groupby('id_foca')[col].transform(
                lambda x: x.fillna(x.median())
            )

# === 6. ELIMINAR DUPLICADOS ===
df = df.drop_duplicates(subset=['id_foca', 'timestamp'])


# === 7. AGREGAR VARIABLES DERIVADAS ===
df['fecha'] = df['timestamp'].dt.date
df['hora'] = df['timestamp'].dt.hour

# Estación (según mes)
def obtener_estacion(mes):
    if mes in [12, 1, 2]:
        return 'Invierno'
    elif mes in [3, 4, 5]:
        return 'Primavera'
    elif mes in [6, 7, 8]:
        return 'Verano'
    else:
        return 'Otoño'

df['season'] = df['timestamp'].dt.month.apply(obtener_estacion)


# === 8. NORMALIZACIÓN / ESCALADO OPCIONAL ===

from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
cols_numericas = [
    'duracion_s', 'profundidad_m', 'temp_agua_C',
    'temp_corporal_C', 'indice_actividad', 'fish_density', 'depth_prey_mean'
]
df_scaled = df.copy()
df_scaled[cols_numericas] = scaler.fit_transform(df[cols_numericas])


# === 9. EXPORTAR ===
df.to_csv("simulacion_focas_baikal_limpio.csv", index=False, encoding='utf-8-sig')
print("\nDatos limpios guardados en 'simulacion_focas_baikal_limpio.csv'")

