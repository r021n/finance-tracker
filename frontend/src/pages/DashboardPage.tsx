import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Wallet, ArrowLeftRight } from "lucide-react";
import { Link } from "react-router";

import { transactionsApi } from "../api/transactions";
import { useAuth } from "../contexts/useAuth";
import { formatCurrency } from "../lib/utils";
import MainLayout from "../components/layout/MainLayout";
import SummaryCard from "../components/dashboard/SummaryCard";
import TransactionCard from "../components/transaction/TransactionCard";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: transactionsResponse, isPending } = useQuery({
    queryKey: ["transactions", 100],
    queryFn: () => transactionsApi.getAll({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const transactions = transactionsResponse?.data ?? [];

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

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
          value={formatCurrency(balance)}
          icon={<Wallet className="w-6 h-6" />}
          colorClass="text-blue-600"
          bgClass="bg-blue-100"
        />
        <SummaryCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="w-6 h-6" />}
          colorClass="text-green-600"
          bgClass="bg-green-100"
        />
        <SummaryCard
          title="Total Expense"
          value={formatCurrency(totalExpense)}
          icon={<TrendingDown className="w-6 h-6" />}
          colorClass="text-red-600"
          bgClass="bg-red-100"
        />

        <div className="card border border-gray-200">
          <div className="flex items-center justify-between mb-4">
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
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions yet</p>
              <Link
                to="/transactions"
                className="text-blue-600 hover:underline text-sm mt-2 block"
              >
                Add your first transaction
              </Link>
            </div>
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
