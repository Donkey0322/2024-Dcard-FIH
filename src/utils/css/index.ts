import { css } from "styled-components";

import { FIGMA_HEIGHT, FIGMA_WITH, MOBILE_WITH } from "@/constants/rwd";

export const flexCenter = css`
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
`;

export const percentageOfFigma = (number: number) => {
  const vw = `${(100 * number) / FIGMA_WITH}vw`;
  const vh = `${(100 * number) / FIGMA_HEIGHT}vh`;
  return {
    vw,
    vh,
    max: `max(${vw}, ${vh})`,
  };
};

export const rwdFontSize = (number: number) => css`
  font-size: ${percentageOfFigma(number).max};
  @media (max-width: ${MOBILE_WITH}px) {
    font-size: min(${number * 0.75}px, ${percentageOfFigma(number).max});
  }
`;

export const backgroundCenter = css`
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;
