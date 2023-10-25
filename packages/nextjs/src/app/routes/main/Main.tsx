import React, { FC, ReactElement, useCallback, useContext, useEffect, useState } from "react";
import {
  CreateTransactionPage as CreateTransactionPageUI,
  FrontPage as FrontPageUI,
  MainPageContracts,
  MainPageFooter,
  MainPageHeader,
  MainPageMenu,
  OwnersPage as OwnersPageUI,
  TransactionsPage as TransactionsPageUI,
} from "./components";
import { useScaffoldHooks as useScaffoldHooksExamples } from "./hooks/useScaffoldHooksExamples";
import { GenericContract } from "eth-components/ant/generic-contract";
import { transactor } from "eth-components/functions";
import { EthComponentsSettingsContext } from "eth-components/models";
import { useBalance, useContractLoader, useContractReader, useGasPrice } from "eth-hooks";
import { useEventListener } from "eth-hooks";
import { useEthersContext } from "eth-hooks/context";
import { useDexEthPrice } from "eth-hooks/dapps";
import { BigNumber, ethers } from "ethers";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Hints, Subgraph } from "~~/app/routes";
import { useAppContracts } from "~~/app/routes/main/hooks/useAppContracts";
import { useBurnerFallback } from "~~/app/routes/main/hooks/useBurnerFallback";
import { useScaffoldProviders as useScaffoldAppProviders } from "~~/app/routes/main/hooks/useScaffoldAppProviders";
import { localProvider, mainnetProvider } from "~~/config/providersConfig";
import { subgraphUri } from "~~/config/subgraphConfig";
import { MetaMultiSigWallet } from "~~/generated/contract-types";
import { getNetworkInfo } from "~~/helpers/getNetworkInfo";
import { NETWORKS } from "~~/models/constants/networks";
import "~~/styles/main-page.css";

export const DEBUG = false;

