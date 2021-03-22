import styled from "styled-components";

export const Dotted = styled.a`
  cursor: pointer;
  border-bottom: 2px dotted white;
  transition: all 100ms;
  &:hover {
    border-bottom: 2px dotted black;
  }
`;
