import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Connect from "../components/Connect";
import Warning from "../components/Warning";
import { Page } from "../components/Layout";
import { Dotted } from "../components/Typography";

import vaults from "../vaults.json";

export default function Vault() {
  const router = useRouter();
  const { id } = router.query;
  const vault = vaults.find((vault) => vault.id === id);

  if (!id) {
    return (
      <Page>
        <p>Loading ...</p>
      </Page>
    );
  } else if (!vault) {
    return <Page />;
  }

  return (
    <Page>
      <Head>
        <title>{vault.title}</title>
      </Head>
      <h1>
        {vault.logo} {vault.title}
      </h1>
      <Connect />
      <hr />
      <Warning>
        this experiment is experimental. It's extremely risky and will probably
        be discarded when the test is over. Proceed with extreme caution.
      </Warning>
      <Link href={"/"} passHref>
        <span>
          {"<< "}
          <Dotted>Back home</Dotted>
        </span>
      </Link>
    </Page>
  );
}
