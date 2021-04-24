import "../styles/globals.css";

import Web3ContextProvider from "../helpers/web3";
import KonamiContextProvider from "../helpers/konami";
import SuspenseContextProvider from "../helpers/suspense";

function ApeTax({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <KonamiContextProvider>
        <SuspenseContextProvider>
          <Component {...pageProps} />
        </SuspenseContextProvider>
      </KonamiContextProvider>
    </Web3ContextProvider>
  );
}

export default ApeTax;
