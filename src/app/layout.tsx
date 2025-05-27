'use client';

import { Inter, Roboto_Mono } from "next/font/google";
import { AuthProvider } from "../context/AuthContext"; 
import { Toaster } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="description" content="Controla y analiza tus gastos personales de forma sencilla." />
        <meta name="title" content="Mi WebApp de Gastos Personales" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <AuthProvider>
          <Toaster richColors />
          {children} {/* Muestra siempre los hijos */}
        </AuthProvider>
      </body>
    </html>
  );
}

// Componente que maneja la lógica de autenticación
const AuthContent = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirige a login si no hay usuario autenticado
    }
  }, [user, router]);

  // Mostrar contenido solo si hay un usuario autenticado
  if (!user) return <div>Cargando...</div>; // Agregar un indicador de carga si aún no se tiene el estado del usuario

  return <>{children}</>;
};
