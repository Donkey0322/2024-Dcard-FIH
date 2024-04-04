"use client";

import { Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import type { IssueType } from "@/modules/main/types";
import type { Type } from "@/utils/types";

import { RippleButton } from "@/components/Button";
import Markdown from "@/components/Markdown";
import useUrl from "@/hooks/useUrl";
import { IssueBody } from "@/modules/main/components/Issue/Body";
import { updateIssue } from "@/modules/main/services";

interface DetailModalProps extends Type<typeof Modal> {
  onCancel: () => void;
  issue?: IssueType;
}

const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: 2em;
  border-bottom: 1px solid ${({ theme }) => theme.gray["500"]};
`;

export const AlbumWrapper = styled.div`
  width: 100%;
  gap: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  /* grid-auto-rows: 0px; */
  min-height: 0;
  overflow: scroll;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 8px;
`;

export default function PostModal({ open, onCancel, issue }: DetailModalProps) {
  const router = useRouter();

  const [submitButtonShow, setSubmitButtonShow] = useState(false);
  const [title, setTitle] = useState(issue?.title ?? "");
  const [body, setBody] = useState(issue?.body ?? "");
  const [submitting, setSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "info";
  const infoIssueUrl = useUrl({ mode: "info" }, `/post/${issue?.id}`);
  const editIssueUrl = useUrl({ mode: "edit" }, `/post/${issue?.id}`);

  useEffect(() => {
    setSubmitButtonShow(
      title !== (issue?.title ?? "") || body !== (issue?.body ?? "")
    );
  }, [body, issue?.body, issue?.title, title]);

  useEffect(() => {
    setTitle(issue?.title ?? "");
    setBody(issue?.body ?? "");
  }, [issue?.body, issue?.title]);

  const handleSubmit = useCallback(async () => {
    if (
      issue?.repository?.name &&
      issue?.repository?.owner?.login &&
      issue?.number
    ) {
      setSubmitting(true);
      await updateIssue({
        repo: issue.repository.name,
        owner: issue.repository.owner.login,
        issue: issue.number,
        title,
        body,
      });
      setSubmitting(false);
      onCancel?.();
    }
  }, [
    body,
    issue?.number,
    issue?.repository?.name,
    issue?.repository?.owner.login,
    onCancel,
    title,
  ]);

  const Footer = useMemo(
    () => (
      <ButtonWrapper>
        {mode === "info" ? (
          <RippleButton
            category="solid"
            palette="main"
            onClick={() => {
              router.push(editIssueUrl);
            }}
            loading={submitting}
          >
            編輯
          </RippleButton>
        ) : submitButtonShow ? (
          <RippleButton
            category="solid"
            palette="main"
            onClick={() => void handleSubmit()}
            loading={submitting}
            disabled={title === "" || body.length < 30}
          >
            儲存
          </RippleButton>
        ) : (
          <RippleButton
            category="outlined"
            palette="main"
            onClick={() => {
              router.replace(infoIssueUrl);
            }}
            loading={submitting}
          >
            取消編輯
          </RippleButton>
        )}
        <RippleButton category="outlined" palette="gray" onClick={onCancel}>
          關閉
        </RippleButton>
      </ButtonWrapper>
    ),
    [
      body.length,
      editIssueUrl,
      handleSubmit,
      infoIssueUrl,
      mode,
      onCancel,
      router,
      submitButtonShow,
      submitting,
      title,
    ]
  );

  return (
    <Modal
      title={
        mode === "edit" ? (
          <Form>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Title is required!" }]}
              initialValue={title}
            >
              <Input onChange={(event) => setTitle(event.target.value)} />
            </Form.Item>
          </Form>
        ) : (
          <ModalTitle>{issue?.title}</ModalTitle>
        )
      }
      centered
      open={open}
      footer={Footer}
      onCancel={onCancel}
      closable={false}
      style={{ overflow: "scroll", maxHeight: "90vh" }}
    >
      <IssueBody>
        {mode === "edit" ? (
          <Form>
            <Form.Item
              name="body"
              rules={[
                {
                  type: "string",
                  min: 30,
                  message: "Content over 30 words is required!",
                },
              ]}
              initialValue={body}
            >
              <TextArea
                rows={8}
                onChange={(event) => {
                  setBody(event.target.value);
                }}
              ></TextArea>
            </Form.Item>
          </Form>
        ) : (
          <Markdown>{issue?.body}</Markdown>
        )}
      </IssueBody>
    </Modal>
  );
}
