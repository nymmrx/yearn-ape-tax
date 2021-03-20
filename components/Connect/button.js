import { useCallback } from "react";
import styled from "styled-components";

import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

import { useWeb3 } from "../../helpers/web3";
import { shortenAddress } from "../../helpers/address";

const ConnectionDetails = styled.span`
  display: inline-block;
  margin: 0 0 0 1rem;
  @media screen and (max-width: 350px) {
    display: block;
    margin: 1rem 0 0 0;
  }
`;

const InfuraProjectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: InfuraProjectId,
    },
  },
};

function Connect() {
  const {
    connected,
    setConnected,
    account,
    setAccount,
    setProvider,
    setWeb3,
    chainId,
    setChainId,
    setError,
    reset,
    disconnect,
  } = useWeb3();
  const modal = new Web3Modal({
    providerOptions,
  });

  const connect = useCallback(() => {
    modal
      .connect()
      .then((provider) => {
        provider.on("accountsChanged", ([account]) => {
          console.log("web3: accountsChanged");
          setAccount(account);
        });

        provider.on("chainChanged", (chainId) => {
          console.log("web3: chainChanged");
          setChainId(parseInt(chainId, 16));
        });

        provider.on("connect", ({ chainId }) => {
          console.log("web3: connect");
          setConnected(true);
          setChainId(chainId);
          setError(undefined);
        });

        provider.on("disconnect", (error) => {
          console.log("web3: disconnect");
          reset(error);
        });

        setProvider(provider);
        setConnected(true);

        const web3 = new Web3Provider(provider);
        web3.getNetwork().then((net) => setChainId(net.chainId));
        web3.listAccounts().then(([account]) => setAccount(account));
        setWeb3(web3);
      })
      .catch((error) => console.error(error));
  });

  const deactivate = useCallback(() => {
    disconnect();
    reset();
  }, [disconnect, reset]);

  if (connected) {
    return (
      <div>
        <button onClick={deactivate}>Disconnect</button>
        {account && chainId && (
          <ConnectionDetails>
            👤 {shortenAddress(account)} / ⛓️ {chainId}
          </ConnectionDetails>
        )}
      </div>
    );
  }

  return <button onClick={connect}>Connect</button>;
}

export function DummyConnect() {
  return <button disabled>Connect</button>;
}

export default Connect;
