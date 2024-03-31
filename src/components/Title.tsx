"use client";

import Link from "next/link";
import styled from "styled-components";

import { rwdFontSize } from "@/utils/css";

type TitleProps = React.ComponentProps<typeof TitleWrapper>;

const TitleWrapper = styled.div`
  display: flex;
  column-gap: 4px;
  align-items: end;
  font-family: var(--contrail-one), sans-serif;
  ${rwdFontSize(30)};
  font-weight: 400;
  color: ${({ theme }) => theme.main[700]};
  cursor: pointer;
`;

export default function Title({ children, ...rest }: TitleProps) {
  return (
    <Link href={"/post"}>
      <TitleWrapper {...rest}>{children ?? "GitHub Post"} </TitleWrapper>
    </Link>
  );
}
