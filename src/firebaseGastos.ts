// firebaseGastos.ts

import { db } from "./firebase";  // Aquí usamos 'db' que es la instancia de Firestore exportada desde 'firebase.ts'
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase";

const gastosRef = collection(db, "gastos");  // Asegúrate de usar 'db' aquí

// Agregar un nuevo gasto
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

// Obtener los gastos del usuario actual
export const obtenerGastos = async () => {
  const usuarioId = auth.currentUser?.uid;

  if (!usuarioId) {
    console.error("Usuario no autenticado al obtener gastos.");
    return [];
  }

  const q = query(gastosRef, where("usuarioId", "==", usuarioId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const docData = doc.data();
    
    // Convierte la fecha de Firebase Timestamp a un objeto Date
    const fecha = docData.fecha ? docData.fecha.toDate() : null; // Asegúrate de convertirla solo si existe
    
    return {
      id: doc.id,
      fecha,  // Aquí la fecha es un objeto Date válido
      monto: docData.monto,
      categoria: docData.categoria,
      notas: docData.notas,
      usuarioId: docData.usuarioId,
    };
  });
};

// Eliminar un gasto
export const eliminarGasto = async (id: string) => {
  try {
    await deleteDoc(doc(db, "gastos", id));  // Asegúrate de usar 'db' aquí
    console.log("Gasto eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
  }
};

// Editar un gasto existente
export const editarGasto = async (id: string, datos: any) => {
  try {
    await updateDoc(doc(db, "gastos", id), datos);  // Asegúrate de usar 'db' aquí
    console.log("Gasto actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
  }
};

