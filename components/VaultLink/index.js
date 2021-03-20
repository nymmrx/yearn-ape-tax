import Link from "next/link"
import styled from "styled-components";

const Logo = styled.span`
  display: inline-block;
  width: 4.2rem;
`;

const Dotted = styled.a`
  border-bottom: 2px dotted white;
  transition: all 100ms;
  &:hover {
    border-bottom: 2px dotted black;
  }
`;


function VaultLink({ vault }) {
  return (
    <h4 key={vault.NAME}>
      <Logo>{vault.LOGO}</Logo>
      <Link href={`/vaults/${vault.NAME}`} passHref>
        <Dotted>{vault.NAME}</Dotted>
      </Link>
    </h4>
  );
}

export default VaultLink;
