import Head from "next/head";
import { useRouter } from "next/router";

import Connect from "../../components/Connect";
import Warning from "../../components/Warning";
import { Page } from "../../components/Layout";

import { vaults } from "../../vaults.json";

export default function Vault() {
  const router = useRouter();
  const { name } = router.query;
  const vault = vaults.find((vault) => vault.NAME === name);

  if (!vault) {
    return (
      <Page>
        <p>Loading ...</p>
      </Page>
    );
  }

  return (
    <Page>
      <Head>
        <title>{vault.NAME}</title>
      </Head>
      <h1>
        {vault.LOGO} {vault.NAME}
      </h1>
      <Connect />
      <hr />
      <Warning>
        this experiment is experimental. It's extremely risky and
        will probably be discarded when the test is over. Proceed with extreme
        caution.
      </Warning>
    </Page>
  );
}
