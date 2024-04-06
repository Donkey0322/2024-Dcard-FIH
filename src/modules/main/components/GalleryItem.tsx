"use client";

import { Skeleton, Tooltip } from "antd";
import { formatRelative, parseISO } from "date-fns";
import { motion, usePresence } from "framer-motion";
import { gsap } from "gsap";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import type { IssueType } from "@/modules/main/types";
import type { Type } from "@/utils/types";

import { RippleButton } from "@/components/Button";
import Divider from "@/components/Divider";
import Markdown from "@/components/Markdown";
import { FETCH_ISSUE_ONETIME_NUMBER } from "@/constants/issue";
import { useOverflow } from "@/hooks/useElements";
import useUrl from "@/hooks/useUrl";
import {
  IssueBody,
  IssueBodyContent,
} from "@/modules/main/components/Issue/Body";
import Operation from "@/modules/main/components/Operation";
import { closeIssue } from "@/modules/main/services";
import theme from "@/providers/theme/theme";

import MoreIcon from "@/assets/icons/more";

interface Props extends Type<typeof GalleryItemContainer> {
  issue?: IssueType;
  index?: number;
}

const GalleryItemContainer = styled(motion.div)`
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

const Link = styled.a`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default function GalleryItem({
  issue,
  index,
  onClick: handleClick,
  ...rest
}: Props) {
  const [toolTipOpen, setToolTipOpen] = useState(false);

  const element = useRef<HTMLDivElement>(null);
  const { isOverflow, forceCheck } = useOverflow(element);

  const router = useRouter();
  const { url: infoIssueUrl } = useUrl({ mode: "info" }, `/post/${issue?.id}`);
  const { url: editIssueUrl } = useUrl({ mode: "edit" }, `/post/${issue?.id}`);

  const pathname = usePathname();
  const issueId = Number(pathname.split("/")?.[2]);
  useEffect(() => forceCheck(), [forceCheck, issueId]);
  const searchParams = useSearchParams();
  const repoName = searchParams.get("repo")?.split("&") ?? [];

  const handleEdit = () => {
    router.replace(editIssueUrl);
    setToolTipOpen(false);
  };

  const ref = useRef(null);
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      gsap.to(ref.current, {
        scale: 0,
        onComplete: () => safeToRemove?.(),
      });
    }
  }, [isPresent, safeToRemove]);

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
      key={issue?.id}
      onClick={(event) => {
        router.replace(infoIssueUrl);
        handleClick?.(event);
      }}
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      // exit={{ scale: 0, opacity: 0 }}
      transition={{
        duration: 0.8,
        delay: ((index ?? 0) % FETCH_ISSUE_ONETIME_NUMBER) * 0.15,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      {...rest}
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
        <IssueBodyContent
          ref={element}
          isOverflow={isOverflow}
          hasContent={!!issue?.body}
        >
          <Markdown>{issue?.body ?? "No content"}</Markdown>
        </IssueBodyContent>
      </GalleryItemBody>
      <GalleryItemFooterContainer>
        <GalleryItemFooterContent>
          <RippleButton
            category="link"
            palette="main"
            style={{ padding: 0, maxWidth: "50%" }}
          >
            <Link
              href={issue?.repository?.html_url ?? ""}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              {issue?.repository?.name ?? repoName}
            </Link>
          </RippleButton>
          {issue?.updated_at
            ? formatRelative(parseISO(issue.updated_at), new Date())
            : ""}
        </GalleryItemFooterContent>
      </GalleryItemFooterContainer>
    </GalleryItemContainer>
  );
}
