import { use } from "react";
import { ToastContext } from "./ToastContext";

export function useToastContext() {
  const context = use(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}
