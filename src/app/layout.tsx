"use client"; // Marca este archivo como componente de cliente

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
  // Aquí, el AuthProvider está envuelto correctamente, y el useAuth puede usarse dentro del componente
  return (
    <html lang="es">
      <head>
        <meta name="description" content="Controla y analiza tus gastos personales de forma sencilla." />
        <meta name="title" content="Mi WebApp de Gastos Personales" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        {/* El AuthProvider ahora envuelve todo */}
        <AuthProvider>
          <Toaster richColors />
          <AuthContent>{children}</AuthContent> {/* Solo muestra el contenido si el usuario está autenticado */}
        </AuthProvider>
      </body>
    </html>
  );
}

// Componente que maneja la lógica de autenticación
const AuthContent = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();  // Ahora usamos el hook dentro de un componente donde el contexto está disponible
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirigir a login si no está autenticado
    }
  }, [user, router]);

  // Mostrar contenido solo si hay un usuario autenticado
  if (!user) return null;

  return <>{children}</>;
};

