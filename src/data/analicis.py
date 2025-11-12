# Dependencias
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA
from sklearn.ensemble import IsolationForest

# ---------------------------------------------------------
# 1. Cargar datos simulados de focas
# ---------------------------------------------------------
# Ejemplo: simulación de 300 eventos de buceo
np.random.seed(42)
df = pd.DataFrame({
    'profundidad_media': np.random.normal(50, 20, 300),  # metros
    'duracion_buceo': np.random.normal(10, 5, 300),      # minutos
    'nivel_actividad': np.random.normal(7, 2, 300)       # escala 1–10
})

# ---------------------------------------------------------
# 2. Preprocesamiento
# ---------------------------------------------------------
caracteristicas = ['profundidad_media', 'duracion_buceo', 'nivel_actividad']
X = df[caracteristicas].dropna()

escala = StandardScaler()
X_escalado = escala.fit_transform(X)

# ---------------------------------------------------------
# 3. Método del codo
# ---------------------------------------------------------
wcss = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_escalado)
    wcss.append(kmeans.inertia_)

plt.plot(range(1, 11), wcss)
plt.title('Método del Codo - Focas')
plt.xlabel('Número de Clusters')
plt.ylabel('WCSS')
plt.show()

# ---------------------------------------------------------
# 4. Aplicar KMeans con k óptimo
# ---------------------------------------------------------
k_optimo = 3  # Suponiendo que el codo sugiere 3 grupos
kmeans = KMeans(n_clusters=k_optimo, random_state=42)
clusters = kmeans.fit_predict(X_escalado)
df['Cluster'] = clusters

# ---------------------------------------------------------
# 5. Visualización PCA
# ---------------------------------------------------------
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_escalado)

plt.scatter(X_pca[:, 0], X_pca[:, 1], c=clusters, cmap='viridis')
plt.title('Clusters de comportamiento en focas')
plt.xlabel('Componente Principal 1')
plt.ylabel('Componente Principal 2')
plt.colorbar(label='Cluster')
plt.show()

# ---------------------------------------------------------
# 6. Análisis de clusters
# ---------------------------------------------------------
print("Cantidad de registros por cluster:")
print(df['Cluster'].value_counts())

print("\nPromedios por cluster:")
print(df.groupby('Cluster')[caracteristicas].mean())

silhouette_avg = silhouette_score(X_escalado, clusters)
print("\nPuntuación Silhouette:", silhouette_avg)

centroides = pd.DataFrame(
    escala.inverse_transform(kmeans.cluster_centers_),
    columns=caracteristicas
)
print("\nCentroides en valores originales:")
print(centroides)

# ---------------------------------------------------------
# 7. Detección de anomalías (IA adicional)
# ---------------------------------------------------------
modelo_anomalias = IsolationForest(contamination=0.05, random_state=42)
df['anomalia'] = modelo_anomalias.fit_predict(X_escalado)

anomalías = df[df['anomalia'] == -1]
print("\nNúmero de anomalías detectadas:", len(anomalías))

plt.scatter(X_pca[:, 0], X_pca[:, 1], c=df['anomalia'], cmap='coolwarm')
plt.title('Detección de anomalías en focas')
plt.xlabel('Componente Principal 1')
plt.ylabel('Componente Principal 2')
plt.show()