export const Main: FC = () => {
  // -----------------------------
  // Providers, signers & wallets
  // -----------------------------

  const poolServerUrl = "http://localhost:49832/";

  // 🛰 providers
  // see useLoadProviders.ts for everything to do with loading the right providers
  const scaffoldAppProviders = useScaffoldAppProviders();

  // 🦊 Get your web3 ethers context from current providers
  const ethersContext = useEthersContext();

  // if no user is found use a burner wallet on localhost as fallback if enabled
  useBurnerFallback(scaffoldAppProviders, true);

  // -----------------------------
  // Contracts use examples
  // -----------------------------
  // ⚙ contract config
  // get the contracts configuration for the app
  const appContractConfig = useAppContracts();

  // Load in your 📝 readonly contract and read a value from it:
  const readContracts = useContractLoader(appContractConfig);

  // If you want to make 🔐 write transactions to your contracts, pass the signer:
  const writeContracts = useContractLoader(appContractConfig, ethersContext?.signer);

  // 👾 external contract example
  // If you want to bring in the mainnet DAI contract it would look like:
  // you need to pass the appropriate provider (readonly) or signer (write)
  const mainnetContracts = useContractLoader(appContractConfig, mainnetProvider, NETWORKS["mainnet"].chainId);

  // -----------------------------
  // example for current contract and listners
  // -----------------------------
  const metaMultiSigWalletContractRead = readContracts["MetaMultiSigWallet"] as MetaMultiSigWallet;
  // keep track of a variable from the contract in the local React state:
  // const purpose = useContractReader<string>(metaMultiSigWalletContractRead, {
  //   contractName: 'YourContract',
  //   functionName: 'purpose',
  // });

  // 📟 Listen for broadcast events
  // const setPurposeEvents = useEventListener(yourContractRead, 'SetPurpose', 1);

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // 💵 This hook will get the price of ETH from 🦄 Uniswap:
  const ethPrice = useDexEthPrice(scaffoldAppProviders.mainnetProvider, scaffoldAppProviders.targetNetwork);

  // 💰 this hook will get your balance
  const yourCurrentBalance = useBalance(ethersContext.account ?? "");

  // -----------------------------
  // Hooks use and examples
  // -----------------------------
  // 🎉 Console logs & More hook examples:  Check out this to see how to get
  useScaffoldHooksExamples(scaffoldAppProviders, readContracts, writeContracts, mainnetContracts);

  const executeTransactionEvents = useEventListener(metaMultiSigWalletContractRead, "ExecuteTransaction", 1);

  const contractName = "MetaMultiSigWallet";

  const ownerEvents = useEventListener(metaMultiSigWalletContractRead, "Owner", 1);
  const signaturesRequired = useContractReader<BigNumber[]>(metaMultiSigWalletContractRead, {
    contractName,
    functionName: "signaturesRequired",
  });

  const [accountAddress] = useDebounce<string | undefined>(ethersContext.account, 200, {
    trailing: true,
  });

  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const gasPrice = useGasPrice(ethersContext.chainId, "fast");
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);

  const nonce = useContractReader<BigNumber[]>(readContracts[contractName], {
    contractName,
    functionName: "nonce",
  });

  // -----------------------------
  // .... 🎇 End of examples
  // -----------------------------

  const [route, setRoute] = useState<string>("");
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  return (
    <div className="App">
      <MainPageHeader scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />

      {/* Routes should be added between the <Switch> </Switch> as seen below */}
      <BrowserRouter>
        <MainPageMenu route={route} setRoute={setRoute} />
        <Switch>
          <Route exact path="/">
            <FrontPageUI
              executeTransactionEvents={executeTransactionEvents}
              contractName={contractName}
              localProvider={localProvider}
              readContracts={readContracts}
              price={ethPrice}
              mainnetProvider={mainnetProvider}
            />
          </Route>
          <Route exact path="/owners">
            <OwnersPageUI
              contractName={contractName}
              mainnetProvider={mainnetProvider}
              readContracts={readContracts}
              ownerEvents={ownerEvents}
              signaturesRequired={signaturesRequired ? signaturesRequired[0] : undefined}
            />
          </Route>
          <Route path="/create">
            <CreateTransactionPageUI
              poolServerUrl={poolServerUrl}
              contractName={contractName}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              price={ethPrice}
              readContracts={readContracts}
              address={accountAddress}
              signer={ethersContext.signer}
              nonce={nonce && nonce[0]}
              chainId={ethersContext.chainId}
            />
          </Route>
          <Route path="/pool">
            <TransactionsPageUI
              poolServerUrl={poolServerUrl}
              contractName={contractName}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              price={ethPrice}
              readContracts={readContracts}
              writeContracts={writeContracts}
              address={accountAddress}
              signer={ethersContext.signer}
              signaturesRequired={signaturesRequired ? signaturesRequired[0] : undefined}
              nonce={nonce && nonce[0]}
              tx={tx}
              chainId={ethersContext.chainId}
            />
          </Route>
          <Route exact path="/debug">
            <MainPageContracts
              scaffoldAppProviders={scaffoldAppProviders}
              mainnetContracts={mainnetContracts}
              appContractConfig={appContractConfig}
            />
          </Route>
          {/* you can add routes here like the below examlples */}
          <Route path="/hints">
            <Hints
              address={ethersContext?.account ?? ""}
              yourCurrentBalance={yourCurrentBalance}
              mainnetProvider={scaffoldAppProviders.mainnetProvider}
              price={ethPrice}
            />
          </Route>
          {/* <Route path="/mainnetdai">
            {mainnetProvider != null && (
              <GenericContract
                contractName="DAI"
                contract={mainnetContracts?.['DAI']}
                mainnetProvider={scaffoldAppProviders.mainnetProvider}
                blockExplorer={NETWORKS['mainnet'].blockExplorer}
                contractConfig={appContractConfig}
              />
            )}
          </Route> */}
          {/* <Route path="/subgraph">
            <Subgraph
              subgraphUri={subgraphUri}
              writeContracts={writeContracts}
              mainnetProvider={scaffoldAppProviders.mainnetProvider}
            />
          </Route> */}
        </Switch>
      </BrowserRouter>

      <MainPageFooter scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />
    </div>
  );
};

export default Main;
