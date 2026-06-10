import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { Filter, X } from "lucide-react";

import { categoriesApi } from "../../api/categories";
import type { TransactionFilter as FilterType } from "../../api/transactions";
import Button from "../ui/Button";

interface TransactionFilterProps {
  onFilterChange: (filter: FilterType) => void;
}

export default function TransactionFilter({
  onFilterChange,
}: TransactionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>({});
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoriesApi.getAll();
      return res.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleApply = () => {
    onFilterChange(filter);
    setIsOpen(false);
  };

  const handleReset = () => {
    const empty: FilterType = {};
    setFilter(empty);
    onFilterChange(empty);
    setIsOpen(false);
  };

  const activeFilterCount = Object.values(filter).filter(
    (v) => v !== undefined && v !== "" && v !== 0,
  ).length;

  const getDropdownStyle = () => {
    if (!triggerRef.current) return {};
    const rect = triggerRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    };
  };

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        <Filter className="h-4 w-4" />
        Filter
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen &&
        createPortal(
          <>
            {/* Backdrop to close on outside click */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div
              style={getDropdownStyle()}
              className="fixed z-50 w-80 rounded-xl border border-zinc-200 bg-white p-4 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900">
                  Filter Transaction
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 transition hover:text-zinc-600"
                >
                  <X className="x-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Type
                  </label>
                  <select
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-zinc-900/10"
                    value={filter.type ?? ""}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        type: (e.target.value as FilterType["type"]) || undefined,
                      })
                    }
                  >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Category
                  </label>
                  <select
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transaction focus:ring-2 focus:ring-zinc-900/10"
                    value={filter.category_id ?? ""}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        category_id: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-zinc-900/10"
                    value={filter.start_date ?? ""}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        start_date: e.target.value || undefined,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-zinc-900/10"
                    value={filter.end_date ?? ""}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        end_date: e.target.value || undefined,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Min Amount (IDR)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-zinc-900/10"
                    value={filter.min_amount ?? ""}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        min_amount: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Max Amount (IDR)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-zinc-900/10"
                    value={filter.max_amount ?? ""}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        max_amount: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="secondary" className="flex" onClick={handleReset}>
                  Reset
                </Button>
                <Button className="flex-1" onClick={handleApply}>
                  Apply
                </Button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
