import type { MouseEvent } from "react";
import { useId, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Meta } from "../../types";

interface PaginationProps {
  meta: Meta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { current_page, total_pages, total_items, per_page } = meta;
  const labelId = useId();

  const startItem = (current_page - 1) * per_page + 1;
  const endItem = Math.min(current_page * per_page, total_items);

  const pages = useMemo(() => {
    if (total_pages <= 7)
      return Array.from({ length: total_pages }, (_, i) => i + 1);

    const delta = 1;
    const range: (number | "...")[] = [1];

    for (
      let i = Math.max(2, current_page - delta);
      i <= Math.min(total_pages - 1, current_page + delta);
      i++
    ) {
      range.push(i);
    }

    range.push(total_pages);

    return range.reduce<(number | "...")[]>((acc, cur, idx, arr) => {
      if (
        idx > 0 &&
        typeof cur === "number" &&
        typeof arr[idx - 1] === "number" &&
        cur - (arr[idx - 1] as number) > 1
      ) {
        acc.push("...");
      }
      acc.push(cur);
      return acc;
    }, []);
  }, [current_page, total_pages]);

  if (total_pages <= 1) return null;

  const handleClick = (page: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page !== current_page) onPageChange(page);
  };

  return (
    <nav
      aria-label="Pagination"
      aria-labelledby={labelId}
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p id={labelId} className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {total_items}
        </span>{" "}
        results
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleClick(current_page - 1)}
          disabled={current_page === 1}
          aria-label="Previous page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        >
          <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-zinc-500"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={handleClick(page)}
              aria-current={page === current_page ? "page" : undefined}
              aria-label={`Page ${page}`}
              className={[
                "h-9 min-w-9 rounded-lg px-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                page === current_page
                  ? "bg-blue-600 text-white hover:bg-blue-500 dark:hover:bg-blue-400"
                  : "border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800",
              ].join(" ")}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={handleClick(current_page + 1)}
          disabled={current_page === total_pages}
          aria-label="Next page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        >
          <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
