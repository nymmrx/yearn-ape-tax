import "../styles/globals.css";

import Web3ContextProvider from "../helpers/web3";
import KonamiContextProvider from "../helpers/konami";

function ApeTax({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <KonamiContextProvider>
        <Component {...pageProps} />
      </KonamiContextProvider>
    </Web3ContextProvider>
  );
}

export default ApeTax;
