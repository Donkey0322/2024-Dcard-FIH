"use client";

import { usePathname, useSearchParams } from "next/navigation";

export default function useUrl(
  newParams?: Record<string, string>,
  destination?: string,
  options?: { delete?: string[] }
) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  if (newParams)
    for (const [key, value] of Object.entries(newParams))
      params.set(key, value);

  if (options) {
    if (options.delete) for (const key of options.delete) params.delete(key);
  }

  return `${destination ?? pathname}?${params.toString()}`;
}
