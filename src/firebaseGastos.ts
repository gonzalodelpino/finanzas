import { firestore } from "./firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase";

const gastosRef = collection(firestore, "gastos");

export const agregarGasto = async (gasto: any) => {
  const usuarioId = auth.currentUser?.uid;

  // Verificación adicional para saber si el usuario está autenticado
  console.log("Usuario autenticado:", usuarioId);  // Verifica si el usuario está autenticado

  if (!usuarioId) throw new Error("Usuario no autenticado");

  console.log("Agregando gasto:", gasto);  // Muestra los datos que se están enviando

  try {
    await addDoc(gastosRef, {
      ...gasto,
      usuarioId,
    });
    console.log("Gasto agregado correctamente");
  } catch (error) {
    console.error("Error al agregar gasto:", error);
  }
};

export const obtenerGastos = async () => {
  const usuarioId = auth.currentUser?.uid;
  
  if (!usuarioId) {
    console.error("Usuario no autenticado al obtener gastos.");
    return [];
  }

  const q = query(gastosRef, where("usuarioId", "==", usuarioId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const eliminarGasto = async (id: string) => {
  try {
    await deleteDoc(doc(firestore, "gastos", id));
    console.log("Gasto eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
  }
};

export const editarGasto = async (id: string, datos: any) => {
  try {
    await updateDoc(doc(firestore, "gastos", id), datos);
    console.log("Gasto actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
  }
};

