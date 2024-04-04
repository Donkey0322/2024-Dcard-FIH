import { Button } from "antd";
import styled, { css } from "styled-components";

import type { ButtonThemeProps, ButtonType } from "@/components/Button/theme";
import type { Type } from "@/utils/types";
import type { ReactNode } from "react";

import getTheme from "@/components/Button/theme";
import { flexCenter, rwdFontSize } from "@/utils/css";

interface RippleButtonProps<T extends ButtonType>
  extends ButtonThemeProps<T>,
    Type<typeof Button> {
  borderBox?: boolean;
  children?: ReactNode;
  buttonRef?: React.ForwardedRef<HTMLButtonElement>;
}

function ThemeButton<T extends ButtonType>({ ...rest }: RippleButtonProps<T>) {
  return <Button {...rest} />;
}

const RippleButtonBase = styled(ThemeButton).withConfig({
  shouldForwardProp: (prop) => !["borderBox"].includes(prop),
})<{ borderBox?: boolean }>`
  padding: 0.6em 1em;
  border-radius: 0.5em;
  width: fit-content;
  white-space: nowrap;
  box-sizing: ${({ borderBox }) => (borderBox ? "border-box" : "content-box")};
  line-height: 1em;
  ${flexCenter};
  ${rwdFontSize(16)};
  ${({ category, palette }) => getTheme({ category, palette })};
  ${({ category }) =>
    category === "icon"
      ? css`
          width: fit-content;
          aspect-ratio: 1;
          border-radius: 50% !important;
          border: none;
          padding: 0.5em !important;
        `
      : css`
          height: fit-content !important;
        `}
`;

export default function RippleButton<T extends ButtonType>({
  children,
  palette = "main",
  category,
  ...rest
}: RippleButtonProps<T>) {
  const type = ["link", "icon"].includes(category) ? "link" : undefined;
  return (
    <RippleButtonBase
      category={category}
      palette={palette as "main"}
      type={type}
      {...rest}
    >
      {children}
    </RippleButtonBase>
  );
}
