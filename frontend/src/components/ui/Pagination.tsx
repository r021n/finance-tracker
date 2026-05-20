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
    ></nav>
  );
}
