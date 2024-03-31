import type { HEX } from "@/utils/color/types";

type ThemeType = { [K in string]: HEX | ThemeType };

const theme = {
  main: {
    "100": "#D9F2F7" as HEX,
    "300": "#85BAD0" as HEX,
    "500": "#5988A1" as HEX,
    "700": "#284B63" as HEX,
  },
  gray: {
    "100": "#F4F4F4" as HEX,
    "300": "#EAEAEA" as HEX,
    "500": "#C2C2C2" as HEX,
    "700": "#858585" as HEX,
    "900": "#353535" as HEX,
  },
  sub: {
    "100": "#E0F7F1" as HEX,
    "300": "#98D4CD" as HEX,
    "500": "#6EA9A8" as HEX,
    "700": "#3C6E71" as HEX,
  },
  pink: {
    "100": "#FDF9F6" as HEX,
    "300": "#F5E5E1" as HEX,
    "500": "#E0C2C2" as HEX,
    "700": "#A1616C" as HEX,
  },
  red: {
    "100": "#FCE3D6" as HEX,
    "300": "#EE9684" as HEX,
    "500": "#DE6D62" as HEX,
    "700": "#C83434" as HEX,
  },
  blue: "#BCE8F0",
  dirt: "#CBC09F",
  white: "#FFFFFF",
  black: "#000000",
  brown: "#cbc09f",
} satisfies ThemeType;

export type Theme = typeof theme;

export default theme;
