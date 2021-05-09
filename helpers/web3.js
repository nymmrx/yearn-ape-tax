import React, { useCallback, useContext, useState } from "react";

export const web3Context = React.createContext(undefined);

function Web3ContextProvider(props) {
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(0);
  const [provider, setProvider] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [error, setError] = useState(undefined);

  const disconnect = useCallback(() => {
    if (provider && provider.close) {
      provider.close();
    }
    setConnected(false);
  }, [provider, setConnected]);

  const reset = useCallback(
    (error) => {
      if (error) {
        console.error(error);
        setError(error);
      }
      setConnected(false);
      setAccount(undefined);
      setProvider(undefined);
      setWeb3(undefined);
    },
    [setError, setConnected, setAccount, setProvider, setWeb3]
  );

  const value = {
    connected,
    setConnected,
    chainId,
    setChainId,
    provider,
    setProvider,
    web3,
    setWeb3,
    account,
    setAccount,
    error,
    setError,
    disconnect,
    reset,
  };

  return <web3Context.Provider value={value} {...props}></web3Context.Provider>;
}

export function useWeb3() {
  const value = useContext(web3Context);
  return value;
}

export default Web3ContextProvider;
