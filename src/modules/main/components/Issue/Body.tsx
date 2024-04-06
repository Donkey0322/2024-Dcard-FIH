"use client";

import { styled } from "styled-components";

export const IssueBody = styled.div`
  & ul {
    margin-left: 1em;
  }
  & img {
    width: 100%;
  }
  &,
  & * {
    line-height: 2em;
  }
`;

export const IssueBodyContent = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isOverflow", "hasContent"].includes(prop),
})<{
  isOverflow?: boolean;
  hasContent?: boolean;
}>`
  visibility: ${({ isOverflow }) => (isOverflow ? "hidden" : "visible")};
  ${({ hasContent, theme }) => !hasContent && `color: ${theme.gray[500]}`}
`;
