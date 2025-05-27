'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Head from "next/head";

export default function Home() {
  const { user } = useAuth();  // Obtener el estado del usuario
  const router = useRouter();

  useEffect(() => {
    // Si el usuario no está autenticado, redirigir a la página de login
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Si el usuario no está autenticado, no renderizar nada aún
  if (!user) {
    return null; // o un componente de carga si prefieres mostrar algo mientras redirige
  }

  return (
    <>
      <Head>
        <title>Gestión de Gastos Personales</title>
        <meta name="description" content="Controla y analiza tus gastos personales con nuestra WebApp." />
      </Head>
      <div className="min-h-screen bg-background font-sans">
        {/* Encabezado */}
        <header className="bg-primary text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold">Mi App de Gastos Personales</h1>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="container mx-auto px-4 py-8">
          <section className="mb-8">
            <h2 className="text-2xl text-secondary font-semibold">
              Bienvenido a tu panel
            </h2>
            <p className="mt-2 text-gray-700">
              Aquí podrás visualizar tus gastos, añadir nuevos registros y exportar
              tus datos en PDF o CSV.
            </p>
          </section>

          {/* Ejemplo de listado de gastos */}
          <section>
            <h3 className="text-xl font-medium mb-4">Tus gastos recientes</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 text-left">Fecha</th>
                    <th className="py-2 px-4 text-left">Categoría</th>
                    <th className="py-2 px-4 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">16/05/2025</td>
                    <td className="py-2 px-4">Alimentación</td>
                    <td className="py-2 px-4 text-right">$20.00</td>
                  </tr>
                  {/* Puedes mapear aquí tus datos reales */}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* Pie de página */}
        <footer className="bg-primary text-white py-4 text-center">
          <p>© 2025 Mi App de Gastos Personales. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  );
}
