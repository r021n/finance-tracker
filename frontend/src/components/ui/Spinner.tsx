import { LoaderCircle } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "ld";
  className?: string;
}

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <LoaderCircle
      className={`animate-spin text-blue-600 ${sizes[size]} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
