import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ArrowLeftRight } from "lucide-react";

import { transactionsApi, type TransactionFilter } from "../api/transactions";
import type { Transaction } from "../types";
import type { TransactionFormData } from "../lib/validation";
import MainLayout from "../components/layout/MainLayout";
import TransactionCard from "../components/transaction/TransactionCard";
import TransactionForm from "../components/transaction/TransactionForm";
import TransactionFilterComponent from "../components/transaction/TransactionFilter";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function TransactionsPage() {
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<TransactionFilter>({
    page: 1,
    limit: 10,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["transactions", filter],
    queryFn: () => transactionsApi.getAll(filter),
  });

  const transactions = data?.data || [];
  const meta = data?.meta;

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const createMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsCreateModalOpen(false);
      showSuccess("Transaction created successfully");
    },
    onError: (err: any) => {
      showError(err?.response?.data?.message || "Failed to create transaction");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      transactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setEditingTransaction(null);
      showSuccess("Transaction updated successfully");
    },
    onError: (err: any) => {
      showError(err?.response?.data?.message || "Failed to update transaction");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setDeletingTransaction(null);
      showSuccess("Transaction deleted successfully");
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || "Failed to delete transaction");
    },
  });

  const handleCreateSubmit = (data: TransactionFormData) => {
    createMutation.mutate({
      category_id: data.category_id,
      type: data.type,
      amount: data.amount,
      note: data.note,
      date: data.date,
    });
  };

  const handleEditSubmit = (data: TransactionFormData) => {
    updateMutation.mutate({
      id: editingTransaction.id,
      data: {
        category_id: data.category_id,
        type: data.type,
        amount: data.amount,
        note: data.note || "",
        date: data.date,
      },
    });
  };

  const handleFilterChange = (newFilter: TransactionFilter) => {
    setFilter({ ...newFilter, page: 1, limit: 10 });
  };

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
          <p className="text-gray-600 mt-1">Manage your income and expenses</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {successMessage && (
        <div className="mb-4">
          <Alert type="success" message={successMessage} />
        </div>
      )}

      {errorMessage && (
        <div className="mb-4">
          <Alert type="error" message={errorMessage} />
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {meta ? `${meta.total_items} transactions found` : "Loading..."}
          </p>
          <TransactionFilterComponent onFilterChange={handleFilterChange} />
        </div>

        {isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No transactions found</p>
            <p className="text-sm mt-1">
              Try adjusting the filter or add a new transaction
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onEdit={(t) => setEditingTransaction(t)}
                onDelete={(t) => setDeletingTransaction(t)}
              />
            ))}
          </div>
        )}

        {meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Transaction"
      >
        <TransactionForm
          onSubmit={handleCreateSubmit}
          isLoading={createMutation.isPending}
          onCancel={() => setIsCreateModalOpen}
        />
      </Modal>

      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Edit Transaction"
      >
        <TransactionForm
          onSubmit={handleEditSubmit}
          isLoading={updateMutation.isPending}
          defaultValues={editingTransaction || undefined}
          onCancel={() => setEditingTransaction(null)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={() =>
          deletingTransaction &&
          deleteMutation.mutate({ id: deletingTransaction.id })
        }
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </MainLayout>
  );
}
