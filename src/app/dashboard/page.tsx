"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { agregarGasto, obtenerGastos, eliminarGasto, editarGasto } from "../../firebaseGastos";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [monto, setMonto] = useState<number>(0);
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState("");
  const [notas, setNotas] = useState("");
  const [gastos, setGastos] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      cargarGastos();
    }
  }, [user, loading]);

  const cargarGastos = async () => {
    const datos = await obtenerGastos();
    setGastos(datos);
  };

  const limpiarFormulario = () => {
    setMonto(0);
    setCategoria("");
    setFecha("");
    setNotas("");
  };

  const handleAddGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    await agregarGasto({ monto, categoria, fecha, notas });
    limpiarFormulario();
    cargarGastos();
  };

  const handleEditarGasto = (gasto: any) => {
    setEditandoId(gasto.id);
    setMonto(gasto.monto);
    setCategoria(gasto.categoria);
    setFecha(gasto.fecha);
    setNotas(gasto.notas);
  };

  const handleUpdateGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoId) return;
    await editarGasto(editandoId, { monto, categoria, fecha, notas });
    setEditandoId(null);
    limpiarFormulario();
    cargarGastos();
  };

  const handleEliminarGasto = async (id: string) => {
    await eliminarGasto(id);
    cargarGastos();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar sesión</button>
      </div>

      <form onSubmit={editandoId ? handleUpdateGasto : handleAddGasto} className="mb-6 space-y-4">
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(+e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editandoId ? "Actualizar Gasto" : "Agregar Gasto"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Mis Gastos</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border p-2">Monto</th>
            <th className="border p-2">Categoría</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Notas</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => (
            <tr key={gasto.id}>
              <td className="border p-2">{gasto.monto}</td>
              <td className="border p-2">{gasto.categoria}</td>
              <td className="border p-2">{gasto.fecha}</td>
              <td className="border p-2">{gasto.notas}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEditarGasto(gasto)} className="text-blue-500">Editar</button>
                <button onClick={() => handleEliminarGasto(gasto.id)} className="text-red-500">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

