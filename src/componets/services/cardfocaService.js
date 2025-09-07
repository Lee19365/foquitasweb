import { ref, set, get, child } from "firebase/database";
import { db } from "../firebase-config";
import { Foca } from "../models/cartasfocas_model";

// Guardar o actualizar una foca
export async function guardarFoca(foca) {
  await set(ref(db, 'focas/' + foca.id), foca.toJSON());
}

// Leer todas las focas
export async function cargarFocas() {
  const snapshot = await get(child(ref(db), 'focas'));
  if (snapshot.exists()) {
    const data = snapshot.val();
    // Convertimos los objetos planos a instancias de Foca
    return Object.values(data).map(Foca.fromJSON);
  }
  return [];
}
