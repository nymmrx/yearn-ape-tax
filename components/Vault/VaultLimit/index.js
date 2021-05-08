import React, { useMemo } from "react";
import styled from "styled-components";
import useWindowSize from "../../../helpers/size";

const F = new Intl.NumberFormat("en-US", { style: "percent" });

const ProgressBar = styled.code`
  display: inline-block;
  white-space: pre-wrap;
  letter-spacing: 0.08rem;
  background-color: gainsboro;
  color: gray;
`;

export default function VaultLimit({ value }) {
  const parts = [" ", "▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"];
  const whole = "█";
  const space = " ";

  const size = useWindowSize();
  const width = size.width > 500 ? 40 : 20;

  const wholeWidth = useMemo(() => Math.floor(value * width), [width, value]);
  const partWidth = useMemo(() => Math.floor(((value * width) % 1) * 9), [width, value]);

  return (
    <div>
      <ProgressBar>
        [{whole.repeat(wholeWidth) + parts[partWidth] + space.repeat(value == 1 ? 0 : width - wholeWidth - 1)}]
      </ProgressBar>
      <span> {F.format(value)}</span>
    </div>
  );
}
