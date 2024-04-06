"use client";

import { useState } from "react";
import styled from "styled-components";

import type { MouseEventHandler } from "react";

import { RippleButton } from "@/components/Button";

import DeleteIcon from "@/assets/icons/delete";
import EditIcon from "@/assets/icons/edit";

interface Props {
  handleEdit?: () => void;
  handleClose?: () => Promise<void>;
}

const OperationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default function Operation({ handleEdit, handleClose }: Props) {
  const [deleting, setDeleting] = useState(false);
  const handleCloseIssue: MouseEventHandler = (event) => {
    void (async () => {
      event.stopPropagation();
      setDeleting(true);
      await handleClose?.();
      setDeleting(false);
    })();
  };

  return (
    <OperationWrapper>
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
      <RippleButton
        category="solid"
        palette="red"
        loading={deleting}
        onClick={handleCloseIssue}
      >
        {!deleting && <DeleteIcon />}
        刪除
      </RippleButton>
    </OperationWrapper>
  );
}