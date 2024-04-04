"use client";

import { Skeleton, Tooltip } from "antd";
import { formatRelative, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styled from "styled-components";

import type { IssueType } from "@/modules/main/types";

import { RippleButton } from "@/components/Button";
import Divider from "@/components/Divider";
import Markdown from "@/components/Markdown";
import { useOverflow } from "@/hooks/useElements";
import useUrl from "@/hooks/useUrl";
import { IssueBody } from "@/modules/main/components/Issue/Body";
import Operation from "@/modules/main/components/Operation";
import { closeIssue } from "@/modules/main/services";
import theme from "@/providers/theme/theme";

import MoreIcon from "@/assets/icons/more";

interface Props {
  issue?: IssueType;
}

const GalleryItemContainer = styled.div`
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
`;

const GalleryItemTitle = styled.div`
  font-size: large;
  font-weight: 500;
  margin: 0.5em 1em;
  display: flex;
  line-height: 2em;
  justify-content: space-between;
`;

export const GalleryItemBody = styled(IssueBody)`
  margin: 0.5em 1em;
  max-height: 200px;
  min-height: 200px;
  overflow: hidden;
  position: relative;
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
  const [toolTipOpen, setToolTipOpen] = useState(false);

  const element = useRef<HTMLDivElement>(null);
  const isOverflow = useOverflow(element);

  const router = useRouter();
  const infoIssueUrl = useUrl({ mode: "info" }, `/post/${issue?.id}`);
  const editIssueUrl = useUrl({ mode: "edit" }, `/post/${issue?.id}`);

  const handleEdit = () => {
    router.replace(editIssueUrl);
    setToolTipOpen(false);
  };

  const handleClose = async () => {
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
    setToolTipOpen(false);
  };

  return (
    <GalleryItemContainer
      onClick={() => {
        router.replace(infoIssueUrl);
      }}
    >
      <GalleryItemTitle>
        {issue?.title}
        <Tooltip
          open={toolTipOpen}
          title={
            <Operation handleEdit={handleEdit} handleClose={handleClose} />
          }
          onOpenChange={() => setToolTipOpen((prev) => !prev)}
          trigger="click"
          color={theme.white}
          placement="bottom"
        >
          <RippleButton
            category="icon"
            palette="gray"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <MoreIcon></MoreIcon>
          </RippleButton>
        </Tooltip>
      </GalleryItemTitle>
      <Divider />
      <GalleryItemBody>
        {isOverflow === undefined && (
          <Skeleton
            active
            style={{ position: "absolute", backgroundColor: "white" }}
            paragraph={{ rows: 5 }}
          />
        )}
        {isOverflow && (
          <RippleButton
            category="outlined"
            palette="gray"
            style={{ lineHeight: "1em" }}
          >
            點擊以查看內容
          </RippleButton>
        )}
        <div
          ref={element}
          style={{ visibility: isOverflow ? "hidden" : "visible" }}
        >
          <Markdown>{issue?.body}</Markdown>
        </div>
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
