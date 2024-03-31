"use client";

import styled from "styled-components";

import type { Endpoints } from "@octokit/types";

interface Props {
  issues?: Endpoints["GET /issues"]["response"]["data"];
}

const GalleryContainer = styled.div`
  flex: 1;
  background-color: #f1eff9;
  display: flex;
  flex-direction: column;
`;

export default function Gallery({ issues }: Props) {
  return (
    <GalleryContainer>
      {issues?.map((issue, index) => (
        <div key={index}>{issue.title}</div>
      ))}
    </GalleryContainer>
  );
}
