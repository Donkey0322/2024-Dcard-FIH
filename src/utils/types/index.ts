import type { JSXElementConstructor } from "react";

export type Type<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = React.ComponentProps<T>;
