"use client";

import { styled } from "styled-components";

export const IssueBody = styled.div`
  & ul {
    margin-left: 1em;
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
  color: ${({ hasContent, theme }) => !hasContent && theme.gray[500]};
  & img {
    width: 100%;
  }
`;
