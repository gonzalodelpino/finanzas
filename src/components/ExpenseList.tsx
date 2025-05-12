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

  useEffect(() => {
    if (!user) return;

    let q = query(
      collection(firestore, "expenses"),
      where("uid", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
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

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th>Monto</th>
            <th>Categoría</th>
            <th>Fecha</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((gasto) => (
            <tr key={gasto.id}>
              <td>{gasto.amount} €</td>
              <td>{gasto.category}</td>
              <td>{gasto.date}</td>
              <td>{gasto.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
