import styled from "styled-components";

import { measures } from "../../helpers/measures";

const YellowBox = styled.div`
  background-color: #fff257;
  padding: 1rem;
  margin: 1rem 0;
  max-width: ${measures.max};
  width: 100%;
`;

function Warning({ children }) {
  return (
    <YellowBox>
      <b>⚠️ WARNING </b>
      {children}
    </YellowBox>
  );
}

export default Warning;
