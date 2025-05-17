"use client";

import { useState } from "react";

type Props = {
  onFilterChange: (filters: { category: string; from: string; to: string }) => void;
};

export default function ExpenseFilters({ onFilterChange }: Props) {
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ category, from, to });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <input
          id="category"
          type="text"
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
          aria-label="Filtrar por categoría"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="from" className="block text-sm font-medium text-gray-700">
            Desde
          </label>
          <input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border p-2 rounded w-full"
            aria-label="Filtrar desde esta fecha"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">
            Hasta
          </label>
          <input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border p-2 rounded w-full"
            aria-label="Filtrar hasta esta fecha"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded mt-4"
        aria-label="Aplicar filtros"
      >
        Filtrar gastos
      </button>
    </form>
  );
}

