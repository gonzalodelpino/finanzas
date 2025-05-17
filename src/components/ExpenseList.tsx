"use client";

import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import ExpenseFilters from "./ExpenseFilters";

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

export default function ExpenseList() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState({ category: "", from: "", to: "" });
  const [loading, setLoading] = useState(true); // Para mostrar un mensaje de carga

  useEffect(() => {
    if (!user) return;

    let q = query(
      collection(firestore, "expenses"),
      where("uid", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLoading(false); // Datos cargados

      let filtered = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[];

      // Filtrado en el cliente
      if (filters.category) {
        filtered = filtered.filter((g) =>
          g.category.toLowerCase().includes(filters.category.toLowerCase())
        );
      }

      if (filters.from) {
        filtered = filtered.filter((g) => g.date >= filters.from);
      }

      if (filters.to) {
        filtered = filtered.filter((g) => g.date <= filters.to);
      }

      setExpenses(filtered);
    });

    return () => unsubscribe();
  }, [user, filters]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Mis Gastos</h2>

      <ExpenseFilters onFilterChange={setFilters} />

      {loading ? (
        <div className="text-center mt-4">Cargando gastos...</div>
      ) : (
        <>
          {expenses.length === 0 ? (
            <div className="text-center mt-4">No se encontraron gastos</div>
          ) : (
            <table
              className="w-full border-collapse border mt-4"
              aria-label="Lista de gastos"
            >
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Monto</th>
                  <th className="px-4 py-2">Categoría</th>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Notas</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((gasto) => (
                  <tr key={gasto.id}>
                    <td className="px-4 py-2">{gasto.amount} €</td>
                    <td className="px-4 py-2">{gasto.category}</td>
                    <td className="px-4 py-2">{gasto.date}</td>
                    <td className="px-4 py-2">{gasto.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

