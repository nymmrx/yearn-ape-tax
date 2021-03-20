import Head from "next/head";
import styled from "styled-components";

import Connect from "../components/Connect";
import VaultLink from "../components/VaultLink";
import Warning from "../components/Warning";
import { Page } from "../components/Layout";

import { useWeb3 } from "../helpers/web3";

import { vaults } from "../vaults.json";

export default function Home() {
  return (
    <Page>
      <Head>
        <title>Experimental Experiments</title>
      </Head>
      <h1>Experimental experiment registry</h1>
      <Connect />
      <hr />
      <Warning>
        this experiments are experimental. They are extremely risky and will
        probably be discarded when the test is over. There's a good chance that
        you can lose your funds. If you choose to proceed, do it with extreme
        caution.
      </Warning>
      <div>
        {vaults.map((vault) => (
          <VaultLink vault={vault} />
        ))}
      </div>
    </Page>
  );
}
