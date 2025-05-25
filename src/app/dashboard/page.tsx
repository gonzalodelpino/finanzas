'use client';

import { useState, useEffect } from 'react';
import {
  FaRegCreditCard, FaMoneyBillWave, FaCalendarAlt,
  FaBars, FaTimes, FaChartLine, FaSignOutAlt
} from 'react-icons/fa';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';
import AnalisisPage from '@/app/analisis/page';
import { useRouter } from 'next/navigation';

// Componentes auxiliares
function AgregarTarjeta({ nuevaTarjeta, setNuevaTarjeta, handleAgregarTarjeta }: any) {
  return (
    <div>
      <label className="block text-gray-700">Nueva Tarjeta</label>
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        value={nuevaTarjeta}
        onChange={(e) => setNuevaTarjeta(e.target.value)}
        placeholder="Ej. Tarjeta Visa"
      />
      <div className="text-center mt-4">
        <button
          onClick={handleAgregarTarjeta}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Agregar Tarjeta
        </button>
      </div>
    </div>
  );
}

function AgregarFecha({ nuevaFecha, setNuevaFecha, handleAgregarFecha }: any) {
  return (
    <div>
      <label className="block text-gray-700">Nueva Fecha</label>
      <input
        type="date"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        value={nuevaFecha}
        onChange={(e) => setNuevaFecha(e.target.value)}
      />
      <div className="text-center mt-4">
        <button
          onClick={handleAgregarFecha}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Agregar Fecha
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [gastos, setGastos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('gastos');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [nuevoGasto, setNuevoGasto] = useState({
    categoria: '',
    monto: '',
    fecha: '',
    notas: ''
  });

  const [tarjetas, setTarjetas] = useState<string[]>([]);
  const [nuevaTarjeta, setNuevaTarjeta] = useState<string>('');

  const [fechasImportantes, setFechasImportantes] = useState<Date[]>([]);
  const [nuevaFecha, setNuevaFecha] = useState<string>('');

  const fetchGastos = async () => {
    if (!user) return;
    try {
      const querySnapshot = await getDocs(collection(db, 'gastos'));
      const userGastos = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((gasto) => gasto.usuarioId === user.uid);

      setGastos(userGastos);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar los gastos');
    } finally {
      setTimeout(() => {
        setLoading(false);
        toast.success('Gastos cargados correctamente');
      }, 500);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, [user]);

  const handleAgregarGasto = async () => {
    if (!nuevoGasto.categoria || !nuevoGasto.monto || !nuevoGasto.fecha) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    try {
      await addDoc(collection(db, 'gastos'), {
        ...nuevoGasto,
        usuarioId: user?.uid,
        monto: parseFloat(nuevoGasto.monto),
        fecha: new Date(nuevoGasto.fecha),
      });
      toast.success('Gasto agregado correctamente');
      setNuevoGasto({
        categoria: '',
        monto: '',
        fecha: '',
        notas: ''
      });
      fetchGastos();
    } catch (error) {
      console.error(error);
      toast.error('Error al agregar el gasto');
    }
  };

  const handleEliminarGasto = async (id: string) => {
    try {
      const gastoRef = doc(db, 'gastos', id);
      await deleteDoc(gastoRef);
      toast.success('Gasto eliminado correctamente');
      fetchGastos();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar el gasto');
    }
  };

  const handleEditarGasto = async (id: string, updatedData: any) => {
    try {
      const gastoRef = doc(db, 'gastos', id);
      await updateDoc(gastoRef, updatedData);
      toast.success('Gasto actualizado correctamente');
      fetchGastos();
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el gasto');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      toast.success('Has cerrado sesión correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al cerrar sesión');
    }
  };

  const handleAgregarTarjeta = () => {
    if (!nuevaTarjeta) return;
    setTarjetas([...tarjetas, nuevaTarjeta]);
    setNuevaTarjeta('');
  };

  const handleEliminarTarjeta = (tarjeta: string) => {
    setTarjetas(tarjetas.filter((t) => t !== tarjeta));
  };

  const handleAgregarFecha = () => {
    if (!nuevaFecha) return;
    const nuevaFechaConvertida = new Date(nuevaFecha);
    setFechasImportantes([...fechasImportantes, nuevaFechaConvertida]);
    setNuevaFecha('');
  };

  const handleEliminarFecha = (fecha: Date) => {
    setFechasImportantes(fechasImportantes.filter((f) => f !== fecha));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menú lateral */}
      <div
        className={`fixed lg:relative top-0 left-0 min-h-screen bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ease-in-out transform ${
          menuAbierto ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-5">
          <h2 className="text-2xl font-bold text-center mb-10">Mi Banco</h2>
          <ul className="space-y-6">
            <li
              className={`flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
                activeMenu === 'tarjetas' ? 'bg-gray-700' : ''
              }`}
              onClick={() => {
                setActiveMenu('tarjetas');
                setMenuAbierto(false);
              }}
            >
              <FaRegCreditCard />
              <span>Tarjetas</span>
            </li>
            <li
              className={`flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
                activeMenu === 'gastos' ? 'bg-gray-700' : ''
              }`}
              onClick={() => {
                setActiveMenu('gastos');
                setMenuAbierto(false);
              }}
            >
              <FaMoneyBillWave />
              <span>Mis Gastos</span>
            </li>
            <li
              className={`flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
                activeMenu === 'calendario' ? 'bg-gray-700' : ''
              }`}
              onClick={() => {
                setActiveMenu('calendario');
                setMenuAbierto(false);
              }}
            >
              <FaCalendarAlt />
              <span>Calendario</span>
            </li>
            <li
              className={`flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
                activeMenu === 'analisis' ? 'bg-gray-700' : ''
              }`}
              onClick={() => {
                setActiveMenu('analisis');
                setMenuAbierto(false);
              }}
            >
              <FaChartLine />
              <span>Análisis</span>
            </li>
          </ul>
          <div className="mt-6 text-center">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 rounded-md cursor-pointer text-red-600 hover:bg-red-200"
            >
              <FaSignOutAlt />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Botón para móviles */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-3xl text-gray-800">
          {menuAbierto ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Contenido */}
      <main className="flex-1 p-6 overflow-y-auto max-h-screen transition-all duration-300 ease-in-out">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600"></h1>

        {loading ? (
          <Loader />
        ) : (
          <>
            {activeMenu === 'analisis' && <AnalisisPage />}

            {activeMenu === 'tarjetas' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-center">Mis Tarjetas</h2>
                <AgregarTarjeta
                  nuevaTarjeta={nuevaTarjeta}
                  setNuevaTarjeta={setNuevaTarjeta}
                  handleAgregarTarjeta={handleAgregarTarjeta}
                />
                <ul className="mt-6 space-y-2">
                  {tarjetas.map((tarjeta, index) => (
                    <li key={index} className="flex justify-between bg-gray-100 p-2 rounded-md">
                      <span>{tarjeta}</span>
                      <button
                        onClick={() => handleEliminarTarjeta(tarjeta)}
                        className="text-red-600"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeMenu === 'calendario' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-center">Fechas Importantes</h2>
                <AgregarFecha
                  nuevaFecha={nuevaFecha}
                  setNuevaFecha={setNuevaFecha}
                  handleAgregarFecha={handleAgregarFecha}
                />
                <ul className="mt-6 space-y-2">
                  {fechasImportantes.map((fecha, index) => (
                    <li key={index} className="flex justify-between bg-gray-100 p-2 rounded-md">
                      <span>{fecha.toLocaleDateString()}</span>
                      <button
                        onClick={() => handleEliminarFecha(fecha)}
                        className="text-red-600"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeMenu === 'gastos' && (
                          <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-center">Mis Gastos</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={nuevoGasto.categoria}
                    onChange={(e) => setNuevoGasto({ ...nuevoGasto, categoria: e.target.value })}
                    placeholder="Categoría"
                  />
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={nuevoGasto.monto}
                    onChange={(e) => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
                    placeholder="Monto"
                  />
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={nuevoGasto.fecha}
                    onChange={(e) => setNuevoGasto({ ...nuevoGasto, fecha: e.target.value })}
                  />
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={nuevoGasto.notas}
                    onChange={(e) => setNuevoGasto({ ...nuevoGasto, notas: e.target.value })}
                    placeholder="Notas"
                  />
                  <div className="text-center mt-4">
                    <button
                      onClick={handleAgregarGasto}
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                    >
                      Agregar Gasto
                    </button>
                  </div>
                </div>
                <ul className="mt-6 space-y-2">
                  {gastos.map((gasto) => (
                    <li key={gasto.id} className="flex justify-between bg-gray-100 p-2 rounded-md">
                      <div>
                        <div>{gasto.categoria}</div>
                        <div className="text-sm text-gray-600">{new Date(gasto.fecha.seconds * 1000).toLocaleDateString()}</div>
                      </div>
                      <span>{gasto.monto}€</span>
                      <button
                        onClick={() => handleEliminarGasto(gasto.id)}
                        className="text-red-600"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => handleEditarGasto(gasto.id, { categoria: 'Nueva categoría' })}
                        className="text-blue-600"
                      >
                        Editar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

