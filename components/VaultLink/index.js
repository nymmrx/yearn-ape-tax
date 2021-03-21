import Link from "next/link";
import styled from "styled-components";

import { Dotted } from "../Typography";

const Logo = styled.span`
  display: inline-block;
  width: 4.2rem;
`;

function VaultLink({ vault }) {
  return (
    <h4>
      <Logo>{vault.logo}</Logo>
      <Link href={`/vaults/${vault.id}`} passHref>
        <Dotted>{vault.title}</Dotted>
      </Link>
    </h4>
  );
}

export default VaultLink;
