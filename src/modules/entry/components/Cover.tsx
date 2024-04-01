/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import styled from "styled-components";

import { TapButton } from "@/components";
import { MOBILE_WITH } from "@/constants/rwd";
import { signInGithub } from "@/modules/entry/services";
import { hexToRgb } from "@/utils/color";
import { backgroundCenter, percentageOfFigma } from "@/utils/css";

import CoverImage from "@/assets/images/Cover.jpg";

export const Background = styled.div`
  background: url(${CoverImage.src});
  width: 100vw;
  height: 100vh;
  ${backgroundCenter}
  display: flex;
  align-items: center;
`;

const TitleWrapper = styled.div`
  width: 100%;
  min-height: 33%;
  row-gap: ${percentageOfFigma(60).vh};
  box-sizing: border-box;
  padding: ${percentageOfFigma(46).max} 30px ${percentageOfFigma(30).max};
  background-color: ${hexToRgb("#000000", 0.48)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: var(--contrail-one);
`;

const Title = styled.div`
  font-weight: bold;
  font-size: ${percentageOfFigma(80).max};
  color: white;
  letter-spacing: 3px;
  line-height: ${percentageOfFigma(80).max};
  margin: 0 10px;
  img {
    width: 3.5vw;
    margin-bottom: -2px;
    margin-right: 4px;
  }
`;

const SloganWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  max-width: 1026px;
  &::before,
  &::after {
    content: "";
    margin: auto 0px;
    flex: 1;
    height: 2px;
    background-color: ${hexToRgb("#FFFFFF", 0.5)};
  }
`;

const Slogan = styled.div`
  font-weight: bold;
  font-size: ${percentageOfFigma(36).max};
  @media (max-width: ${MOBILE_WITH}px) {
    font-size: min(20px, ${percentageOfFigma(36).max});
  }
  color: white;
  letter-spacing: 2px;
  margin: 0 3vw;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${percentageOfFigma(43).vw};
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(TapButton)`
  background-color: ${({ theme: { main } }) => hexToRgb(main[100], 0.61)};
`;

export default function Cover({ isAuth }: { isAuth: boolean }) {
  return (
    <Background>
      {!isAuth && (
        <TitleWrapper>
          <Title>GitHub Issue</Title>
          <SloganWrapper>
            <Slogan>2024 Dcard Frontend Intern Homework</Slogan>
          </SloganWrapper>
          <ButtonGroup>
            <Button onClick={() => void signInGithub()}>
              {/* {t("entry.button.browseStadium")} */}用 Github 帳號登入
            </Button>
          </ButtonGroup>
        </TitleWrapper>
      )}
    </Background>
  );
}
