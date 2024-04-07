"use client";

import { motion } from "framer-motion";
import styled from "styled-components";

import { IssueBody } from "@/modules/main/components/Body";

export const PostContainer = styled(motion.div)`
  width: 400px;
  max-width: 100%;
  border: 2px solid ${({ theme }) => theme.gray["500"]};
  border-radius: 1em;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex: 1;
  flex-basis: 400px;
  background-color: ${({ theme }) => theme.white};
  position: relative;
  cursor: pointer;
`;

export const PostTitle = styled.div`
  font-size: large;
  font-weight: 500;
  margin: 0.5em 1em;
  display: flex;
  line-height: 2em;
  justify-content: space-between;
`;

export const PostBody = styled(IssueBody)`
  margin: 0.5em 1em;
  max-height: 200px;
  min-height: 200px;
  overflow: hidden;
  position: relative;
`;

export const PostFooterContainer = styled.div`
  flex: 1;
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
  display: flex;
  flex-direction: column;
  justify-content: end;
`;

export const PostFooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  border-top: 1px solid ${({ theme }) => theme.gray["500"]};
  color: ${({ theme }) => theme.gray["500"]};
`;

export const Link = styled.a`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
