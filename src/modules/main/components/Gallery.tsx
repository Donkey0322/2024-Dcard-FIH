"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import type { IssueType } from "@/modules/main/types";

import { useScrollToEnd } from "@/hooks/useElements";
import useUrl from "@/hooks/useUrl";
import GalleryItem from "@/modules/main/components/GalleryItem";
import PostModal from "@/modules/main/components/PostModal";

interface Props {
  issues?: IssueType[];
}

const GalleryContainer = styled.div`
  flex: 1;
  background-color: #f1eff9;
  display: flex;
  flex-direction: column;
`;

const GalleryContent = styled.div`
  max-height: 85vh;
  height: 85vh;
  overflow: scroll;
  display: flex;
  gap: 4em;
  flex-wrap: wrap;
  padding: 2em 2em;
  &::after {
    content: "";
    flex: auto;
    flex-basis: 400px;
  }
`;

export default function Gallery({ issues }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const issueId = Number(pathname.split("/")?.[2]);

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => setOpen(issueId ? true : false), [issueId]);

  const newPage = useUrl({ page: String(currentPage + 1) });
  const homePage = useUrl(undefined, "/post", { delete: ["mode"] });

  const scrollElement = useScrollToEnd(() => {
    if (issues?.length && issues.length >= 10 * currentPage)
      router.replace(newPage);
  });

  return (
    <GalleryContainer>
      <GalleryContent ref={scrollElement}>
        {issues?.map((issue, index) => (
          <GalleryItem key={index} issue={issue} />
        ))}
      </GalleryContent>
      <PostModal
        open={open}
        onCancel={() => {
          router.replace(homePage);
          setOpen(false);
        }}
        issue={issues?.find((issue) => issue.id === issueId)}
      />
    </GalleryContainer>
  );
}
