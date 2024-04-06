"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import styled from "styled-components";

import { RippleButton } from "@/components";
import Title from "@/components/Title";
import useUrl from "@/hooks/useUrl";
import { percentageOfFigma } from "@/utils/css";

import LogOutIcon from "@/assets/icons/logout";
import PlusIcon from "@/assets/icons/plus";

interface Props {
  name?: string | null;
  avatar?: string;
}

const HeaderWrapper = styled.div`
  height: ${percentageOfFigma(80).max};
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.main[500]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0px ${percentageOfFigma(32).max};
  top: 0;
  background-color: ${({ theme }) => theme.white};
`;

const MenuWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  column-gap: 8px;
`;

export default function Header({ name }: Props) {
  const router = useRouter();

  const signOutGithub = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {}
  };
  const { url: createIssueUrl } = useUrl({ mode: "create" });

  return (
    <HeaderWrapper>
      <Title />
      <MenuWrapper>
        <RippleButton
          category="solid"
          palette="main"
          style={{ fontSize: "1em", fontWeight: "600" }}
          onClick={() => {
            router.replace(createIssueUrl);
          }}
        >
          <PlusIcon />
          New Post
        </RippleButton>
        {name}
        <RippleButton category="icon" palette="gray">
          <LogOutIcon onClick={() => void signOutGithub()} />
        </RippleButton>
      </MenuWrapper>
    </HeaderWrapper>
  );
}
