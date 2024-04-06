"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import type { IssueType, RepoType } from "@/modules/main/types";

import Select from "@/components/Select";
import { FETCH_ISSUE_ONETIME_NUMBER } from "@/constants/issue";
import { useScrollToEnd } from "@/hooks/useElements";
import useUrl from "@/hooks/useUrl";
import GalleryItem from "@/modules/main/components/GalleryItem";
import PostModal from "@/modules/main/components/PostModal";
import useFilter from "@/modules/main/hooks/useFilter";

interface Props {
  issues?: IssueType[];
  filters?: {
    repos?: RepoType[];
  };
}

const FilterBar = styled.div`
  display: flex;
  column-gap: 8px;
  align-items: center;
  padding: 1em 2em 0.5em;
  /* border-bottom: 2px solid ${({ theme }) => theme.main[500]}; */
`;

const GalleryContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.pink[100]};
  display: flex;
  flex-direction: column;
  /* padding: 2em; */
`;

const GalleryContent = styled.div`
  max-height: 85vh;
  height: 85vh;
  overflow: scroll;
  display: flex;
  gap: 4em;
  flex-wrap: wrap;
  padding: 2em;
  &::after {
    content: "";
    flex: auto;
    flex-basis: 400px;
  }
`;

export default function Gallery({ issues, filters }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const issueId = Number(pathname.split("/")?.[2]);

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const mode = searchParams.get("mode");

  useEffect(
    () =>
      setOpen(
        issueId || mode === "preview" || mode === "create" ? true : false
      ),
    [issueId, mode]
  );

  const { url: newPage } = useUrl({ page: String(currentPage + 1) });
  const { url: homePage } = useUrl(undefined, "/post", { delete: ["mode"] });

  const scrollElement = useScrollToEnd(() => {
    if (
      issues?.length &&
      issues.length >= FETCH_ISSUE_ONETIME_NUMBER * currentPage
    )
      router.replace(newPage);
  });

  const { repoName, handleRepo } = useFilter();

  return (
    <GalleryContainer>
      <FilterBar>
        <Select
          title={"Repository"}
          selectedKeys={repoName}
          icon=""
          items={filters?.repos?.map((repo) => ({
            label: repo.name,
            key: repo.name,
          }))}
          onSelect={({ key }) => handleRepo(key)}
          onDeselect={({ key }) => handleRepo(key)}
        />
      </FilterBar>
      <GalleryContent ref={scrollElement}>
        <AnimatePresence>
          {issues?.map((issue, index) => (
            <GalleryItem key={issue.id} issue={issue} index={index} />
          ))}
        </AnimatePresence>
      </GalleryContent>
      <PostModal
        open={open}
        onCancel={() => {
          router.replace(homePage);
        }}
        issue={issues?.find((issue) => issue.id === issueId)}
        repos={filters?.repos}
      />
    </GalleryContainer>
  );
}
