import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Parámetros de simulación
num_focas = 20
dias = 365
inmersiones_por_dia = 8  # promedio
fecha_inicio = datetime(2024, 1, 1)

# Función para generar una inmersión realista
def generar_inmersion(id_foca, fecha):
    hora = random.randint(0, 23)
    minuto = random.randint(0, 59)
    timestamp = fecha + timedelta(hours=hora, minutes=minuto)

    duracion_s = np.random.normal(300, 100)   # 30–700 s aprox.
    profundidad_m = np.random.normal(80, 30)  # media 80 m
    temp_agua = np.random.uniform(-1, 10)     # agua fría
    temp_corp = np.random.uniform(36, 38)     # corporal
    lat = np.random.uniform(-60, -50)
    lon = np.random.uniform(-40, -20)
    indice_actividad = np.random.uniform(0, 10)  # g de acelerómetro

    # Variables relacionadas con las presas
    fish_density = np.random.uniform(10, 200)     # peces/m³
    depth_prey_mean = np.random.uniform(50, 120)  # m promedio de presas

    return {
        "id_foca": f"F{str(id_foca).zfill(2)}",
        "timestamp": timestamp,
        "duracion_s": round(max(duracion_s, 0), 2),
        "profundidad_m": round(max(profundidad_m, 0), 2),
        "temp_agua_C": round(temp_agua, 2),
        "temp_corpora_C": round(temp_corp, 2),
        "lat": round(lat, 3),
        "lon": round(lon, 3),
        "indice_actividad": round(indice_actividad, 2),
        "fish_density": round(fish_density, 2),
        "depth_prey_mean": round(depth_prey_mean, 2),
    }

# Generar datos simulados
datos = []
for id_foca in range(1, num_focas + 1):
    for dia in range(dias):
        fecha = fecha_inicio + timedelta(days=dia)
        num_inmersiones = np.random.poisson(inmersiones_por_dia)
        for _ in range(num_inmersiones):
            datos.append(generar_inmersion(id_foca, fecha))

# Crear DataFrame
df = pd.DataFrame(datos)

# Agregar ruido y algunos eventos anómalos
for i in np.random.choice(df.index, size=20, replace=False):
    df.loc[i, "duracion_s"] *= np.random.uniform(2, 4)  # buceo muy largo
    df.loc[i, "indice_actividad"] *= np.random.uniform(0.1, 0.5)  # baja actividad
    


# Mostrar resultados básicos
print("Muestra de datos simulados:")
print(df.head())

print("\nNúmero total de registros generados:", len(df))

df.to_csv("simulacion_focas_baikal.csv", index=False, encoding="utf-8-sig")




