'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9c27b0', '#f44336'];

export default function AnalisisPage() {
  const { user } = useAuth();
  const [gastos, setGastos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<any | null>(null);

  useEffect(() => {
    const fetchGastos = async () => {
      if (!user) return;

      const start = Date.now();

      try {
        const querySnapshot = await getDocs(collection(db, 'gastos'));
        const userGastos = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((gasto) => gasto.usuarioId === user.uid); // Asegúrate de que 'usuarioId' es el campo correcto

        if (userGastos.length === 0) {
          setError('No se encontraron gastos registrados.');
        }

        setGastos(userGastos);
      } catch (error) {
        console.error(error);
        setError('Error al cargar los gastos.');
      } finally {
        const elapsed = Date.now() - start;
        const delay = Math.max(1000 - elapsed, 0);
        setTimeout(() => {
          setLoading(false);
          toast.success('Gastos cargados correctamente');
        }, delay);
      }
    };

    fetchGastos();
  }, [user]);

  const agruparPorCategoria = () => {
    const categoriaMap: Record<string, number> = {};
    gastos.forEach((gasto) => {
      categoriaMap[gasto.categoria] = (categoriaMap[gasto.categoria] || 0) + gasto.monto;
    });
    return Object.keys(categoriaMap).map((categoria) => ({
      name: categoria,
      value: categoriaMap[categoria],
    }));
  };

 const agruparPorMes = () => {
  const mesMap: Record<string, number> = {};
  gastos.forEach((gasto) => {
    const fecha = gasto.fecha?.toDate ? gasto.fecha.toDate() : new Date(gasto.fecha);
    const mes = fecha.toLocaleString('default', { month: 'long' });
    mesMap[mes] = (mesMap[mes] || 0) + gasto.monto;
  });
  return Object.keys(mesMap).map((mes) => ({ name: mes, value: mesMap[mes] }));
};

const agruparPorFecha = () => {
  const fechaMap: Record<string, { timestamp: number, total: number }> = {};

  gastos.forEach((gasto) => {
    const fecha = gasto.fecha?.toDate ? gasto.fecha.toDate() : new Date(gasto.fecha);
    const fechaStr = fecha.toLocaleDateString();

    if (!fechaMap[fechaStr]) {
      fechaMap[fechaStr] = { timestamp: fecha.getTime(), total: 0 };
    }

    fechaMap[fechaStr].total += gasto.monto;
  });

  return Object.entries(fechaMap)
    .map(([fechaStr, { timestamp, total }]) => ({
      name: fechaStr,
      value: total,
      timestamp,
    }))
    .sort((a, b) => a.timestamp - b.timestamp); // ← Ordenar por fecha ascendente
};



  const dataPorCategoria = agruparPorCategoria();
  const dataPorMes = agruparPorMes();
  const dataPorFecha = agruparPorFecha();

  const calculateSummary = (data: any[]) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const max = Math.max(...data.map(item => item.value));
    const min = Math.min(...data.map(item => item.value));

    return {
      total,
      max,
      min,
    };
  };

  const handleDataClick = (e: any) => {
    if (e) {
      const selected = e?.activePayload ? e.activePayload[0]?.payload : null;
      if (selected) {
        setSelectedData(selected);
      }
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Análisis de Gastos', 14, 22);
    doc.setFontSize(14);

    doc.text(`Total Gastado: $${calculateSummary(dataPorCategoria).total}`, 14, 30);
    doc.text(`Gasto Máximo: $${calculateSummary(dataPorCategoria).max}`, 14, 38);
    doc.text(`Gasto Mínimo: $${calculateSummary(dataPorCategoria).min}`, 14, 46);

    doc.text('Gastos por Categoría:', 14, 54);
    dataPorCategoria.forEach((item, index) => {
      doc.text(`${item.name}: $${item.value}`, 14, 62 + (index * 8));
    });

    doc.save('analisis_gastos.pdf');
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Análisis de Gastos</h1>

      <button
        onClick={handleExportPDF}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg mb-6 shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out"
      >
        Exportar a PDF
      </button>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-600 font-medium">{error}</div>
      ) : (
        <div className="flex flex-col gap-12 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out text-white border border-blue-800">
              <h3 className="text-xl font-semibold text-center">Total Gastado</h3>
              <p className="text-3xl text-center mt-4">${calculateSummary(dataPorCategoria).total}</p>
            </div>
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out text-white border border-red-800">
              <h3 className="text-xl font-semibold text-center">Gasto Máximo</h3>
              <p className="text-3xl text-center mt-4">${calculateSummary(dataPorCategoria).max}</p>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-teal-700 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out text-white border border-green-800">
              <h3 className="text-xl font-semibold text-center">Gasto Mínimo</h3>
              <p className="text-3xl text-center mt-4">${calculateSummary(dataPorCategoria).min}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 w-full">
            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out border border-gray-300">
              <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">Gastos por Categoría</h2>
              <div className="w-full h-[480px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataPorCategoria}
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      dataKey="value"
                      label={false}
                      onClick={handleDataClick}
                    >
                      {dataPorCategoria.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out border border-gray-300">
              <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">Gastos por Mes</h2>
              <ResponsiveContainer width="100%" height={480}>
                <BarChart data={dataPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                  <YAxis tick={{ fontSize: 14 }} />
                  <Tooltip cursor={{ stroke: 'red', strokeWidth: 2 }} />
                  <Legend verticalAlign="bottom" height={36} />
                  <Bar dataKey="value" fill="#42a5f5" onClick={handleDataClick} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out w-full border border-gray-300">
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">Tendencia de Gastos</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dataPorFecha}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip cursor={{ stroke: 'red', strokeWidth: 2 }} />
                <Legend verticalAlign="bottom" height={36} />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
