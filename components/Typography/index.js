import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

export const Dotted = styled.a`
  user-select: none;
  cursor: pointer;
  border-bottom: 2px dotted white;
  transition: all 100ms;
  color: ${({ color }) => color || "black"};
  &:hover {
    border-bottom: 2px dotted black;
  }
`;

function random(length) {
  let result = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join("");
}

export const Blurred = styled.span`
  user-select: none;
  ${({ blur }) => blur && "text-shadow: 0 0 4px black;"};
  ${({ blur }) => blur && "color: transparent;"};
`;

export function Blurrable({ children }) {
  const [blur, setBlur] = useState(false);
  const toggle = useCallback(() => setBlur(!blur), [blur, setBlur]);
  const value = useMemo(() => {
    if (blur) return random(children.length);
    return children;
  }, [blur, setBlur]);
  return (
    <span onClick={toggle}>
      <Blurred blur={blur}>{value}</Blurred>
    </span>
  );
}
