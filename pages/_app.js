import "../styles/globals.css";

import Web3ContextProvider from "../helpers/web3";
import KonamiContextProvider from "../helpers/konami";
import SuspenseContextProvider from "../helpers/suspense";
import HideContextProvider from "../helpers/hide";

function ApeTax({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <KonamiContextProvider>
        <SuspenseContextProvider>
          <HideContextProvider>
            <Component {...pageProps} />
          </HideContextProvider>
        </SuspenseContextProvider>
      </KonamiContextProvider>
    </Web3ContextProvider>
  );
}

export default ApeTax;
