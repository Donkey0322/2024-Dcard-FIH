"use client";

import styled from "styled-components";

import type { Endpoints } from "@octokit/types";

import GalleryItem from "@/modules/main/components/GalleryItem";

interface Props {
  issues?: Endpoints["GET /issues"]["response"]["data"];
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
  return (
    <GalleryContainer>
      <GalleryContent>
        {issues?.map((issue, index) => (
          <GalleryItem key={index} issue={issue} />
        ))}
      </GalleryContent>
    </GalleryContainer>
  );
}
