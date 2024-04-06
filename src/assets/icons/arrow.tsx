import type { Type } from "@/utils/types";

export const DownArrowIcon = ({ style, ...rest }: Type<"svg">) => {
  return (
    <svg
      width="1.75em"
      height="1em"
      viewBox="0 0 140 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      {...rest}
    >
      <path
        d="M12.1023 1.47008e-06L7.17366e-05 12.1022L67.6905 79.7926L135.381 12.1022L123.279 1.44318e-07L67.6905 55.5882L12.1023 1.47008e-06Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const UpArrowIcon = ({ style, ...rest }: Type<"svg">) => {
  return (
    <svg
      width="1.75em"
      height="1em"
      viewBox="0 0 140 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      {...rest}
    >
      <path
        d="M12.1023 79.7925L7.17366e-05 67.6903L67.6905 -0.000139764L135.381 67.6903L123.279 79.7925L67.6905 24.2043L12.1023 79.7925Z"
        fill="currentColor"
      />
    </svg>
  );
};
