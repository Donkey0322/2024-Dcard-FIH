import { Tooltip } from "antd";
import Image from "next/image";
import styled from "styled-components";

import type { CommentType, IssueType } from "@/modules/main/types";

interface Props {
  issue?: IssueType;
  comments: CommentType[];
}

const Title = styled.div`
  font-size: 1em;
  font-weight: 700;
  color: ${({ theme }) => theme.main[700]};
`;

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5em;
  max-height: 150px;
  overflow: scroll;
`;

const CommentWithAvatar = styled.div.withConfig({
  shouldForwardProp: (prop) => !["self"].includes(prop),
})<{ self: boolean }>`
  display: flex;
  max-width: 85%;
  column-gap: 0.5em;
  ${({ self }) => !self && `align-self: flex-end;`}/* &:nth-child(2n) {
    align-self: flex-end;
  } */
`;

const Comment = styled.div`
  padding: 1em;
  width: fit-content;
  max-width: calc(100% - 3em);
  border-radius: 1em;
  line-height: 1em;
  background-color: ${({ theme }) => theme.gray[300]};
`;

export default function Comments({ comments, issue }: Props) {
  return (
    <>
      <Title>Comments</Title>
      <CommentsContainer>
        {[...comments].map((comment, index) => {
          const self = comment.user?.login === issue?.user?.login;
          return (
            <CommentWithAvatar key={index} self={self}>
              {self && (
                <Image
                  src={comment.user?.avatar_url ?? ""}
                  alt="Picture of the author"
                  width={30}
                  height={30}
                  style={{ borderRadius: "50%" }}
                />
              )}
              <Comment>{comment.body}</Comment>
              {!self && (
                <Tooltip
                  title={comment.user?.login}
                  color="white"
                  overlayInnerStyle={{ color: "black" }}
                >
                  <Image
                    src={comment.user?.avatar_url ?? ""}
                    alt="Picture of the author"
                    width={30}
                    height={30}
                    style={{ borderRadius: "50%" }}
                  />
                </Tooltip>
              )}
            </CommentWithAvatar>
          );
        })}
      </CommentsContainer>
    </>
  );
}
