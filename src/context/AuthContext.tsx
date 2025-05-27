"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { auth } from "../firebase"; // Importa la instancia de auth desde firebase.ts
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

// Definir el tipo de los valores del contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crear el provider que envolverá a toda la aplicación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Controlar el estado de autenticación del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; // Limpiar el estado cuando el componente se desmonte
  }, []);

  // Función para hacer login
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error; // Manejar el error en la página de login
    }
  };

  // Función para hacer logout
  const logout = async () => {
    await signOut(auth);
  };

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
