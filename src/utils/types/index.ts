import type { JSXElementConstructor } from "react";

export type Type<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<unknown>
> = React.ComponentProps<T>;
