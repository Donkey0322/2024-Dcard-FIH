"use client";

import { Form, Input, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import type { CommentType, IssueType, RepoType } from "@/modules/main/types";
import type { Type } from "@/utils/types";

import { RippleButton } from "@/components/Button";
import Markdown from "@/components/Markdown";
import useUrl from "@/hooks/useUrl";
import { IssueBody, IssueBodyContent } from "@/modules/main/components/Body";
import Comments from "@/modules/main/components/Comment";
import { createIssue, getComments, updateIssue } from "@/modules/main/services";

interface DetailModalProps extends Type<typeof Modal> {
  onCancel: () => void;
  issue?: IssueType;
  repos?: RepoType[];
}

type Mode = "create" | "preview" | "edit" | "info";

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
  margin-top: 30px;
`;

export default function PostModal({
  open,
  onCancel,
  issue,
  repos,
}: DetailModalProps) {
  const router = useRouter();
  const [form] = useForm();

  const [submitButtonShow, setSubmitButtonShow] = useState(false);
  const [title, setTitle] = useState(issue?.title ?? "");
  const [body, setBody] = useState<string | undefined>(
    issue?.body ?? undefined
  );
  const [repo, setRepo] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [creating, setCreating] = useState(false);

  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") ?? "info") as Mode;
  const { url: infoIssueUrl } = useUrl({ mode: "info" });
  const { url: editIssueUrl } = useUrl({ mode: "edit" });
  const { url: createIssueUrl } = useUrl({ mode: "create" });
  const { url: previewIssueUrl } = useUrl({ mode: "preview" });

  useEffect(() => {
    setSubmitButtonShow(
      title !== (issue?.title ?? "") || body !== (issue?.body ?? "")
    );
  }, [body, issue?.body, issue?.title, title]);

  useEffect(() => {
    setTitle(issue?.title ?? "");
    setBody(issue?.body ?? undefined);
  }, [issue?.body, issue?.title]);

  useEffect(() => {
    if (!submitButtonShow && mode === "preview") redirect(infoIssueUrl);
  }, [infoIssueUrl, mode, submitButtonShow]);
  useEffect(() => {
    if (mode === "edit" && issue?.pull_request) redirect(infoIssueUrl);
  }, [infoIssueUrl, issue?.pull_request, mode]);

  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const [owner, repoName] = (
      searchParams.get("repo") as `${string}/${string}`
    )?.split("/") ?? ["", ""];
    void (async () => {
      if (issue?.number) {
        const data = await getComments({
          repo: issue?.repository?.name ?? repoName,
          owner: issue?.repository?.owner.login ?? owner,
          issue: issue.number,
        });
        setComments(data ?? []);
      }
    })();
  }, [
    issue?.number,
    issue?.repository?.name,
    issue?.repository?.owner.login,
    searchParams,
  ]);

  const handleCancel = useCallback(() => {
    setClosing(true);
    onCancel();
    setClosing(false);
  }, [onCancel]);

  const handleEdit = useCallback(async () => {
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
      router.replace(infoIssueUrl);
      setSubmitting(false);
    }
  }, [
    body,
    infoIssueUrl,
    issue?.number,
    issue?.repository?.name,
    issue?.repository?.owner.login,
    router,
    title,
  ]);

  const handleCreate = useCallback(async () => {
    if (repo && title) {
      setCreating(true);
      await createIssue({
        repo,
        title,
        body,
      });
      setCreating(false);
      onCancel?.();
    }
  }, [body, onCancel, repo, title]);

  const Footer = useMemo(
    () => (
      <ButtonWrapper>
        {!issue?.pull_request &&
          (mode === "info" ? (
            <RippleButton
              category="solid"
              palette="main"
              onClick={() => {
                router.replace(editIssueUrl);
              }}
              loading={submitting}
            >
              編輯
            </RippleButton>
          ) : submitButtonShow ? (
            <>
              <RippleButton
                category={mode === "preview" ? "outlined" : "solid"}
                palette="sub"
                onClick={() => {
                  mode === "preview"
                    ? router.replace(issue ? editIssueUrl : createIssueUrl)
                    : router.replace(previewIssueUrl);
                }}
              >
                {mode === "preview" ? "取消預覽" : "預覽"}
              </RippleButton>
              <RippleButton
                category="solid"
                palette="main"
                onClick={() =>
                  issue?.repository?.name
                    ? void handleEdit()
                    : void handleCreate()
                }
                loading={issue?.repository?.name ? submitting : creating}
                disabled={
                  title === "" ||
                  !body ||
                  body?.length < 30 ||
                  (!issue?.repository?.name && !repo)
                }
              >
                提交
              </RippleButton>
            </>
          ) : (
            mode === "edit" && (
              <RippleButton
                category="outlined"
                palette="main"
                onClick={() => {
                  router.replace(infoIssueUrl);
                }}
              >
                取消編輯
              </RippleButton>
            )
          ))}
        <RippleButton
          category="outlined"
          palette="gray"
          onClick={handleCancel}
          loading={closing}
        >
          關閉
        </RippleButton>
      </ButtonWrapper>
    ),
    [
      body,
      closing,
      createIssueUrl,
      creating,
      editIssueUrl,
      handleCancel,
      handleCreate,
      handleEdit,
      infoIssueUrl,
      issue,
      mode,
      previewIssueUrl,
      repo,
      router,
      submitButtonShow,
      submitting,
      title,
    ]
  );

  return (
    <Modal
      title={
        mode === "edit" || mode === "create" ? (
          <Form form={form}>
            {mode === "create" && (
              <Form.Item
                name="repo"
                rules={[{ required: true, message: "Repo is required" }]}
                initialValue={repo}
              >
                <Select
                  onChange={(value) => setRepo(value)}
                  placeholder={"Select an repo to create issue."}
                  options={repos?.map((repo) => ({
                    value: repo.name,
                    label: repo.name,
                  }))}
                />
              </Form.Item>
            )}
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Title is required!" }]}
              initialValue={title}
            >
              <Input
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Input Issue Title"
              />
            </Form.Item>
          </Form>
        ) : (
          <ModalTitle>{title}</ModalTitle>
        )
      }
      centered
      open={open}
      footer={Footer}
      afterOpenChange={(open) => {
        if (open)
          form.setFieldsValue({
            repo,
            title,
            body,
          });
        else {
          setRepo(undefined);
          setBody(undefined);
          setTitle("");
          form.setFieldsValue({ title: "", body: undefined, repo: undefined });
        }
      }}
      onCancel={handleCancel}
      closable={false}
      style={{ overflow: "scroll", maxHeight: "90vh" }}
    >
      <IssueBody>
        {mode === "edit" || mode === "create" ? (
          <Form form={form}>
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
                placeholder="Input Issue Body (over 30 words)"
              />
            </Form.Item>
          </Form>
        ) : (
          <>
            <IssueBodyContent hasContent={!!body}>
              <Markdown>{body ?? "No content"}</Markdown>
            </IssueBodyContent>
            {comments.length ? (
              <Comments comments={comments} issue={issue} />
            ) : null}
          </>
        )}
      </IssueBody>
    </Modal>
  );
}
