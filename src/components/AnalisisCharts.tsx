'use client';

import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9c27b0', '#f44336'];

interface Gasto {
  id: string;
  usuarioId: string;
  categoria: string;
  monto: number;
  fecha: string; // Puede cambiar a `Date` si lo parseas antes
}

interface ChartData {
  name: string;
  value: number;
}

export default function AnalisisCharts() {
  const { user } = useAuth();
  const [gastos, setGastos] = useState<Gasto[]>([]);

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
    const fecha = new Date(gasto.fecha);
    const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;

    const existente = acc.find(item => item.name === mes);
    if (existente) {
      existente.value += gasto.monto;
    } else {
      acc.push({ name: mes, value: gasto.monto });
    }

    return acc;
  }, []).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Pie Chart */}
      <div>
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
      <div>
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
    </div>
  );
}

