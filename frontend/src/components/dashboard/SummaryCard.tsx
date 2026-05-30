import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  colorClass: string;
  bgClass: string;
}

export default function SummaryCard({
  title,
  value,
  icon,
  colorClass,
  bgClass,
}: SummaryCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-full ${bgClass} shrink-0`}
      >
        <div className={colorClass}>{icon}</div>
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
}
