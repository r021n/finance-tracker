import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Wallet, ArrowLeftRight } from "lucide-react";
import { Link } from "react-router";

import { transactionsApi } from "../api/transactions";
import { useAuth } from "../contexts/useAuth";
import { formatCurrency } from "../lib/utils";
import MainLayout from "../components/layout/MainLayout";
import SummaryCard from "../components/dashboard/SummaryCard";
import TransactionCard from "../components/transaction/TransactionCard";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function DashboardPage() {
  const { user } = useAuth();

  const {
    data: transactionsResponse,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["transactions", 100],
    queryFn: () => transactionsApi.getAll({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const transactions = useMemo(() => {
    return transactionsResponse?.data ?? [];
  }, [transactionsResponse?.data]);

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-600 mt-1">Here is your financial overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          title="Balance"
          value={isPending ? "..." : formatCurrency(summary.balance)}
          icon={<Wallet className="w-6 h-6" />}
          colorClass={summary.balance >= 0 ? "text-blue-600" : "text-red-600"}
          bgClass={summary.balance >= 0 ? "bg-blue-100" : "bg-red-100"}
        />
        <SummaryCard
          title="Total Income"
          value={isPending ? "..." : formatCurrency(summary.totalIncome)}
          icon={<TrendingUp className="w-6 h-6" />}
          colorClass="text-green-600"
          bgClass="bg-green-100"
        />
        <SummaryCard
          title="Total Expense"
          value={isPending ? "..." : formatCurrency(summary.totalExpense)}
          icon={<TrendingDown className="w-6 h-6" />}
          colorClass="text-red-600"
          bgClass="bg-red-100"
        />

        <div className="card rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <Link
              to="/transactions"
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
            >
              <ArrowLeftRight className="w-4 h-4" />
              View All
            </Link>
          </div>

          {isPending ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : isError ? (
            <ErrorState
              message="Failed to load transactions"
              onRetry={() => refetch()}
            />
          ) : recentTransactions.length === 0 ? (
            <EmptyState
              icon={<ArrowLeftRight className="h-8 w-8" />}
              title="No transaction yet"
              description="Start by adding your first transaction."
              action={
                <Link
                  to="/transactions"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Add your first transaction
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
