'use client';

import { useEffect, useState, useRef } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import { jsPDF } from 'jspdf';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9c27b0', '#f44336'];

interface Gasto {
  id: string;
  usuarioId: string;
  categoria: string;
  monto: number;
  fecha: any; // Se mantiene como `any` para manejar Timestamp
}

interface ChartData {
  name: string;
  value: number;
}

export default function AnalisisCharts() {
  const { user } = useAuth();
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const pieChartRef = useRef(null); // Referencia para el gráfico de Pie
  const barChartRef = useRef(null); // Referencia para el gráfico de Bar

  useEffect(() => {
    const fetchGastos = async () => {
      if (!user) return;

      try {
        const querySnapshot = await getDocs(collection(db, 'gastos'));
        const userGastos = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Gasto))
          .filter((gasto) => gasto.usuarioId === user.uid);

        setGastos(userGastos);
      } catch (error) {
        console.error('Error al obtener gastos:', error);
      }
    };

    fetchGastos();
  }, [user]);

  const dataPorCategoria: ChartData[] = gastos.reduce((acc, gasto) => {
    const existente = acc.find(item => item.name === gasto.categoria);
    if (existente) {
      existente.value += gasto.monto;
    } else {
      acc.push({ name: gasto.categoria, value: gasto.monto });
    }
    return acc;
  }, []);

  const dataPorMes: ChartData[] = gastos.reduce((acc, gasto) => {
    let fecha: Date;

    // Comprobar si la fecha es un Timestamp de Firestore
    if (gasto.fecha && gasto.fecha.toDate) {
      fecha = gasto.fecha.toDate(); // Convertir Timestamp a Date
    } else {
      fecha = new Date(gasto.fecha); // Si es un string ya es Date
    }

    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
      console.error("Fecha inválida para el gasto", gasto);
      return acc; // Ignorar este gasto si la fecha es inválida
    }

    // Formatear la fecha a DD/MM/YYYY
    const formattedDate = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
    const mes = formattedDate;

    const existente = acc.find(item => item.name === mes);
    if (existente) {
      existente.value += gasto.monto;
    } else {
      acc.push({ name: mes, value: gasto.monto });
    }

    return acc;
  }, []).sort((a, b) => a.name.localeCompare(b.name));

  // Función para exportar los gráficos a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text("Análisis de Gastos", 20, 20);

    // Exportar el gráfico de Pie
    if (pieChartRef.current) {
      const pieChartSVG = pieChartRef.current.querySelector("svg");
      if (pieChartSVG) {
        const svgData = new XMLSerializer().serializeToString(pieChartSVG);
        const imgData = 'data:image/svg+xml;base64,' + btoa(svgData);
        doc.addImage(imgData, "SVG", 20, 30, 180, 90);
      }
    }

    // Exportar el gráfico de Bar
    if (barChartRef.current) {
      const barChartSVG = barChartRef.current.querySelector("svg");
      if (barChartSVG) {
        const svgData = new XMLSerializer().serializeToString(barChartSVG);
        const imgData = 'data:image/svg+xml;base64,' + btoa(svgData);
        doc.addImage(imgData, "SVG", 20, 130, 180, 90);
      }
    }

    // Guardar el PDF
    doc.save("analisis_gastos.pdf");
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Pie Chart */}
      <div ref={pieChartRef}>
        <h2 className="text-xl font-semibold mb-2">Gastos por Categoría</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataPorCategoria}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {dataPorCategoria.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div ref={barChartRef}>
        <h2 className="text-xl font-semibold mb-2">Gastos por Mes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Botón para exportar a PDF */}
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        onClick={exportToPDF}
      >
        Exportar a PDF
      </button>
    </div>
  );
}

