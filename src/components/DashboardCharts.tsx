import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface Gasto {
  monto: number;
  categoria: string;
  fecha: string;
  notas?: string;
}

interface DashboardChartsProps {
  gastos: Gasto[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ gastos }) => {
  const dataByCategory = useMemo(() => {
    const resumen: Record<string, number> = {};

    gastos.forEach((gasto) => {
      resumen[gasto.categoria] = (resumen[gasto.categoria] || 0) + gasto.monto;
    });

    return Object.entries(resumen).map(([name, value]) => ({ name, value }));
  }, [gastos]);

  const dataByMonth = useMemo(() => {
    const resumen: Record<string, number> = {};

    gastos.forEach((gasto) => {
      const mes = new Date(gasto.fecha).toLocaleString("es-ES", {
        month: "long",
      });
      resumen[mes] = (resumen[mes] || 0) + gasto.monto;
    });

    return Object.entries(resumen).map(([month, value]) => ({ month, value }));
  }, [gastos]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4" id="categoria-title">
        Gastos por Categoría
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart aria-labelledby="categoria-title">
          <Pie
            data={dataByCategory}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <h2 className="text-xl font-bold mt-10 mb-4" id="meses-title">
        Gastos por Mes
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataByMonth} aria-labelledby="meses-title">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Bar dataKey="value" fill="#82ca9d" />
          <Tooltip />
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardCharts;

