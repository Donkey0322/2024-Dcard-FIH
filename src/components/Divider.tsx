"use client";

import styled from "styled-components";

const DividerWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  &::before,
  &::after {
    content: "";
    margin: auto 0px;
    flex: 1;
    height: 1px;
    background-color: #808080;
  }
`;

const DividerText = styled.div`
  color: #808080;
  margin: 0 15px;
  font-size: 12px;
  font-weight: 400;
`;

export default function Divider({ text }: { text?: string }) {
  return (
    <DividerWrapper>
      {text ? <DividerText>{text}</DividerText> : null}
    </DividerWrapper>
  );
}
