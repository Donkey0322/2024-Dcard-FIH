"use client";

import { useState } from "react";
import styled from "styled-components";

import type { IssueType } from "@/modules/main/types";
import type { MouseEventHandler } from "react";

import { RippleButton } from "@/components/Button";
import theme from "@/providers/theme/theme";

import { DeleteIcon, EditIcon } from "@/assets/icons";

interface Props {
  issue?: IssueType;
  handleEdit?: () => void;
  handleClose?: () => Promise<void>;
  handleOpen?: () => Promise<void>;
}

const OperationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default function Operation({
  issue,
  handleEdit,
  handleClose,
  handleOpen,
}: Props) {
  const [deleting, setDeleting] = useState(false);
  const [opening, setOpening] = useState(false);
  const handleCloseIssue: MouseEventHandler = (event) => {
    void (async () => {
      event.stopPropagation();
      setDeleting(true);
      await handleClose?.();
      setDeleting(false);
    })();
  };
  const handleOpenIssue: MouseEventHandler = (event) => {
    void (async () => {
      event.stopPropagation();
      setOpening(true);
      await handleOpen?.();
      setOpening(false);
    })();
  };

  return (
    <OperationWrapper>
      {issue?.pull_request ? (
        <div style={{ color: theme.gray[500] }}>Pull Request</div>
      ) : (
        <>
          <RippleButton
            category="solid"
            palette="sub"
            onClick={(event) => {
              event.stopPropagation();
              handleEdit?.();
            }}
          >
            <EditIcon />
            編輯
          </RippleButton>
          {issue?.state === "open" ? (
            <RippleButton
              category="solid"
              palette="red"
              loading={deleting}
              onClick={handleCloseIssue}
            >
              {!deleting && <DeleteIcon />}
              刪除
            </RippleButton>
          ) : (
            <RippleButton
              category="solid"
              palette="sky"
              loading={opening}
              onClick={handleOpenIssue}
            >
              {!opening && <DeleteIcon />}
              開啟
            </RippleButton>
          )}
        </>
      )}
    </OperationWrapper>
  );
}
