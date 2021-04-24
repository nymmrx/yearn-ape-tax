import Link from "next/link";
import styled from "styled-components";

import { Dotted } from "../../Typography";

const Container = styled.h4`
  display: flex;
  align-items: center;
`;

const Logo = styled.span`
  display: inline-block;
  width: 4.3rem;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
`;

const Status = styled.span`
  color: ${({ color }) => color || "black"};
  font-weight: 300;
  font-size: 1rem;
`;

const StatusColors = {
  active: "green",
  withdraw: "red",
};

function VaultLink({ vault }) {
  return (
    <Container>
      <Logo>{vault.logo}</Logo>
      <Text>
        <div>
          <Link href={`/${vault.id}`} passHref>
            <Dotted>{vault.title}</Dotted>
          </Link>
        </div>
        <Status color={StatusColors[vault.status]}>{vault.status}</Status>
      </Text>
    </Container>
  );
}

export default VaultLink;
