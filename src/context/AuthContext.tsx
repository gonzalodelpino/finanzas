"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { auth } from "../firebase"; // Importa la instancia de auth desde firebase.ts
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

// Definir el tipo de los valores del contexto
interface AuthContextType {
  user: User | null;  // Usuario autenticado o null si no está autenticado
  loading: boolean;   // Estado de carga, útil para mostrar un loader mientras se verifica la autenticación
  login: (email: string, password: string) => Promise<void>; // Función para loguearse
  logout: () => Promise<void>; // Función para hacer logout
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crear el provider que envolverá a toda la aplicación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Estado para el usuario autenticado
  const [loading, setLoading] = useState(true); // Estado para saber si estamos esperando la verificación de autenticación

  // Controlar el estado de autenticación del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Establece el usuario autenticado en el estado
      setLoading(false); // Una vez que se verifica el estado de autenticación, dejamos de estar en carga
    });

    return unsubscribe; // Limpiar el estado cuando el componente se desmonte
  }, []);

  // Función para hacer login
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password); // Intenta autenticar al usuario
    } catch (error) {
      throw error; // Manejar el error en la página de login
    }
  };

  // Función para hacer logout
  const logout = async () => {
    await signOut(auth); // Cierra la sesión del usuario
  };

  // Retorna el contexto con los valores del usuario, estado de carga, login y logout
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto en cualquier componente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
