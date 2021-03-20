import "../styles/globals.css";

import Web3ContextProvider from "../helpers/web3";

function ApeTax({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <Component {...pageProps} />
    </Web3ContextProvider>
  );
}

export default ApeTax;
