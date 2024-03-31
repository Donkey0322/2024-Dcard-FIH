import { motion } from "framer-motion";
import styled from "styled-components";

import { percentageOfFigma, rwdFontSize } from "@/utils/css";

const TapButtonBase = styled(motion.div)`
  padding: max(${percentageOfFigma(15).vw}, ${percentageOfFigma(15).vh})
    max(${percentageOfFigma(40).vw}, ${percentageOfFigma(40).vh});
  font-weight: 600;
  ${rwdFontSize(32)};
  border-radius: 0.625em;
  width: fit-content;
  white-space: nowrap;
  cursor: pointer;
  letter-spacing: 2px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  color: ${({ theme }) => theme.main[700]};
`;

type TapButtonProps = React.ComponentProps<typeof TapButtonBase>;

export default function TapButton({
  whileHover = { scale: 1.1 },
  whileTap = { scale: 0.95 },
  transition = { type: "spring", stiffness: 400, damping: 17 },
  children,
  ...rest
}: TapButtonProps) {
  return (
    <TapButtonBase
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition}
      {...rest}
    >
      {children}
    </TapButtonBase>
  );
}
