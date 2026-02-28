# Simulación realista de focas del Lago Baikal (0–400 m)
# Con una foca herida (comportamiento anómalo)
# Y profundidad de peces más similar a la de la foca

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# -------------------------
# 1) Parámetros generales
# -------------------------
num_focas = 10
dias = 365
inmersiones_por_dia = (3, 12)
fecha_inicio = datetime(2023, 1, 1)

# Profundidad media estacional
prof_media_est = {
    'Invierno': 120,#120
    'Primavera': 90,
    'Verano': 60,
    'Otoño': 100
}

prof_std_est = {
    'Invierno': 70,
    'Primavera': 50,
    'Verano': 40,
    'Otoño': 60
}

# Duración media
dur_media_est = {
    'Invierno': 240,
    'Primavera': 200,
    'Verano': 140,
    'Otoño': 210
}

dur_std_est = {
    'Invierno': 90,
    'Primavera': 70,
    'Verano': 50,
    'Otoño': 80
}

# Temperaturas
temp_agua_est = {'Invierno': -1, 'Primavera': 1, 'Verano': 5, 'Otoño': 2}
temp_corp_est = {'Invierno': 36.5, 'Primavera': 36.8, 'Verano': 37, 'Otoño': 36.7}

# Individuales
peso_media = 80
peso_std = 10

bci_media = 5
bci_std = 1

fish_density_mean = 20
fish_density_std = 8

# -------------------------
# 2) Función estacional
# -------------------------
def get_season(month):
    if month in [12,1,2]:
        return 'Invierno'
    elif month in [3,4,5]:
        return 'Primavera'
    elif month in [6,7,8]:
        return 'Verano'
    else:
        return 'Otoño'

# ==========================================================
# ANOMALÍA CLIMÁTICA ESTE AÑO: VERANO MÁS FRÍO DE LO NORMAL
# ==========================================================
evento_anomalo = True  # activar/desactivar

if evento_anomalo:
    # Temperatura del agua cae -> presas bajan
    temp_agua_est['Verano'] = 2      # antes era 5 °C
    prof_media_est['Verano'] += 40   # focas siguen presas más profundas
    prof_std_est['Verano']  += 20    # más variabilidad

# -------------------------
# Elegir foca herida
# -------------------------
foca_herida = random.randint(1, num_focas)
print("Foca herida:", foca_herida)

# -------------------------
# 3) Generación de registros
# -------------------------
registros = []

for foca_id in range(1, num_focas + 1):

    individuo_factor = np.random.normal(1.0, 0.12)
    peso_foca = np.random.normal(peso_media, peso_std)
    bci_foca = np.random.normal(bci_media, bci_std)

    es_herida = (foca_id == foca_herida)

    for d in range(dias):
        fecha = fecha_inicio + timedelta(days=d)
        season = get_season(fecha.month)

        num_inmersiones_dia = np.random.randint(*inmersiones_por_dia)

        for _ in range(num_inmersiones_dia):

            # Timestamp
            hora = random.randint(0, 23)
            minuto = random.randint(0, 59)
            segundo = random.randint(0, 59)
            timestamp = datetime(
                fecha.year, fecha.month, fecha.day, hora, minuto, segundo
            )

            # -------------------------
            # PROFUNDIDAD
            # -------------------------
            if not es_herida:
                media = prof_media_est[season] * individuo_factor
                if season == 'Verano' and evento_anomalo and not es_herida:
                     media *= 1.3  # focas bajan ~30% más profundo
                var = prof_std_est[season] ** 2
                shape = (media ** 2) / var
                scale = var / media
                prof_raw = np.random.gamma(shape, scale) + np.random.normal(0, 5)
                prof = float(np.clip(prof_raw, 5.0, 380.0))
            else:
                # herida = muy superficial y limitada
                prof = float(np.clip(np.random.normal(20, 10), 5, 60))

            # -------------------------
            # DURACIÓN
            # -------------------------
            if not es_herida:
                dur_base = np.random.normal(dur_media_est[season], dur_std_est[season])
                dur = float(max(20.0, dur_base + 0.6 * prof + np.random.normal(0, 15)))
            else:
                # inmersiones cortas y erráticas
                dur = float(np.clip(np.random.normal(60, 40), 15, 200))

            # -------------------------
            # TEMPERATURAS
            # -------------------------
            if not es_herida:
                temp_agua = float(np.random.normal(temp_agua_est[season], 0.5))
                temp_corp = float(np.random.normal(temp_corp_est[season], 0.2))
            else:
                temp_agua = float(np.random.normal(temp_agua_est[season], 0.5))
                temp_corp = float(np.random.normal(36.1, 0.15))  # leve hipotermia

            # -------------------------
            # ACTIVIDAD
            # -------------------------
            if not es_herida:
                indice_actividad = float(np.clip(np.random.normal(0.7, 0.2), 0, 1))
            else:
                indice_actividad = float(np.clip(np.random.normal(0.2, 0.1), 0, 0.4))

            # -------------------------
            # DENSIDAD DE PECES
            # -------------------------
            if not es_herida:
                fish_density = float(max(0, np.random.normal(fish_density_mean, fish_density_std)))
            else:
                fish_density = float(max(0, np.random.normal(5, 2)))  # come mal

            # -------------------------
            # PROFUNDIDAD DE PRESAS (similar a la foca)
            # -------------------------
            if season == 'Verano' and evento_anomalo:
                shift = np.random.uniform(30, 30)
                factor_presas = np.random.uniform(1.0, 1.3)
                depth_prey_raw = prof * factor_presas + shift + np.random.normal(0, 6)
            
            else:
                factor_presas = np.random.uniform(0.85, 1.1)
                depth_prey_raw = prof * factor_presas + np.random.normal(0, 3)
            depth_prey = float(np.clip(depth_prey_raw, 5.0, 380.0))

            # -------------------------
            # COORDENADAS
            # -------------------------
            if not es_herida:
                lat = float(53.5 + np.random.normal(0, 0.12))
                lon = float(108 + np.random.normal(0, 0.12))
            else:
                # casi no se mueve
                lat = float(53.5 + np.random.normal(0, 0.005))
                lon = float(108 + np.random.normal(0, 0.005))

            # Guardar registro
            registros.append({
                'id_foca': f'Foca_{foca_id}',
                'timestamp': timestamp.isoformat(sep=' '),
                'season': season,
                'duracion_s': dur,
                'profundidad_m': prof,
                'temp_agua_C': temp_agua,
                'temp_corpora_C': temp_corp,
                'lat': lat,
                'lon': lon,
                'indice_actividad': indice_actividad,
                'fish_density': fish_density,
                'depth_prey_mean': depth_prey,
                'peso_kg': peso_foca,
                'BCI': bci_foca
            })

# -------------------------
# 4) Guardar CSV
# -------------------------
df_sim = pd.DataFrame(registros)
df_sim.to_csv("simulacion_focas.csv", index=False)

print("CSV generado:", df_sim.shape)

