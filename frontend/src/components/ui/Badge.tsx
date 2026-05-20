import type { ReactNode } from "react";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default";

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-green-500/10 text-green-700 dark:bg-green-400/10 dark:text-green-400 ring-1 ring-inset ring-green-500/20",
    danger: "bg-red-500/10 text-red-700 dark:bg-red-400/10 dark:text-red-400 ring-1 ring-inset ring-red-500/20",
    warning: "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20",
    info: "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20",
    default: "bg-zinc-500/10 text-zinc-700 dark:bg-zinc-400/10 dark:text-zinc-400 ring-1 ring-inset ring-zinc-500/20",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
    return <span
        className={['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variantStyles[variant], className].join(' ').trim()}>
        {children}
    </span>
}