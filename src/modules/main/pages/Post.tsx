"use client";

import { Skeleton, Tooltip } from "antd";
import { formatRelative, parseISO } from "date-fns";
import { usePresence } from "framer-motion";
import { gsap } from "gsap";
import { capitalize } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { IssueType } from "@/modules/main/types";
import type { Type } from "@/utils/types";

import { RippleButton } from "@/components/Button";
import Divider from "@/components/Divider";
import Markdown from "@/components/Markdown";
import { FETCH_ISSUE_ONETIME_NUMBER } from "@/constants/issue";
import { useOverflow } from "@/hooks/useElements";
import useUrl from "@/hooks/useUrl";
import { IssueBodyContent } from "@/modules/main/components/Body";
import {
  Link,
  PostBody,
  PostContainer,
  PostFooterContainer,
  PostFooterContent,
  PostTitle,
} from "@/modules/main/components/Item";
import Operation from "@/modules/main/components/Operation";
import { updateIssueState } from "@/modules/main/services";
import theme from "@/providers/theme/theme";

import { MoreIcon } from "@/assets/icons";

interface Props extends Type<typeof PostContainer> {
  issue?: IssueType;
  index?: number;
}

export default function Post({
  issue,
  index,
  onClick: handleClick,
  ...rest
}: Props) {
  /**
   * kit for retrieving repo targeted
   */
  const searchParams = useSearchParams();
  const [owner, repoName] = (
    searchParams.get("repo") as `${string}/${string}`
  )?.split("/") ?? [undefined, undefined];

  /**
   * kit for retrieving issue targeted and defining destination of navigation
   */
  const router = useRouter();
  const pathname = usePathname();
  const { url: infoIssueUrl } = useUrl({ mode: "info" }, `/post/${issue?.id}`);
  const { url: editIssueUrl } = useUrl({ mode: "edit" }, `/post/${issue?.id}`);
  const issueId = Number(pathname.split("/")?.[2]);

  /**
   * kit for improving UI disguising
   */
  const element = useRef<HTMLDivElement>(null);
  const { isOverflow, forceCheck } = useOverflow(element);
  useEffect(() => forceCheck(), [forceCheck, issueId]);

  /**
   * kit for animating
   */
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

  const [toolTipOpen, setToolTipOpen] = useState(false);

  const handleEdit = () => {
    router.replace(editIssueUrl);
    setToolTipOpen(false);
  };

  const handleClose = async () => {
    try {
      if (issue?.number)
        await updateIssueState({
          repo: issue?.repository?.name ?? repoName,
          owner: issue?.repository?.owner.login ?? owner,
          issue: issue.number,
        });
      setToolTipOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleOpen = async () => {
    try {
      if (issue?.number)
        await updateIssueState(
          {
            repo: issue?.repository?.name ?? repoName,
            owner: issue?.repository?.owner.login ?? owner,
            issue: issue.number,
          },
          "open"
        );
      setToolTipOpen(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <PostContainer
      key={issue?.id}
      onClick={(event) => {
        router.replace(infoIssueUrl);
        handleClick?.(event);
      }}
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: ((index ?? 0) % FETCH_ISSUE_ONETIME_NUMBER) * 0.15,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      {...rest}
    >
      <PostTitle>
        {issue?.title}
        <Tooltip
          open={toolTipOpen}
          title={
            <Operation
              handleEdit={handleEdit}
              handleClose={handleClose}
              handleOpen={handleOpen}
              issue={issue}
            />
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
      </PostTitle>
      <Divider />
      <PostBody>
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
      </PostBody>
      <PostFooterContainer>
        <PostFooterContent>
          <RippleButton
            category="link"
            palette="main"
            style={{ padding: 0, maxWidth: "50%" }}
          >
            <Link
              href={issue?.html_url}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              {issue?.repository?.name ?? repoName}
            </Link>
          </RippleButton>
          {issue?.updated_at
            ? capitalize(formatRelative(parseISO(issue.updated_at), new Date()))
            : ""}
        </PostFooterContent>
      </PostFooterContainer>
    </PostContainer>
  );
}
