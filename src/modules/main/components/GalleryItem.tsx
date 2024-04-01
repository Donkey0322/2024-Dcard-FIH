"use client";

import { Tooltip } from "antd";
import { formatRelative, parseISO } from "date-fns";
import { useState } from "react";
import ReactMarkDown from "react-markdown";
import styled from "styled-components";

import type { Endpoints } from "@octokit/types";

import RippleButton from "@/components/Button/RippleButton";
import Divider from "@/components/Divider";
import { closeIssue } from "@/modules/main/components/services";
import theme from "@/providers/theme/theme";

import MoreIcon from "@/assets/icons/more";

interface Props {
  issue?: Endpoints["GET /issues"]["response"]["data"][number];
}

const GalleryItemContainer = styled.div`
  aspect-ratio: 4 / 2;
  width: 400px;
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
`;

const GalleryItemTitle = styled.div`
  font-size: large;
  font-weight: 500;
  margin: 0.5em 1em;
  display: flex;
  line-height: 2em;
  justify-content: space-between;
`;

const GalleryItemBody = styled.span`
  margin: 0.5em 1em;
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

const GalleryItemFooterContainer = styled.div`
  flex: 1;
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 1em;
  display: flex;
  flex-direction: column;
  justify-content: end;
`;

const GalleryItemFooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  border-top: 1px solid ${({ theme }) => theme.gray["500"]};
  color: ${({ theme }) => theme.gray["500"]};
`;

export default function GalleryItem({ issue }: Props) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCloseIssue = async () => {
    setDeleting(true);
    if (
      issue?.repository?.name &&
      issue?.repository?.owner?.login &&
      issue?.number
    )
      await closeIssue({
        repo: issue.repository.name,
        owner: issue.repository.owner.login,
        issue: issue.number,
      });
    setOpen(false);
    setDeleting(false);
  };

  return (
    <GalleryItemContainer>
      <GalleryItemTitle>
        {issue?.title}
        <Tooltip
          open={open}
          title={
            <RippleButton
              category="solid"
              palette="red"
              loading={deleting}
              onClick={() => {
                void handleCloseIssue();
              }}
            >
              刪除
            </RippleButton>
          }
          onOpenChange={() => setOpen((prev) => !prev)}
          trigger="click"
          color={theme.white}
        >
          <RippleButton category="icon" palette="gray">
            <MoreIcon></MoreIcon>
          </RippleButton>
        </Tooltip>
      </GalleryItemTitle>
      <Divider />
      <GalleryItemBody>
        <ReactMarkDown>{issue?.body}</ReactMarkDown>
      </GalleryItemBody>
      <GalleryItemFooterContainer>
        <GalleryItemFooterContent>
          <RippleButton category="link" palette="main" style={{ padding: 0 }}>
            <a href={issue?.repository?.html_url ?? ""} target="_blank">
              {issue?.repository?.name}
            </a>
          </RippleButton>
          {issue?.updated_at
            ? formatRelative(parseISO(issue.updated_at), new Date())
            : ""}
        </GalleryItemFooterContent>
      </GalleryItemFooterContainer>
    </GalleryItemContainer>
  );
}
