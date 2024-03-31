import type { HEX } from "@/utils/color/types";

export function hexToRgb(hex: HEX, alpha = 1) {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else throw new Error("Bad Hex");
}
