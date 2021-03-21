import styled from "styled-components";

export const Dotted = styled.a`
  border-bottom: 2px dotted white;
  transition: all 100ms;
  &:hover {
    border-bottom: 2px dotted black;
  }
`;
