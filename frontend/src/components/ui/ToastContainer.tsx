import { X, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  onRemove,
}: ToastContainerProps) {
  const icons = {
    success: <CheckCircle className="size-5 text-green-600" />,
    error: <XCircle className="size-5 text-red-600" />,
    warning: <AlertCircle className="size-5 text-yellow-600" />,
    info: <Info className="size-5 text-blue-600" />,
  };

  const styles = {
    success: "bg-white border-green-200",
    error: "bg-white border-red-200",
    warning: "bg-white border-yellow-200",
    info: "bg-white border-blue-200",
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`flex items-center gap-4 p-4 rounded-xl border shadow-lg ${styles[toast.type]} animate-in fade-in slide-in-from-right-4 duration-300`}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm font-medium text-gray-900">
            {toast.message}
          </p>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup notifikasi"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
