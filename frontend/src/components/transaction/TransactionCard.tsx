import { Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "../../types";
import { formatCurrency, formatDate } from "../../lib/utils";
import Badge from "../ui/Badge";

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionCard({
  transaction,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-2xl transition-colors hover:border-zinc-300">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`w-1.5 h-12 rounded-full shrink-0 ${isIncome ? "bg-emerald-500" : "bg-rose-500"}`}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={isIncome ? "success" : "danger"}>
              {transaction.type}
            </Badge>
            {transaction.category?.name && (
              <Badge variant="default">{transaction.category.name}</Badge>
            )}
          </div>
          <p className="text-sm text-zinc-500">
            {formatDate(transaction.date)}
          </p>
          {transaction.note && (
            <p className="mt-1 max-w-xs truncate text-sm text-zinc-600">
              {transaction.note}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pl-4">
        <p
          className={`text-lg font-semibold tabular-nums ${isIncome ? "text-emerald-600" : "text-rose-600"}`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Edit Transaction"
            onClick={() => onEdit(transaction)}
            className="p-2 text-zinc-400 rounded-xl transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Delete Transaction"
            onClick={() => onDelete(transaction)}
            className="p-2 text-zinc-400 rounded-xl transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
