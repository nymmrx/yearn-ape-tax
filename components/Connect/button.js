import { useCallback } from "react";
import styled from "styled-components";

import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

import { useWeb3 } from "../../helpers/web3";
import { shortenAddress } from "../../helpers/address";
import { measures } from "../../helpers/measures";

import chains from "../../chains.json";
import { Blurrable } from "../Typography";

const ConnectionDetails = styled.span`
  display: inline-block;
  margin: 0 0 0 1rem;
  @media screen and (max-width: ${measures.phone}) {
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

  const connectProvider = useCallback(
    (provider) => {
      console.log("[Web3] setting up provider");
      const web3 = new Web3Provider(provider);
      Promise.all([
        web3.getNetwork().then((net) => setChainId(net.chainId)),
        web3.listAccounts().then(([account]) => setAccount(account)),
      ]).then(() => setWeb3(web3));
    },
    [setWeb3, setChainId, setAccount]
  );

  const connect = useCallback(() => {
    modal
      .connect()
      .then((provider) => {
        provider.on("accountsChanged", ([account]) => {
          console.log("[Web3] accountsChanged");
          setAccount(account);
          connectProvider(provider);
        });

        provider.on("chainChanged", (chainId) => {
          console.log("[Web3] chainChanged");
          setChainId(parseInt(chainId, 16));
          connectProvider(provider);
        });

        provider.on("connect", ({ chainId }) => {
          console.log("[Web3] connect");
          setConnected(true);
          setChainId(chainId);
          setError(undefined);
          connectProvider(provider);
        });

        provider.on("disconnect", (error) => {
          console.log("[Web3] disconnect");
          setConnected(false);
          reset(error);
          console.log(error);
        });

        setProvider(provider);
        setConnected(true);
        connectProvider(provider);
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
        {account && chainId && chainId in chains && (
          <ConnectionDetails>
            👤 <Blurrable>{shortenAddress(account)}</Blurrable> / ⛓️ {chains[chainId].name}
          </ConnectionDetails>
        )}
        {chainId && !(chainId in chains) && <ConnectionDetails>⛔ Unsupported chain</ConnectionDetails>}
      </div>
    );
  }

  return <button onClick={connect}>Connect</button>;
}

export function DummyConnect() {
  return <button disabled>Connect</button>;
}

export default Connect;
