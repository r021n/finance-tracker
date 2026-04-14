import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function Alert({ type, message }: AlertProps) {
  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border ${styles[type]}`}
    >
      {icons[type]}
      <p>{message}</p>
    </div>
  );
}
