import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong. Please try again",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex items-center justify-center size-16 bg-red-100 rounded-full mb-4">
        <AlertCircle
          className="size-8 text-red-600"
          role="img"
          aria-label="Error"
          aria-hidden={false}
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">Error</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">{message}</p>

      {onRetry && (
        <Button
          variant="secondary"
          onClick={onRetry}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Try Again
        </Button>
      )}
    </div>
  );
}
