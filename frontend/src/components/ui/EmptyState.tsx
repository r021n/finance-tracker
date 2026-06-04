import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {/* Container icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
        <div className="text-gray-400">{icon}</div>
      </div>

      {/* Judul */}
      <h3 className="text-lg text-gray-900 mb-1 font-semibold ">{title}</h3>

      {/* Deskripsi opsional */}
      {description && (
        <p className="text-sm text-gray-500 max-w-sm">{description}</p>
      )}

      {/* Tombol aksi opsional */}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
