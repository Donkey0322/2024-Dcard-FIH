"use client";

import { ThemeProvider as Provider } from "styled-components";

import type { ReactNode } from "react";

import theme from "@/providers/theme/theme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return <Provider theme={theme}>{children}</Provider>;
}
