import React, { useEffect, useState, useMemo } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import styled from "styled-components";

import BigNumber from "bignumber.js";

import { Contract } from "@ethersproject/contracts";

import { useWeb3 } from "../helpers/web3";
import { formatUnits } from "../helpers/units";
import { shortenAddress, NullAddress } from "../helpers/address";

import Suspense from "../components/Suspense";
import Connect from "../components/Connect";
import Warning from "../components/Warning";
import VaultLimit from "../components/Vault/VaultLimit";
import { Page } from "../components/Layout";
import { Dotted } from "../components/Typography";

import vaults from "../vaults.json";
import chains from "../chains.json";

import abiVaultV2 from "../abi/vault.json";
import abiStrategy from "../abi/strategy.json";
import abiErc20 from "../abi/erc20.json";

const Title = styled.span`
  white-space: nowrap;
`;

const Section = styled.section`
  margin: 2rem 0 0 0;
  p,
  div {
    margin: 0.4rem 0 0 0;
  }
`;

const Amount = styled.div`
  display: flex;
  align-items: stretch;
`;

const Buttons = styled.section`
  display: inline-flex;
  flex-wrap: wrap;
  margin: -12px 0 0 -12px;
  width: calc(100% + 12px);
  max-width: 650px;
  button {
    flex: 1;
    min-width: 100px;
    min-width: 100px;
    margin: 12px 0 0 12px;
  }
`;

const InputUnit = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: gainsboro;
  padding: 0.3rem 0.6rem;
  border-radius: 0 4px 4px 0;
  box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
  border: 1px solid;
  border-left: none;
