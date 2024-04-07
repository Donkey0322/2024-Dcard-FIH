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
import PostModal from "@/modules/main/components/PostModal";
import useFilter from "@/modules/main/hooks/useFilter";
import Post from "@/modules/main/pages/Post";

import { RepoIcon, StateIcon } from "@/assets/icons";

interface Props {
  issues?: IssueType[];
  filters?: {
    repos?: RepoType[];
  };
}

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 1em 2em 0.5em;
  flex-wrap: wrap;
`;

const PostsContainer = styled.div`
  flex: 1;
  height: 0;
  background-color: ${({ theme }) => theme.pink[100]};
  display: flex;
  flex-direction: column;
`;

const PostsContent = styled.div`
  overflow: scroll;
  flex: 1;
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

export default function PostList({ issues, filters }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState<
    "edit" | "create" | undefined
  >(undefined);

  const pathname = usePathname();
  const issueId = Number(pathname.split("/")?.[2]);

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const mode = searchParams.get("mode");

  useEffect(() => {
    setOpen(issueId || mode === "preview" || mode === "create" ? true : false);
  }, [issueId, mode]);

  useEffect(() => {
    if (mode === "edit") setEditOrCreate("edit");
    if (mode === "create") setEditOrCreate("create");
    if (!open) setEditOrCreate(undefined);
  }, [mode, open]);

  const { url: newPage } = useUrl({ page: String(currentPage + 1) });
  const { url: homePage } = useUrl(undefined, "/post", { delete: ["mode"] });

  const scrollElement = useScrollToEnd(() => {
    if (
      issues?.length &&
      issues.length >= FETCH_ISSUE_ONETIME_NUMBER * currentPage
    )
      router.replace(newPage);
  });

  const { repoName, state, handleRepo, handleState } = useFilter();

  return (
    <PostsContainer>
      <FilterBar>
        <Select
          title={"Repository"}
          selectedKeys={repoName}
          icon={<RepoIcon />}
          items={filters?.repos?.map((repo) => ({
            label: repo.full_name,
            key: repo.full_name,
          }))}
          onSelect={({ key }) => handleRepo(key)}
          onDeselect={({ key }) => handleRepo(key)}
        />
        <Select
          title={"State"}
          selectedKeys={[state]}
          icon={<StateIcon />}
          items={["open", "closed", "all"].map((state) => ({
            label: state,
            key: state,
          }))}
          onSelect={({ key }) => handleState(key)}
        />
      </FilterBar>
      <PostsContent ref={scrollElement}>
        <AnimatePresence>
          {issues?.map((issue, index) => (
            <Post key={issue.id} issue={issue} index={index} />
          ))}
        </AnimatePresence>
      </PostsContent>
      <PostModal
        open={open}
        onCancel={() => {
          router.replace(homePage);
        }}
        issue={issues?.find((issue) => issue.id === issueId)}
        repos={filters?.repos}
        editOrCreate={editOrCreate}
      />
    </PostsContainer>
  );
}
