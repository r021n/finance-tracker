import type { ReactNode } from "react";
import { ToastContext } from "./ToastContext";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ui/ToastContainer";

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, success, error, warning, info, removeToast } = useToast();

  return (
    <ToastContext value={{ success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext>
  );
}