`;

const CoinGeckoPrice = "https://api.coingecko.com/api/v3/simple/price";

export default function Vault() {
  const { account, chainId, web3 } = useWeb3();
  const router = useRouter();
  const { id } = router.query;

  const vault = vaults.find((vault) => vault.id === id);

  const [ethBalance, setEthBalance] = useState();

  const [vaultDecimals, setVaultDecimals] = useState();
  const [vaultVersion, setVaultVersion] = useState();
  const [vaultDepositLimit, setVaultDepositLimit] = useState();
  const [vaultAvailableLimit, setVaultAvailableLimit] = useState();
  const [vaultTotalAssets, setVaultTotalAssets] = useState();
  const [vaultPricePerShare, setVaultPricePerShare] = useState();
  const [vaultTokenPrice, setVaultTokenPrice] = useState();

  const [userVaultShares, setUserVaultShares] = useState();
  const [userTokenBalance, setUserTokenBalance] = useState();

  const [vaultStrategies, setVaultStrategies] = useState([]);

  const vaultTotalAum = useMemo(() => {
    if (!vaultDecimals || !vaultTotalAssets || !vaultTokenPrice) return undefined;
    let toFloat = new BigNumber(10).pow(new BigNumber(vaultDecimals.sub(2).toString()));
    let numAum = new BigNumber(vaultTotalAssets.toString()).div(toFloat);
    return numAum.div(100).times(vaultTokenPrice);
  }, [vaultDecimals, vaultTotalAssets, vaultTokenPrice]);

  const userSharesPrice = useMemo(() => {
    if (!vaultDecimals || !userVaultShares || !vaultTokenPrice) return undefined;
    let toFloat = new BigNumber(10).pow(new BigNumber(vaultDecimals.sub(2).toString()));
    let numAum = new BigNumber(userVaultShares.toString()).div(toFloat);
    return numAum.div(100).times(vaultTokenPrice);
  }, [vaultDecimals, userVaultShares, vaultTokenPrice]);

  useEffect(() => {
    if (web3 && account && vault) {
      web3.getBalance(account).then(setEthBalance);
      const contract = new Contract(vault.address, abiVaultV2, web3);
      contract.decimals().then(setVaultDecimals);
      contract.apiVersion().then(setVaultVersion);
      contract.depositLimit().then(setVaultDepositLimit);
      contract.availableDepositLimit().then(setVaultAvailableLimit);
      contract.totalAssets().then(setVaultTotalAssets);
      contract.pricePerShare().then(setVaultPricePerShare);

      contract.balanceOf(account).then(setUserVaultShares);
      const token = new Contract(vault.wantAddress, abiErc20, web3);
      token.balanceOf(account).then(setUserTokenBalance).catch(console.error);

      (async () => {
        let i = 0,
          address = NullAddress;
        setVaultStrategies([]);
        do {
          address = await contract.withdrawalQueue(i++);
          if (address !== NullAddress) {
            const strategyContract = new Contract(address, abiStrategy, web3);
            const name = await strategyContract.name();
            setVaultStrategies((array) => [...array, { address, name }]);
          }
        } while (address !== NullAddress);
      })();

      fetch(
        `${CoinGeckoPrice}?${new URLSearchParams({
          ids: vault.coingeckoSymbol.toLowerCase(),
          vs_currencies: "usd",
        })}`
      )
        .then((res) => res.json())
        .then((res) => {
          const symbol = vault.coingeckoSymbol.toLowerCase();
          if (!!res[symbol].usd) {
            setVaultTokenPrice(new BigNumber(res[symbol].usd).times(1e6));
          }
        });
    }
  }, [web3, account]);

  const vaultLimitPercentage = useMemo(() => {
    if (!vaultDepositLimit || !vaultAvailableLimit) return 0;
    if (vaultDepositLimit.isZero()) return 0;
    const depositLimit = new BigNumber(vaultDepositLimit.toString());
    const availableLimit = new BigNumber(vaultAvailableLimit.toString());
    return depositLimit.minus(availableLimit).dividedBy(depositLimit).toNumber();
  }, [vaultDepositLimit, vaultAvailableLimit]);

  if (!id) {
    return (
      <Page>
        <p>Loading ...</p>
      </Page>
    );
  } else if (!vault) {
    router.replace("/");
    return <Page />;
  }

  return (
    <Page>
      <Head>
        <title>{vault.title}</title>
      </Head>
      <h1>
        <Title>{vault.logo}</Title> <Title>{vault.title}</Title>
      </h1>
      <Connect />
      <hr />
      <Warning>
        this experiment is experimental. It's extremely risky and will probably be discarded when the test is over.
        Proceed with extreme caution.
      </Warning>
      <Link href={"/"} passHref>
        <span>
          {"<< "}
          <Dotted>Back home</Dotted>
        </span>
      </Link>
      <Section>
        <p>
          <span>Vault: 📃 </span>
          <Dotted color="gray" href={`//${chains[chainId || "1"].explorer}/address/${vault.address}`} target="_blank">
            Contract
          </Dotted>
        </p>
        <p>
          <span>Version: </span>
          <Suspense wait={vaultVersion}>{vaultVersion}</Suspense>
        </p>
        <p>
          <span>{vault.wantSymbol} price (CoinGecko 🦎): </span>
          <Suspense wait={vaultTokenPrice}>${formatUnits(vaultTokenPrice, 6, 2)}</Suspense>
        </p>
        <p>
          <span>Deposit Limit: </span>
          <Suspense wait={vaultDepositLimit && vaultDecimals}>
            {formatUnits(vaultDepositLimit, vaultDecimals)} {vault.wantSymbol}
          </Suspense>
        </p>
        <p>
          <span>Total Assets: </span>
          <Suspense wait={vaultTotalAssets && vaultDecimals}>
            {formatUnits(vaultTotalAssets, vaultDecimals, 2)} {vault.wantSymbol}
          </Suspense>
        </p>
        <p>
          <span>Total AUM: </span>
          <Suspense wait={vaultTotalAum}>${formatUnits(vaultTotalAum, 6, 2)}</Suspense>
        </p>
        <br />
        <p>
          <span>Price Per Share: </span>
          <Suspense wait={vaultPricePerShare && vaultDecimals}>
            {formatUnits(vaultPricePerShare, vaultDecimals)}
          </Suspense>
        </p>
        <p>
          <span>Available limit: </span>
          <Suspense wait={vaultAvailableLimit && vaultDecimals}>
            {formatUnits(vaultAvailableLimit, vaultDecimals, 10)} {vault.wantSymbol}
          </Suspense>
        </p>
        <VaultLimit value={vaultLimitPercentage} />
      </Section>
      <Section>
        <h3>Strategies</h3>
        <div>
          {vaultStrategies.map((strategy, i) => (
            <div key={strategy.address}>
              <p>
                <b>Strat. {i}</b> {strategy.name}
              </p>
              <p>
                <span>Address: 📃 </span>
                <Dotted
                  color="gray"
                  href={`//${chains[chainId || "1"].explorer}/address/${strategy.address}`}
                  target="_blank"
                >
                  Contract
                </Dotted>
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <h3>Wallet</h3>
        <p>
          <span>Your account: </span>
          {shortenAddress(account)}
        </p>
        <p>
          <span>Your vault shares: </span>
          <Suspense wait={userVaultShares && vaultDecimals}>{formatUnits(userVaultShares, vaultDecimals, 2)}</Suspense>
        </p>
        <p>
          <span>Your shares value: </span>
          <Suspense wait={userSharesPrice}>${formatUnits(userSharesPrice, 6, 2)}</Suspense>
        </p>
        <p>
          <span>Your {vault.wantSymbol} balance: </span>
          <Suspense wait={userTokenBalance && vaultDecimals}>
            {formatUnits(userTokenBalance, vaultDecimals, 2)}
          </Suspense>
        </p>
        <p>
          <span>Your ETH balance: </span>
          <Suspense wait={ethBalance}>{formatUnits(ethBalance, 18, 10)} Ξ</Suspense>
        </p>
      </Section>
      <Section>
        <label>
          Amount (<Dotted>Max</Dotted>)
        </label>
        <Amount>
          <input
            inputMode="decimal"
            title="Token Amount"
            autoComplete="off"
            autoCorrect="off"
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder={"0.0"}
            minLength={1}
            maxLength={79}
            spellCheck="false"
          />
          <InputUnit>{vault.wantSymbol}</InputUnit>
        </Amount>
      </Section>
      <Section>
        <Buttons>
          <button>🚀 Approve</button>
          <button>🏦 Deposit</button>
          <button>🏦 Deposit All</button>
          <button>💸 Withdraw All</button>
        </Buttons>
      </Section>
    </Page>
  );
}
