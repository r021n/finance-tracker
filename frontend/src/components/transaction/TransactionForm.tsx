import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import { categoriesApi } from "../../api/categories";
import type { Transaction } from "../../types";
import {
  transactionSchema,
  type TransactionFormData,
} from "../../lib/validation";
import { formatDateInput, getTodayDate } from "../../lib/utils";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  isLoading: boolean;
  defaultValues?: Transaction;
  onCancel: () => void;
}

export default function TransactionForm({
  onSubmit,
  isLoading,
  defaultValues,
  onCancel,
}: TransactionFormProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoriesApi.getAll();
      return res.data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    mode: "onBlur",
    defaultValues: {
      category_id: 0,
      type: "expense",
      amount: 0,
      note: "",
      date: getTodayDate(),
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        category_id: defaultValues.category_id,
        type: defaultValues.type,
        amount: defaultValues.amount,
        note: defaultValues.note ?? "",
        date: formatDateInput(defaultValues.date),
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
          Type
        </label>
        <select
          {...register("type")}
          className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-zinc-900/10 ${errors.type ? "border-red-500 focus:ring-red-500/20" : "border-zinc-300"}`}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
          Category
        </label>
        <select
          {...register("category_id", { valueAsNumber: true })}
          className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-zinc-900/10 ${errors.category_id ? "border-red-500 focus:ring-red-500/20" : "border-zinc-300"}`}
        >
          <option value={0} disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-xs text-red-600">
            {errors.category_id.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <Input
        label="Amount (IDR)"
        type="number"
        inputMode="numeric"
        placeholder="50000"
        error={errors.amount?.message}
        {...register("amount", { valueAsNumber: true })}
      />

      {/* Date */}
      <Input
        label="Date"
        type="date"
        error={errors.date?.message}
        {...register("date")}
      />

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
          Note (optional)
        </label>
        <textarea
          rows={3}
          placeholder="Add a note..."
          {...register("note")}
          className={`w-full resize-none rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-zinc-900/10 ${errors.note ? "border-red-500 focus:ring-red-500/20" : "border-zinc-300"}`}
        />
        {errors.note && (
          <p className="mt-1 text-xs text-red-600">{errors.note.message}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
